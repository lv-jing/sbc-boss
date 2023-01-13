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
        <FormItem {...formItemLayout} label="功能显示名称" hasFeedback>
          {getFieldDecorator('functionTitle', {
            initialValue: objInfo.title,
            rules: [{ required: true, message: '请输入功能显示名称' }]
          })(<Input />)}
        </FormItem>

        <FormItem {...formItemLayout} label="功能名称" hasFeedback>
          {getFieldDecorator('functionName', {
            initialValue: objInfo.authNm,
            rules: [{ required: true, message: '请输入功能名称' }]
          })(<Input />)}
          <Tips title="功能名称不能重复,建议以'f_'打头(比如:f_sku_edit)" />
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
