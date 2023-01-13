import React from 'react';
import { Form, Input, DatePicker } from 'antd';
import moment from 'moment';
import { Const, Tips } from 'qmkit';
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

export default class EditForm extends React.Component<any, any> {
  props: {
    form: any,
    relaxProps?: {
      formData: IMap;
      editFormData: Function;
    };
  };

  render() {
    const { formData } = this.props.relaxProps;
    const { getFieldDecorator } = this.props.form;

    return (
      <Form className="login-form errorFeedback">
        <FormItem {...formItemLayout} label="计划名称">
          {
            getFieldDecorator('planName', {
              rules: [
                { required: true, whitespace: true, message: '请输入计划名称' },
                { max: 20, message: '最多20字符' }
              ],
              onChange: (e) => this._changeFormData('planName', e.target.value),
              initialValue: formData.get('planName')
            })(<Input />)
          }
          <Tips title="字段提示信息demo" />
        </FormItem>
        <FormItem {...formItemLayout} label="触发条件标志 0:否1:是">
          {
            getFieldDecorator('triggerFlag', {
              rules: [
                { required: true, whitespace: true, message: '请输入触发条件标志 0:否1:是' },
              ],
              onChange: (e) => this._changeFormData('triggerFlag', e.target.value),
              initialValue: formData.get('triggerFlag') || formData.get('triggerFlag') == 0 ? formData.get('triggerFlag').toString() : null
            })(<Input />)
          }
        </FormItem>
        <FormItem {...formItemLayout} label="触发条件，以逗号分隔">
          {
            getFieldDecorator('triggerCondition', {
              rules: [
                { max: 65535, message: '最多65535字符' }
              ],
              onChange: (e) => this._changeFormData('triggerCondition', e.target.value),
              initialValue: formData.get('triggerCondition')
            })(<Input />)
          }
        </FormItem>
        <FormItem {...formItemLayout} label="计划开始时间">
          {
            getFieldDecorator('startDate', {
              rules: [
                { required: true, whitespace: true, message: '请输入计划开始时间' }
              ],
              onChange: (date, dateStr) => {
                this._changeFormData('startDate', date ? dateStr : null)
              },
              initialValue: this._getInitDate(formData.get('startDate'), Const.DAY_FORMAT)
            })(
              <DatePicker
                {...this._getDateCommProps(Const.DAY_FORMAT)}
                disabledDate={this._disabledDate}
              />)
          }
        </FormItem>
        <FormItem {...formItemLayout} label="计划结束时间">
          {
            getFieldDecorator('endDate', {
              rules: [
                { required: true, whitespace: true, message: '请输入计划结束时间' }
              ],
              onChange: (date, dateStr) => {
                this._changeFormData('endDate', date ? dateStr : null)
              },
              initialValue: this._getInitDate(formData.get('endDate'), Const.DAY_FORMAT)
            })(
              <DatePicker
                {...this._getDateCommProps(Const.DAY_FORMAT)}
                disabledDate={this._disabledDate}
              />)
          }
        </FormItem>
        <FormItem {...formItemLayout} label="目标人群类型（0-全部，1-会员等级，2-会员人群，3-自定义）">
          {
            getFieldDecorator('receiveType', {
              rules: [
                { required: true, whitespace: true, message: '请输入目标人群类型（0-全部，1-会员等级，2-会员人群，3-自定义）' },
              ],
              onChange: (e) => this._changeFormData('receiveType', e.target.value),
              initialValue: formData.get('receiveType') || formData.get('receiveType') == 0 ? formData.get('receiveType').toString() : null
            })(<Input />)
          }
        </FormItem>
        <FormItem {...formItemLayout} label="目标人群值">
          {
            getFieldDecorator('receiveValue', {
              rules: [
                { max: 65535, message: '最多65535字符' }
              ],
              onChange: (e) => this._changeFormData('receiveValue', e.target.value),
              initialValue: formData.get('receiveValue')
            })(<Input />)
          }
        </FormItem>
        <FormItem {...formItemLayout} label="是否送积分 0:否1:是">
          {
            getFieldDecorator('pointFlag', {
              rules: [
                { required: true, whitespace: true, message: '请输入是否送积分 0:否1:是' },
              ],
              onChange: (e) => this._changeFormData('pointFlag', e.target.value),
              initialValue: formData.get('pointFlag') || formData.get('pointFlag') == 0 ? formData.get('pointFlag').toString() : null
            })(<Input />)
          }
        </FormItem>
        <FormItem {...formItemLayout} label="赠送积分值">
          {
            getFieldDecorator('points', {
              onChange: (e) => this._changeFormData('points', e.target.value),
              initialValue: formData.get('points') || formData.get('points') == 0 ? formData.get('points').toString() : null
            })(<Input />)
          }
        </FormItem>
        <FormItem {...formItemLayout} label="是否送优惠券 0:否1:是">
          {
            getFieldDecorator('couponFlag', {
              rules: [
                { required: true, whitespace: true, message: '请输入是否送优惠券 0:否1:是' },
              ],
              onChange: (e) => this._changeFormData('couponFlag', e.target.value),
              initialValue: formData.get('couponFlag') || formData.get('couponFlag') == 0 ? formData.get('couponFlag').toString() : null
            })(<Input />)
          }
        </FormItem>
        <FormItem {...formItemLayout} label="是否每人限发次数 0:否1:是">
          {
            getFieldDecorator('customerLimitFlag', {
              rules: [
                { required: true, whitespace: true, message: '请输入是否每人限发次数 0:否1:是' },
              ],
              onChange: (e) => this._changeFormData('customerLimitFlag', e.target.value),
              initialValue: formData.get('customerLimitFlag') || formData.get('customerLimitFlag') == 0 ? formData.get('customerLimitFlag').toString() : null
            })(<Input />)
          }
        </FormItem>
        <FormItem {...formItemLayout} label="每人限发次数值">
          {
            getFieldDecorator('customerLimit', {
              onChange: (e) => this._changeFormData('customerLimit', e.target.value),
              initialValue: formData.get('customerLimit') || formData.get('customerLimit') == 0 ? formData.get('customerLimit').toString() : null
            })(<Input />)
          }
        </FormItem>
        <FormItem {...formItemLayout} label="权益礼包总数">
          {
            getFieldDecorator('giftPackageTotal', {
              rules: [
                { required: true, whitespace: true, message: '请输入权益礼包总数' },
              ],
              onChange: (e) => this._changeFormData('giftPackageTotal', e.target.value),
              initialValue: formData.get('giftPackageTotal') || formData.get('giftPackageTotal') == 0 ? formData.get('giftPackageTotal').toString() : null
            })(<Input />)
          }
        </FormItem>
        <FormItem {...formItemLayout} label="已发送礼包数">
          {
            getFieldDecorator('giftPackageCount', {
              onChange: (e) => this._changeFormData('giftPackageCount', e.target.value),
              initialValue: formData.get('giftPackageCount') || formData.get('giftPackageCount') == 0 ? formData.get('giftPackageCount').toString() : null
            })(<Input />)
          }
        </FormItem>
        <FormItem {...formItemLayout} label="短信标识 0:否1:是">
          {
            getFieldDecorator('smsFlag', {
              rules: [
                { required: true, whitespace: true, message: '请输入短信标识 0:否1:是' },
              ],
              onChange: (e) => this._changeFormData('smsFlag', e.target.value),
              initialValue: formData.get('smsFlag') || formData.get('smsFlag') == 0 ? formData.get('smsFlag').toString() : null
            })(<Input />)
          }
        </FormItem>
        <FormItem {...formItemLayout} label="站内信标识 0:否1:是">
          {
            getFieldDecorator('appPushFlag', {
              rules: [
                { required: true, whitespace: true, message: '请输入站内信标识 0:否1:是' },
              ],
              onChange: (e) => this._changeFormData('appPushFlag', e.target.value),
              initialValue: formData.get('appPushFlag') || formData.get('appPushFlag') == 0 ? formData.get('appPushFlag').toString() : null
            })(<Input />)
          }
        </FormItem>
        <FormItem {...formItemLayout} label="是否暂停 0:开启1:暂停">
          {
            getFieldDecorator('pauseFlag', {
              rules: [
                { required: true, whitespace: true, message: '请输入是否暂停 0:开启1:暂停' },
              ],
              onChange: (e) => this._changeFormData('pauseFlag', e.target.value),
              initialValue: formData.get('pauseFlag') || formData.get('pauseFlag') == 0 ? formData.get('pauseFlag').toString() : null
            })(<Input />)
          }
        </FormItem>
      </Form>
    );
  }

  /**
   * 修改表单字段
   */
  _changeFormData = (key, value) => {
    const { editFormData } = this.props.relaxProps;
    editFormData({ key, value });
  };

  /**
   * 获取初始化的日期时间
   */
  _getInitDate(dateStr, dateFormat) {
    return dateStr ? moment(dateStr, dateFormat) : null
  }

  /**
   * 日期时间组件公用属性
   */
  _getDateCommProps(dateFormat) {
    return {
      getCalendarContainer: () => document.getElementById('page-content'),
      allowClear: true,
      format: dateFormat
    }
  }

  /**
   * 不可选的日期
   */
  _disabledDate(current) {
    return current && current.valueOf() > Date.now();
  }
}
