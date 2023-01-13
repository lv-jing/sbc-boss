import React from 'react';
import { Form, Input, Radio } from 'antd';

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

export default class MailForm extends React.Component<any, any> {
  render() {
    return (
      <Form className="login-form">
        <FormItem {...formItemLayout} label="发信邮箱">
          <Input />
        </FormItem>
        <FormItem {...formItemLayout} label="发信人">
          <Input />
        </FormItem>
        <FormItem {...formItemLayout} label="SMTP服务器">
          <Input />
        </FormItem>
        <FormItem {...formItemLayout} label="SMTP端口号">
          <Input />
        </FormItem>
        <FormItem {...formItemLayout} label="SMTP账号">
          <Input />
        </FormItem>
        <FormItem {...formItemLayout} label="SMTP密码">
          <Input />
        </FormItem>
        <FormItem {...formItemLayout} label="是否验证">
          <RadioGroup>
            <Radio value={1}>是</Radio>
            <Radio value={2}>否</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem {...formItemLayout} required={true} label="是否开启">
          <RadioGroup>
            <Radio value={1}>是</Radio>
            <Radio value={2}>否</Radio>
          </RadioGroup>
        </FormItem>
      </Form>
    );
  }
}
