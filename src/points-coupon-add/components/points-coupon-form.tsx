import React, { Component } from 'react';

import { Button, DatePicker, Form } from 'antd';

import { Const, history, noop } from 'qmkit';
import moment from 'moment';
import ChooseCoupons from '../common-components/choose-coupons';

const FormItem = Form.Item;

const formItemLayout = {
  title: {
    fontSize: 14,
    marginBottom: 10,
    display: 'block'
  }
};

const { RangePicker } = DatePicker;

export default class PointsCouponForm extends Component<any, any> {
  props: {
    form: any;
    location: any;
    relaxProps?: {
      // 开始时间
      startTime: string;
      // 结束时间
      endTime: string;
      // 按钮禁用
      btnDisabled: boolean;
      // 修改时间区间方法
      changeDateRange: Function;
      doAdd: Function;
      // 优惠券
      activity: any;
      onChosenCoupons: Function;
      onDelCoupon: Function;
      onCouponChange: Function;
    };
  };

  static relaxProps = {
    startTime: 'startTime',
    endTime: 'endTime',
    btnDisabled: 'btnDisabled',
    activity: 'activity',

    changeDateRange: noop,
    doAdd: noop,
    onChosenCoupons: noop,
    onDelCoupon: noop,
    onCouponChange: noop
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      startTime,
      endTime,
      changeDateRange,
      btnDisabled
    } = this.props.relaxProps;
    return (
      <div style={{ width: '100%' }}>
        <Form style={{ width: '100%' }}>
          <FormItem
            {...formItemLayout}
            label="选择优惠券"
            style={{ width: '100%' }}
          >
            {this.chooseCoupon().dom}
          </FormItem>

          <FormItem {...formItemLayout} label="兑换时间">
            {getFieldDecorator('time', {
              rules: [
                { required: true, message: '请选择起止时间' },
                {
                  validator: (_rule, value, callback) => {
                    if (
                      value &&
                      moment(new Date()).unix() > moment(value[0]).unix()
                    ) {
                      callback('开始时间不能早于现在');
                    } else {
                      callback();
                    }
                  }
                }
              ],
              onChange: (date, dateString) => {
                if (date) {
                  changeDateRange({
                    startTime: dateString[0] + ':00',
                    endTime: dateString[1] + ':00'
                  });
                }
              },
              initialValue: startTime &&
                endTime && [moment(startTime), moment(endTime)]
            })(
              <RangePicker
                getCalendarContainer={() =>
                  document.getElementById('page-content')
                }
                allowClear={false}
                format={Const.DATE_FORMAT}
                placeholder={['起始时间', '结束时间']}
                disabledDate={this._disabledDate}
                showTime={{ format: 'HH:mm' }}
              />
            )}
          </FormItem>
        </Form>
        <div className="bar-button">
          <Button
            disabled={btnDisabled}
            type="primary"
            onClick={() => this.onAdd()}
            style={{ marginRight: 10 }}
          >
            保存
          </Button>
          <Button onClick={() => history.goBack()} style={{ marginLeft: 10 }}>
            取消
          </Button>
        </div>
      </div>
    );
  }

  /**
   * 已选优惠券结构
   */
  chooseCoupon = () => {
    const {
      activity,
      onChosenCoupons,
      onDelCoupon,
      onCouponChange
    } = this.props.relaxProps;
    const { getFieldDecorator } = this.props.form;
    const { form } = this.props;
    let coupons = activity.get('coupons');
    return {
      dom: getFieldDecorator('coupons', {
        initialValue: coupons.toJS(),
        rules: [{ required: true, message: '请选择优惠券' }]
      })(
        <ChooseCoupons
          // type={99}
          form={form}
          coupons={activity.get('coupons').toJS()}
          invalidCoupons={activity.get('invalidCoupons').toJS()}
          onChosenCoupons={(coupons) => {
            onChosenCoupons(coupons);
          }}
          onDelCoupon={async (couponId) => {
            onDelCoupon(couponId);
          }}
          onCouponChange={(couponId, field, value) =>
            onCouponChange(couponId, field, value)
          }
        />
      )
    };
  };

  /**
   * 开始兑换不可选的日期
   */
  _disabledDate(current) {
    return current < moment().startOf('day');
  }

  onAdd() {
    const { doAdd } = this.props.relaxProps;
    this.props.form.validateFields((err) => {
      if (!err) {
        doAdd();
      } else {
        this.setState({
          flushStatus: Math.random()
        });
      }
    });
  }
}
