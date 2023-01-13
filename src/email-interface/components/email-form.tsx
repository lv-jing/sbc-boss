import React from 'react';
import { Form, Input, Radio } from 'antd';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Store } from 'plume2';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 }
  }
};
const FormDiv = styled.div`
  font-size: 12px;
  .title {
    font-size: 14px;
    color: #333;
    margin-bottom: 15px;
  }
  .upload-tip {
    position: absolute;
    top: 0;
    right: 34px;
    color: #999;
  }
  .app-main {
    font-size: 14px;
    color: #999;
  }
`;

export default class EmailForm extends React.Component<any, any> {
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
    const store = this._store;
    const emailConfig = store.state().get('emailConfig');
    const changeEmailFormValue = (this._store as any).changeEmailFormValue;
    const { getFieldDecorator } = this.props.form;

    const isRequired = emailConfig.get('status') == 1;

    return (
      <FormDiv>
        <Form className="login-form">
          <FormItem {...formItemLayout} label="启用开关" required>
            {getFieldDecorator('status', {
              initialValue: emailConfig.get('status'),
              rules: [{ required: true, message: '请设置启用开关' }]
            })(
              <RadioGroup
                onChange={async (e) => {
                  await changeEmailFormValue('status', e.target.value);
                  this.props.form.validateFields(
                    [
                      'fromEmailAddress',
                      'fromPerson',
                      'emailSmtpHost',
                      'emailSmtpPort',
                      'authCode'
                    ],
                    { force: true }
                  );
                }}
              >
                <Radio value={1}>启用</Radio>
                <Radio value={0}>禁用</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="发信人" required={isRequired}>
            {getFieldDecorator('fromPerson', {
              initialValue: emailConfig.get('fromPerson'),
              rules: [
                {
                  required: isRequired,
                  whitespace: true,
                  message: '请输入发信人'
                },
                { max: 20, message: '最多20个字符' }
              ]
            })(
              <Input
                onChange={(e) =>
                  changeEmailFormValue('fromPerson', e.target.value)
                }
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="SMTP服务器"
            required={isRequired}
          >
            {getFieldDecorator('emailSmtpHost', {
              initialValue: emailConfig.get('emailSmtpHost'),
              rules: [
                {
                  required: isRequired,
                  whitespace: true,
                  message: '请输入SMTP服务器'
                },
                { max: 20, message: '最多20个字符' }
              ]
            })(
              <Input
                onChange={(e) =>
                  changeEmailFormValue('emailSmtpHost', e.target.value)
                }
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="SMTP端口号"
            required={isRequired}
          >
            {getFieldDecorator('emailSmtpPort', {
              initialValue: emailConfig.get('emailSmtpPort'),
              rules: [
                {
                  required: isRequired,
                  whitespace: true,
                  message: '请输入SMTP端口号'
                },
                { max: 10, message: '最多10个字符' }
              ]
            })(
              <Input
                onChange={(e) =>
                  changeEmailFormValue('emailSmtpPort', e.target.value)
                }
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="SMTP账号" required={isRequired}>
            {getFieldDecorator('fromEmailAddress', {
              initialValue: emailConfig.get('fromEmailAddress'),
              rules: [
                {
                  required: isRequired,
                  whitespace: true,
                  message: '请输入SMTP账号'
                },
                { max: 50, message: '最多50个字符' },
                {
                  pattern: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/,
                  message: '您填写的邮箱格式有误，请检查后重新输入'
                }
              ]
            })(
              <Input
                onChange={(e) =>
                  changeEmailFormValue('fromEmailAddress', e.target.value)
                }
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="SMTP密码" required={isRequired}>
            {getFieldDecorator('authCode', {
              initialValue: emailConfig.get('authCode'),
              rules: [
                {
                  required: isRequired,
                  whitespace: true,
                  message: '请输入SMTP密码'
                },
                { max: 20, message: '最多20个字符' }
              ]
            })(
              <Input
                onChange={(e) =>
                  changeEmailFormValue('authCode', e.target.value)
                }
              />
            )}
          </FormItem>
        </Form>
      </FormDiv>
    );
  }
}
