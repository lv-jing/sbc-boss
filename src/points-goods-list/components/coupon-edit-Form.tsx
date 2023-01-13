import React from 'react';
import { DatePicker, Form, Input } from 'antd';
import moment from 'moment';
import { Const, ValidConst } from 'qmkit';
import { IMap } from 'typings/globalType';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    span: 24,
    xs: { span: 24 },
    sm: { span: 14 }
  }
};

const { RangePicker } = DatePicker;

export default class CouponEditForm extends React.Component<any, any> {
  props: {
    form: any;
    relaxProps?: {
      couponVisible: boolean;
      formData: IMap;
      editCouponFormData: Function;
    };
  };

  render() {
    if (!this.props.relaxProps.couponVisible) {
      return null;
    }
    const { formData } = this.props.relaxProps;
    const { getFieldDecorator } = this.props.form;

    return (
      <Form className="login-form errorFeedback">
        <FormItem {...formItemLayout} label="优惠券名称">
          {formData.get('couponInfoVO').get('couponName')}
        </FormItem>
        <FormItem {...formItemLayout} label="优惠券价值">
          {'￥' + formData.get('couponInfoVO').get('denomination')}
        </FormItem>
        <FormItem {...formItemLayout} label="兑换数量">
          {getFieldDecorator('totalCount', {
            rules: [
              { required: true, whitespace: true, message: '请输入兑换数量' },
              {
                pattern: ValidConst.noZeroNineNumber,
                message: '请输入1-999999999的整数'
              }
            ],
            onChange: (e) => this._changeFormData('totalCount', e.target.value),
            initialValue:
              formData.get('totalCount') || formData.get('totalCount') == 0
                ? formData.get('totalCount').toString()
                : null
          })(<Input style={{ width: '70px' }} />)}
        </FormItem>
        <FormItem {...formItemLayout} label="兑换积分">
          {getFieldDecorator('points', {
            rules: [
              { required: true, whitespace: true, message: '请输入兑换积分' },
              {
                pattern: ValidConst.noZeroNineNumber,
                message: '请输入1-999999999的整数'
              }
            ],
            onChange: (e) => this._changeFormData('points', e.target.value),
            initialValue:
              formData.get('points') || formData.get('points') == 0
                ? formData.get('points').toString()
                : null
          })(<Input style={{ width: '70px' }} />)}
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
                this._changeFormData('beginTime', dateString[0] + ':00');
                this._changeFormData('endTime', dateString[1] + ':00');
              }
            },
            initialValue: formData.get('beginTime') &&
              formData.get('endTime') && [
                moment(formData.get('beginTime')),
                moment(formData.get('endTime'))
              ]
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
    );
  }

  /**
   * 修改表单字段
   */
  _changeFormData = (key, value) => {
    const { editCouponFormData } = this.props.relaxProps;
    editCouponFormData({ key, value });
  };

  /**
   * 开始兑换不可选的日期
   */
  _disabledDate(current) {
    return current < moment().startOf('day');
  }
}
