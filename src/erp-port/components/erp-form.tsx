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

export default class ErpForm extends React.Component<any, any> {
  render() {
    return (
      <Form>
        <FormItem {...formItemLayout} label="提供商">
          <Input />
        </FormItem>
        <FormItem {...formItemLayout} label="地址">
          <Input />
        </FormItem>
        <FormItem {...formItemLayout} label="服务器">
          <Input />
        </FormItem>
        <FormItem {...formItemLayout} label="主账号">
          <Input />
        </FormItem>
        <FormItem {...formItemLayout} label="AppKey">
          <Input />
        </FormItem>
        <FormItem {...formItemLayout} label="AppSecret">
          <Input />
        </FormItem>
        <FormItem {...formItemLayout} label="Token">
          <Input />
        </FormItem>
        <FormItem {...formItemLayout} label="是否开启" required>
          <RadioGroup>
            <Radio value={1}>是</Radio>
            <Radio value={0}>否</Radio>
          </RadioGroup>
        </FormItem>
      </Form>
    );
  }
}
