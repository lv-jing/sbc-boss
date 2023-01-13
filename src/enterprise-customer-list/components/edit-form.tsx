import React from 'react';
import { Store } from 'plume2';
import PropTypes from 'prop-types';
import { Form, Input, Select } from 'antd';
import { AreaSelect, ValidConst, QMMethod, FindBusiness } from 'qmkit';

const FormItem = Form.Item;

const Option = Select.Option;
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

const tailFormItemLayout = {
  wrapperCol: {
    span: 24,
    xs: {
      span: 24,
      offset: 0
    },
    sm: {
      span: 14,
      offset: 6
    }
  }
};

export default class EditForm extends React.Component<any, any> {
  _store: Store;

  //声明上下文依赖
  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    const _state = this._store.state();
    const employees = _state.get('employee');
    const customerLevels = _state.get('customerLevels');
    const customerForm = _state.get('customerForm');

    let customerName = {};
    let customerAccount = {};

    //如果是编辑状态
    if (_state.get('edit')) {
      customerName = {
        initialValue: customerForm.get('customerName')
      };

      customerAccount = {
        initialValue: customerForm.get('customerAccount')
      };
    }

    return (
      <Form>
        <FormItem
          {...formItemLayout}
          label="客户名称"
          required={true}
          hasFeedback={true}
        >
          {getFieldDecorator('customerName', {
            ...customerName,
            rules: [
              // { required: true, message: '请填写客户名称', whitespace: true},
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorTrimMinAndMax(
                    rule,
                    value,
                    callback,
                    '客户名称',
                    2,
                    15
                  );
                }
              }
            ]
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="所在地区">
          {getFieldDecorator('area')(<AreaSelect />)}
        </FormItem>
        <FormItem {...formItemLayout} label="详细地址">
          {getFieldDecorator('customerAddress', {
            rules: [
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorMinAndMax(
                    rule,
                    value,
                    callback,
                    '详细地址',
                    5,
                    60
                  );
                }
              }
            ]
          })(<Input />)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={'联系人'}
          required={true}
          hasFeedback={true}
        >
          {getFieldDecorator('contactName', {
            rules: [
              // { required: true, message: '请填写联系人', whitespace: true },
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorTrimMinAndMax(
                    rule,
                    value,
                    callback,
                    '联系人',
                    2,
                    15
                  );
                }
              }
            ]
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label={'联系方式'} hasFeedback={true}>
          {getFieldDecorator('contactPhone', {
            rules: [
              { required: true, message: '请填写联系方式', whitespace: true },
              { pattern: ValidConst.phone, message: '请输入正确的联系方式' }
            ]
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="平台客户等级">
          {getFieldDecorator('customerLevelId', {
            initialValue: null,
            rules: [{ required: true, message: '请选择平台客户等级' }]
          })(
            <Select dropdownStyle={{ zIndex: 1053 }}>
              <Option value={null}>请选择</Option>
              {customerLevels.map((v) => (
                <Option
                  key={v.get('customerLevelId').toString()}
                  value={v.get('customerLevelId').toString()}
                >
                  {v.get('customerLevelName')}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="业务员">
          {getFieldDecorator('employeeId', {
            initialValue: null,
            rules: [{ required: true, message: '请选择业务员' }]
          })(
            <Select dropdownStyle={{ zIndex: 1053 }}>
              <Option value={null}>请选择</Option>
              {employees.map((v) => (
                <Option key={v.get('employeeId')} value={v.get('employeeId')}>
                  {v.get('employeeName')}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="公司性质">
          {getFieldDecorator('businessNatureType', {
            initialValue: null,
            rules: [{ required: true, message: '请选择公司性质' }]
          })(
            <Select dropdownStyle={{ zIndex: 1053 }}>
              <Option value={null}>请选择</Option>
              {FindBusiness.getBusinessNatures().map((v) => (
                <Option key={v.get('value')} value={v.get('value')}>
                  {v.get('label')}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label={'公司名称'} hasFeedback={true}>
          {getFieldDecorator('enterpriseName', {
            rules: [
              { required: true, message: '请按营业执照填写', whitespace: true },
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorMinAndMax(
                    rule,
                    value,
                    callback,
                    '公司名称',
                    2,
                    60
                  );
                }
              },
              {
                pattern: ValidConst.companyName,
                message: '公司名称只能由中文、英文、数字及“_”、“-”、()、（）'
              }
            ]
          })(<Input />)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={'统一社会信用代码'}
          hasFeedback={true}
        >
          {getFieldDecorator('socialCreditCode', {
            rules: [
              {
                required: true,
                message: '即纳税人识别号（税号）',
                whitespace: true
              },
              {
                pattern: ValidConst.socialCreditCode,
                message: '请填写正确的统一社会信用代码且必须8-30字符'
              }
            ]
          })(<Input />)}
        </FormItem>

        <FormItem {...tailFormItemLayout} style={{ marginBottom: 8 }}>
          请以有效的客户手机号开通账号
        </FormItem>
        <FormItem {...formItemLayout} label={'账号'} hasFeedback>
          {getFieldDecorator('customerAccount', {
            ...customerAccount,
            rules: [
              { required: true, message: '请填写客户手机号码' },
              { pattern: ValidConst.phone, message: '请输入正确的手机号码' }
            ]
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label={'密码'} hasFeedback>
          {getFieldDecorator('customerPassword', {
            initialValue: '********'
          })(<Input disabled={true} />)}
        </FormItem>
        <FormItem {...tailFormItemLayout} style={{ marginBottom: 8 }}>
          点击确认后将会发送账号密码至客户注册账号的手机
        </FormItem>
      </Form>
    );
  }
}
