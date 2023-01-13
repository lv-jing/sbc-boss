import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Radio } from 'antd';
import { Store } from 'plume2';
import { QMMethod } from 'qmkit';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
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

export default class SmsForm extends React.Component<any, any> {
  _store: Store;

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
    const smsForm = _state.get('smsSetting');

    let account = {
      initialValue: smsForm.get('account')
    };
    let interfaceUrl = {
      initialValue: smsForm.get('interfaceUrl')
    };
    let name = {
      initialValue: smsForm.get('name')
    };
    let password = {
      initialValue: smsForm.get('password')
    };
    let siteAddress = {
      initialValue: smsForm.get('siteAddress')
    };
    let status = {
      initialValue: smsForm.get('status')
    };
    let template = {
      initialValue: smsForm.get('template')
    };

    return (
      <Form className="login-form">
        <FormItem {...formItemLayout} label="接口名称" required>
          {getFieldDecorator('account', {
            ...account,
            rules: [
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorTrimMinAndMax(
                    rule,
                    value,
                    callback,
                    '接口名称',
                    1,
                    100
                  );
                }
              }
            ]
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="提供商" required>
          {getFieldDecorator('name', {
            ...name,
            rules: [
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorTrimMinAndMax(
                    rule,
                    value,
                    callback,
                    '提供商',
                    1,
                    100
                  );
                }
              }
            ]
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="申请地址" required>
          {getFieldDecorator('siteAddress', {
            ...siteAddress,
            rules: [
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorTrimMinAndMax(
                    rule,
                    value,
                    callback,
                    '申请地址',
                    1,
                    100
                  );
                }
              }
            ]
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="接口密码" required>
          {getFieldDecorator('password', {
            ...password,
            rules: [
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorTrimMinAndMax(
                    rule,
                    value,
                    callback,
                    '接口密码',
                    1,
                    100
                  );
                }
              }
            ]
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="短信接口地址" required>
          {getFieldDecorator('interfaceUrl', {
            ...interfaceUrl,
            rules: [
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorTrimMinAndMax(
                    rule,
                    value,
                    callback,
                    '短信接口地址',
                    1,
                    100
                  );
                }
              }
            ]
          })(<Input />)}
        </FormItem>
        {/*
          <FormItem {...formItemLayout} label="报备和签名" required>
            <Input/>
          </FormItem>
        */}
        <FormItem {...formItemLayout} label="短信内容" required>
          {getFieldDecorator('template', {
            ...template,
            rules: [
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorTrimMinAndMax(
                    rule,
                    value,
                    callback,
                    '短信内容',
                    1,
                    500
                  );
                }
              }
            ]
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="是否开启" required>
          {getFieldDecorator('status', {
            ...status
          })(
            <RadioGroup>
              <Radio value="1">是</Radio>
              <Radio value="0">否</Radio>
            </RadioGroup>
          )}
        </FormItem>
      </Form>
    );
  }
}
