import * as React from 'react';
import {
  Form,
  Input,
  DatePicker,
  InputNumber,
  Radio,
  Row,
  Col,
  Button
} from 'antd';
import PropTypes from 'prop-types';
import { Store } from 'plume2';
import styled from 'styled-components';
import moment from 'moment';
import { Const, QMMethod, ValidConst, history } from 'qmkit';
import { fromJS } from 'immutable';
import ChooseCoupons from '../../common-components/choose-coupons';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const RadioGroup = Radio.Group;

const NumBox = styled.div`
  .chooseNum .has-error .ant-form-explain {
    margin-left: 90px;
  }
`;
const formItemLayout = {
  labelCol: {
    span: 3
  },
  wrapperCol: {
    span: 21
  }
};

export default class AllPresentAddForm extends React.Component<any, any> {
  props;
  _store: Store;

  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
  }

  render() {
    const { form } = this.props;
    const store = this._store as any;
    const activity = store.state().get('activity');
    const { getFieldDecorator } = form;

    return (
      <NumBox>
        <Form style={{ marginTop: 20 }}>
          <FormItem {...formItemLayout} label="活动名称">
            {getFieldDecorator('activityName', {
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: '请填写活动名称'
                },
                { min: 1, max: 40, message: '活动名称不超过40个字符' },
                {
                  validator: (rule, value, callback) => {
                    QMMethod.validatorEmoji(rule, value, callback, '活动名称');
                  }
                }
              ],
              onChange: (e) => {
                store.changeFormField({ activityName: e.target.value });
              },
              initialValue: activity.get('activityName')
            })(
              <Input
                placeholder="活动名称不超过40个字"
                style={{ width: 360 }}
              />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="活动时间">
            {getFieldDecorator('time', {
              rules: [
                { required: true, message: '请选择活动时间' },
                {
                  validator: (_rule, value, callback) => {
                    if (
                      value &&
                      moment()
                      .second(0)&&
                      moment()
                        .second(0)
                        .unix() > value[0].unix()
                    ) {
                      callback('开始时间不能早于现在');
                    } else if (value[0] && value[0].unix() >= value[1].unix()) {
                      callback('开始时间必须早于结束时间');
                    } else {
                      callback();
                    }
                  }
                }
              ],
              onChange: (date, dateString) => {
                if (date) {
                  store.changeFormField({
                    startTime: dateString[0] + ':00',
                    endTime: dateString[1] + ':00'
                  });
                }
              },
              initialValue: activity.get('startTime') &&
                activity.get('endTime') && [
                  moment(activity.get('startTime')),
                  moment(activity.get('endTime'))
                ]
            })(
              <RangePicker
                getCalendarContainer={() =>
                  document.getElementById('page-content')
                }
                disabledDate={(current) => {
                  return current && current.isBefore(moment().startOf('day'));
                }}
                allowClear={false}
                format={Const.DATE_FORMAT}
                placeholder={['开始时间', '结束时间']}
                showTime={{ format: 'HH:mm' }}
              />
            )}
            &nbsp;&nbsp;
            <span style={{ color: '#999' }}>
              相关优惠券仅限活动期间展示及领取
            </span>
          </FormItem>

          <FormItem {...formItemLayout} label="选择优惠券" required={true}>
            {getFieldDecorator('coupons', {})(
              <ChooseCoupons
                form={form}
                coupons={activity.get('coupons').toJS()}
                invalidCoupons={activity.get('invalidCoupons').toJS()}
                onChosenCoupons={(coupons) => {
                  store.onChosenCoupons(coupons);
                  this._validCoupons(fromJS(coupons), form);
                }}
                onDelCoupon={async (couponId) => {
                  store.onDelCoupon(couponId);
                  this._validCoupons(activity.get('coupons'), form);
                }}
                onChangeCouponTotalCount={(index, totalCount) =>
                  store.changeCouponTotalCount(index, totalCount)
                }
                type={0}
              />
            )}
          </FormItem>

          <FormItem
            className="chooseNum"
            {...formItemLayout}
            label="每人限领次数"
            required
          >
            <RadioGroup
              value={activity.get('receiveType')}
              onChange={async (e) => {
                await store.changeFormField({ receiveType: e.target.value });
                form.validateFields(['receiveCount'], { force: true });
              }}
            >
              <Radio value={0}>不限</Radio>
              <Radio value={1}>
                {getFieldDecorator('receiveCount', {
                  rules: [
                    {
                      required: activity.get('receiveType') == 1,
                      pattern: ValidConst.noZeroNineNumber,
                      message: '请输入1-999999999的整数'
                    }
                  ],
                  onChange: (val) =>
                    store.changeFormField({ receiveCount: val }),
                  initialValue: activity.get('receiveCount')
                })(<InputNumber disabled={activity.get('receiveType') != 1} />)}
                <span style={{ color: '#999' }}>
                  每个客户可领取的次数，每次仅限领取1张
                </span>
              </Radio>
            </RadioGroup>
          </FormItem>

          <FormItem {...formItemLayout} label="目标客户" required={true}>
            <RadioGroup defaultValue={0}>
              <Radio value={0}>全平台客户</Radio>
            </RadioGroup>
          </FormItem>
          <Row type="flex" justify="start">
            <Col span={3} />
            <Col span={10}>
              <Button
                onClick={() => this._onSave()}
                type="primary"
                htmlType="submit"
              >
                保存
              </Button>
              &nbsp;&nbsp;
              <Button onClick={() => history.goBack()}>返回</Button>
            </Col>
          </Row>
        </Form>
      </NumBox>
    );
  }

  /**
   * 保存
   */
  _onSave = () => {
    const store = this._store as any;
    const activity = store.state().get('activity');
    const form = this.props.form;
    // 1.验证优惠券列表
    let errors = this._validCoupons(activity.get('coupons'), form);
    if (!activity.activityId) {
      form.resetFields(['time']);
      //强制校验创建时间
      if (
        moment()
        .second(0) && 
        moment()
          .second(0)
          .unix() > moment(activity.get('startTime')).unix()
      ) {
        form.setFields({
          ['time']: {
            errors: [new Error('开始时间不能小于当前时间')]
          }
        });
        errors = true;
      }
    }
    // 2.验证其它表单信息
    this.props.form.validateFields(null, (errs) => {
      if (!errs && !errors) {
        // 3.验证通过，保存
        store.save();
      }
    });
  };

  /**
   * 验证优惠券列表
   */
  _validCoupons = (coupons, form) => {
    let errorFlag = false;
    form.resetFields(['coupons']);
    let errorObject = {};
    if (coupons.size == 0) {
      errorObject['coupons'] = {
        value: null,
        errors: [new Error('请选择优惠券')]
      };
      errorFlag = true;
    }
    form.setFields(errorObject);
    return errorFlag;
  };
}
