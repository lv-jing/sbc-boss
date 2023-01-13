import React from 'react';
import PropTypes from 'prop-types';
import { Store } from 'plume2';
import { Form, Input } from 'antd';
import { Tips } from 'qmkit';
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
    let objInfo = {} as any;
    if (_state.get('edit')) {
      objInfo = _state.get('objInfo').toJS();
    }

    return (
      <Form>
        <FormItem {...formItemLayout} label="权限显示名称" hasFeedback>
          {getFieldDecorator('authorityTitle', {
            initialValue: objInfo.title,
            rules: [{ required: true, message: '请输入权限显示名称' }]
          })(<Input />)}
        </FormItem>

        <FormItem {...formItemLayout} label="权限名称" hasFeedback>
          {getFieldDecorator('authorityName', {
            initialValue: objInfo.authNm
          })(<Input />)}
        </FormItem>

        <FormItem {...formItemLayout} label="接口URL" hasFeedback>
          {getFieldDecorator('authorityUrl', {
            initialValue: objInfo.url,
            rules: [{ required: true, message: '请输入接口URL' }]
          })(<Input />)}
        </FormItem>

        <FormItem {...formItemLayout} label="接口提交方式" hasFeedback>
          {getFieldDecorator('requestType', {
            initialValue: objInfo.reqType,
            rules: [{ required: true, message: '请输入接口提交方式' }]
          })(<Input />)}
          <Tips title="大写的GET、POST、PUT、DELETE..." />
        </FormItem>

        <FormItem {...formItemLayout} label="备注" hasFeedback>
          {getFieldDecorator('remark', {
            initialValue: objInfo.authRemark
          })(<Input />)}
        </FormItem>

        <FormItem {...formItemLayout} label="排序号" hasFeedback>
          {getFieldDecorator('sort', {
            initialValue: objInfo.sort,
            rules: [{ required: true, message: '请输入排序号' }]
          })(<Input />)}
        </FormItem>
      </Form>
    );
  }
}
