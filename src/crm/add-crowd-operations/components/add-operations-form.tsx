import React from 'react';
import {
  Form,
  Input,
  Select,
  Radio,
  DatePicker,
  Checkbox,
  Row,
  Col,
  Button,
  InputNumber
} from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import { fromJS } from 'immutable';
import ChooseCoupons from '../../../coupon-activity-add/common-components/choose-coupons';
import RadioGroup from 'antd/lib/radio/group';
import { ValidConst, history } from 'qmkit';
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;
const dateFormat = 'YYYY/MM/DD';

const OPTS = [
  { key: 1, value: '有访问' },
  { key: 2, value: '有收藏' },
  { key: 3, value: '有加购' },
  { key: 4, value: '有下单' },
  { key: 5, value: '有付款' }
];

const formItemLayout = {
  labelCol: {
    span: 3
  },
  wrapperCol: {
    span: 20
  }
};

const shortFormLayout = {
  labelCol: {
    span: 3
  },
  wrapperCol: {
    span: 9
  }
};

const halfFormLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 18
  }
};

export default class AddOperationsForm extends React.Component<any, any> {
  props;
  _store: any;

  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
    this.state = {
      appPushFlag: 0,
      couponFlag: 0,
      customerLimitFlag: 0,
      pointFlag: 0,
      smsFlag: 0,
      triggerFlag: 0,
      flag: false
    };
  }

  componentWillReceiveProps() {
    let planName = this.props.operationForm.get('planName');
    if (
      !this.state.flag &&
      planName !== null &&
      planName !== undefined &&
      planName !== ''
    ) {
      let operationForm = this.props.operationForm.toJS();
      const {
        appPushFlag,
        couponFlag,
        customerLimitFlag,
        pointFlag,
        smsFlag,
        triggerFlag
      } = operationForm;
      this.setState({
        appPushFlag,
        couponFlag,
        customerLimitFlag,
        pointFlag,
        smsFlag,
        triggerFlag,
        flag: true
      });
    }
  }

  render() {
    const { form } = this.props;
    const store = this._store;
    const operationForm = this.props.operationForm.toJS();
    const activity = this.props.activity.toJS();
    const {
      appPushFlag,
      couponFlag,
      customerLimit,
      customerLimitFlag,
      endDate,
      giftPackageTotal,
      planName,
      pointFlag,
      points,
      receiveValue,
      smsFlag,
      startDate,
      triggerConditions,
      triggerFlag
    } = operationForm;
    const { coupons, invalidCoupons } = activity;
    const {
      getCustomerTotal,
      customerGroupList,
      customerTotal,
      form: { getFieldDecorator, setFieldsValue },
      getCustomerGroupList
    } = this.props;
    const ifModify = +this.props.ifModify;

    return (
      <div className="add-crowd-operations-group">
        <div className="sub-title">基础设置</div>
        <Form>
          <FormItem label="计划名称" {...shortFormLayout}>
            {getFieldDecorator('planName', {
              initialValue: planName,
              rules: [
                { required: true, whitespace: true, message: '请填写计划名称' },
                { min: 1, max: 20, message: '仅限1-20位字符' }
              ]
            })(<Input disabled={!ifModify} placeholder="仅限1-20位字符" />)}
          </FormItem>
          <FormItem label="触发条件" {...shortFormLayout}>
            {getFieldDecorator('triggerFlag', {
              initialValue: +triggerFlag,
              rules: [{ required: true, message: '' }]
            })(
              <Radio.Group
                disabled={!ifModify}
                onChange={(e) => {
                  this.setState({
                    triggerFlag: e.target.value
                  });
                }}
              >
                <Radio key={0} value={0}>
                  无需触发
                </Radio>
                <Radio key={1} value={1}>
                  需触发
                </Radio>
              </Radio.Group>
            )}
          </FormItem>
          {this.state.triggerFlag ? (
            <div className="flex-form">
              <FormItem
                label="在会员"
                style={{ width: '50%', marginBottom: 0 }}
                {...halfFormLayout}
              >
                {getFieldDecorator('triggerConditions', {
                  initialValue: triggerConditions
                    ? triggerConditions
                    : undefined,
                  rules: [{ required: true, message: '请选择触发条件' }]
                })(
                  <Select
                    disabled={!ifModify}
                    dropdownStyle={{ zIndex: 1053 }}
                    placeholder="请选择触发条件"
                  >
                    {OPTS.map((v) => (
                      <Option key={v.key} value={v.key}>
                        {v.value}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
              <span style={{ paddingLeft: '10px' }}>后触发</span>
            </div>
          ) : null}
          <div className="flex-form">
            <FormItem
              label="计划时间"
              required
              style={{ width: '50%', marginBottom: 0 }}
              {...halfFormLayout}
            >
              {getFieldDecorator('timeRange', {
                initialValue:
                  startDate && endDate
                    ? [
                        moment(startDate, dateFormat),
                        moment(endDate, dateFormat)
                      ]
                    : null,
                rules: [{ required: true, message: '请选择计划时间' }]
              })(
                <RangePicker
                  disabled={!ifModify}
                  placeholder={['开始日期', '结束日期']}
                  format={dateFormat}
                  disabledDate={(current) => {
                    return current && current < moment().endOf('day');
                  }}
                />
              )}
            </FormItem>
            {this.state.triggerFlag ? (
              <p style={{ paddingLeft: '10px' }}>
                计划持续时间内会向目标人群中满足了触发条件的会员发送权益
              </p>
            ) : (
              <div style={{ paddingLeft: '10px' }}>
                <p>计划开始后立即向目标人群已有会员发送1次权益礼包</p>
                <p>计划时间内，人群内如有新增会员，也可收到1次权益礼包</p>
              </div>
            )}
          </div>
          <div className="flex-form">
            <FormItem
              label="目标人群"
              style={{ width: '50%', marginBottom: 0 }}
              {...halfFormLayout}
            >
              {getFieldDecorator('receiveValue', {
                initialValue: receiveValue ? receiveValue : undefined,
                rules: [{ required: true, message: '请选择会员人群' }]
              })(
                <Select
                  disabled={!ifModify}
                  // mode="multiple"
                  placeholder="输入人群名称搜索"
                  filterOption={false}
                  showSearch
                  onSearch={(value) => {
                    getCustomerGroupList({ groupName: value });
                  }}
                  onChange={(value) => {
                    getCustomerTotal([value]);
                  }}
                >
                  {customerGroupList &&
                    customerGroupList.map((cate) => {
                      return (
                        <Option
                          key={cate.get('groupId')}
                          value={cate.get('groupId')}
                        >
                          {cate.get('groupName')}
                        </Option>
                      );
                    })}
                </Select>
              )}
            </FormItem>
            <span style={{ marginLeft: '10px' }}>
              已选<span style={{ color: '#F56614' }}>{customerTotal}</span>人
            </span>
          </div>
          <div className="sub-title">权益礼包</div>
          <FormItem label="选择权益" {...formItemLayout} required>
            {getFieldDecorator('pointFlag', {
              initialValue: pointFlag
            })(
              <Checkbox
                checked={this.state.pointFlag}
                disabled={!ifModify}
                onChange={(e) => {
                  if (this.state.pointFlag) {
                    setFieldsValue({ points: null });
                  }
                  this.setState({ pointFlag: e.target.checked });
                }}
              >
                <span style={{ marginRight: '10px' }}>送积分</span>
                <FormItem
                  style={{ display: 'inline-block', marginBottom: '0px' }}
                >
                  {getFieldDecorator('points', {
                    initialValue: points,
                    rules: [
                      {
                        required: !!this.state.pointFlag,
                        message: '请输入积分'
                      },
                      {
                        pattern: ValidConst.noZeroNineNumber,
                        message: '请输入1-999999999的整数'
                      }
                    ]
                  })(
                    <InputNumber
                      disabled={!this.state.pointFlag || !ifModify}
                    />
                  )}
                  <span style={{ paddingLeft: '5px' }}></span>分
                </FormItem>
              </Checkbox>
            )}
          </FormItem>
          <Row>
            <Col push={3} span={20}>
              <FormItem
                style={
                  !!this.state.couponFlag ? { position: 'absolute' } : null
                }
              >
                {getFieldDecorator('couponFlag', {
                  initialValue: !!couponFlag
                })(
                  <Checkbox
                    checked={this.state.couponFlag}
                    disabled={!ifModify}
                    onChange={(e) => {
                      this.setState({ couponFlag: e.target.checked });
                    }}
                  >
                    送优惠券
                  </Checkbox>
                )}
              </FormItem>
              {this.state.couponFlag ? (
                <FormItem style={{ marginBottom: '16px' }}>
                  {getFieldDecorator('coupons')(
                    <ChooseCoupons
                      form={form}
                      coupons={coupons}
                      invalidCoupons={invalidCoupons}
                      onChosenCoupons={(coupons) => {
                        store.onChosenCoupons(coupons);
                        this._validCoupons(fromJS(coupons), form);
                      }}
                      onDelCoupon={async (couponId) => {
                        store.onDelCoupon(couponId);
                        this._validCoupons(coupons, form);
                      }}
                      onChangeCouponTotalCount={(index, totalCount) =>
                        store.changeCouponTotalCount(index, totalCount)
                      }
                      type={3}
                      mode={1}
                      disable={!ifModify}
                    />
                  )}
                </FormItem>
              ) : null}
            </Col>
          </Row>
          {this.state.triggerFlag ? (
            <FormItem
              style={{ height: 45 }}
              className="chooseNum"
              {...formItemLayout}
              label="每人限发次数"
              required
            >
              {getFieldDecorator('customerLimitFlag', {
                initialValue: customerLimitFlag
              })(
                <RadioGroup
                  disabled={!ifModify}
                  onChange={(e) => {
                    if (this.state.customerLimitFlag) {
                      setFieldsValue({ customerLimit: null });
                    }
                    this.setState({
                      customerLimitFlag: e.target.value
                    });
                  }}
                >
                  <Radio value={0}>不限</Radio>
                  <Radio value={1}>
                    <FormItem
                      style={{
                        display: 'inline-block',
                        marginBottom: '0px',
                        marginTop: '-5px'
                      }}
                    >
                      {getFieldDecorator('customerLimit', {
                        initialValue: customerLimit,
                        rules: [
                          {
                            required: !!this.state.customerLimitFlag,
                            message: '请输入每人限发次数'
                          },
                          {
                            pattern: ValidConst.noZeroNineNumber,
                            message: '请输入1-999999999的整数'
                          }
                        ]
                      })(
                        <InputNumber
                          disabled={!this.state.customerLimitFlag || !ifModify}
                        />
                      )}
                      <span style={{ color: '#999', paddingLeft: 10 }}>
                        选择不限则会员达到1次条件都向其发送1次权益礼包
                      </span>
                    </FormItem>
                  </Radio>
                </RadioGroup>
              )}
            </FormItem>
          ) : null}
          <FormItem
            className="chooseNum"
            {...formItemLayout}
            label="权益礼包总数"
            required
          >
            {getFieldDecorator('giftPackageTotal', {
              initialValue: giftPackageTotal,
              rules: [
                {
                  required: true,
                  message: '请填写权益礼包总数'
                },
                {
                  pattern: ValidConst.noZeroNineNumber,
                  message: '请输入1-999999999的整数'
                }
              ]
            })(<InputNumber disabled={!ifModify} />)}
            <span style={{ color: '#999', paddingLeft: '5px' }}>
              达到上限后不再发放
            </span>
          </FormItem>
          <div className="sub-title">发送消息</div>
          <div className="send-sms">
            <div className="sms">
              <FormItem style={{ marginBottom: 0 }}>
                {getFieldDecorator('smsFlag', { initialValue: !!smsFlag })(
                  <Checkbox
                    checked={this.state.smsFlag}
                    disabled={!ifModify}
                    onChange={(e) => {
                      this.setState({ smsFlag: e.target.checked });
                    }}
                  >
                    短信
                  </Checkbox>
                )}
              </FormItem>
              <p className="info">请确保短信剩余条数，防止发送失败。</p>
              {+this.state.smsFlag === 1 && this.props.planSms !== null ? (
                <div className="sms-content">
                  <p className="context">
                    {'【' +
                      this.props.planSms.get('signName') +
                      '】' +
                      this.props.planSms.get('templateContent')}
                  </p>
                  <div className="cover" onClick={this._showSendSettingModal}>
                    点击查看或重新设置
                  </div>
                </div>
              ) : (
                <Button
                  style={{ margin: '10px 0' }}
                  className="setting"
                  type="dashed"
                  disabled={!this.state.smsFlag}
                  onClick={this._showSendSettingModal}
                >
                  设置短信
                </Button>
              )}
            </div>

            <div className="sms">
              <FormItem style={{ marginBottom: 0 }}>
                {getFieldDecorator('appPushFlag', {
                  initialValue: !!appPushFlag
                })(
                  <Checkbox
                    checked={this.state.appPushFlag}
                    disabled={!ifModify}
                    onChange={(e) => {
                      this.setState({ appPushFlag: e.target.checked });
                    }}
                  >
                    App Push
                  </Checkbox>
                )}
              </FormItem>
              <p className="info">发送push的同时会默认给用户发送站内信。</p>
              {+this.state.appPushFlag === 1 &&
              this.props.planAppPush !== null &&
              this.props.planAppPush.get('noticeTitle') !== null ? (
                <div className="sms-content">
                  <div className="app-push">
                    <div className="app-push-con">
                      <p className="app-push-title">
                        {this.props.planAppPush.get('noticeTitle')}
                      </p>
                      <p className="app-push-context">
                        {this.props.planAppPush.get('noticeContext')}
                      </p>
                    </div>

                    {this.props.planAppPush.get('coverUrl') ? (
                      <img
                        className="app-push-img"
                        src={this.props.planAppPush.get('coverUrl')}
                      />
                    ) : null}
                  </div>
                  <div className="cover" onClick={this._showAppPushModal}>
                    点击查看或重新设置
                  </div>
                </div>
              ) : (
                <Button
                  className="setting"
                  type="dashed"
                  style={{ margin: '10px 0' }}
                  disabled={!this.state.appPushFlag}
                  onClick={this._showAppPushModal}
                >
                  设置App Push
                </Button>
              )}
            </div>
          </div>
          <div className="bar-button">
            {ifModify ? (
              <Button className="btn" type="primary" onClick={this._onSave}>
                保存
              </Button>
            ) : null}
            {'  '}
            <Button
              className="btn"
              onClick={() => {
                history.goBack();
              }}
            >
              取消
            </Button>
          </div>
        </Form>
      </div>
    );
  }

  _showSendSettingModal = () => {
    this._store.setData({
      sendModalVisible: true
    });
  };

  _showAppPushModal = () => {
    this._store.setData({
      appPushModalVisible: true
    });
  };
  /**
   * 保存
   */
  _onSave = () => {
    const store = this._store as any;
    const activity = store.state().get('activity');
    const form = this.props.form;
    let errors = null;
    // 1.验证优惠券列表
    if (this.state.couponFlag) {
      errors = this._validCoupons(activity.get('coupons'), form);
    }
    // if (!activity.activityId) {
    //   form.resetFields(['time']);
    //   //强制校验创建时间
    //   if (
    //     moment().second(0) &&
    //     moment()
    //       .second(0)
    //       .unix() > moment(activity.get('startTime')).unix()
    //   ) {
    //     form.setFields({
    //       ['time']: {
    //         errors: [new Error('开始时间不能小于当前时间')]
    //       }
    //     });
    //     errors = true;
    //   }
    // }
    // 2.验证其它表单信息
    this.props.form.validateFields(null, (errs, values) => {
      if (!errs && !errors) {
        // 3.验证通过，保存
        this.props.saveOperation(values);
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
