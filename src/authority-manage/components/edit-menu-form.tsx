import React from 'react';
import PropTypes from 'prop-types';
import { Store } from 'plume2';
import { Form, Input } from 'antd';
import { QMMethod, Tips } from 'qmkit';

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
        <FormItem {...formItemLayout} label="菜单名称" hasFeedback>
          {getFieldDecorator('menuName', {
            initialValue: objInfo.title,
            rules: [
              { required: true, message: '请输入菜单名称' },
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorMinAndMax(
                    rule,
                    value,
                    callback,
                    '菜单名称',
                    1,
                    100
                  );
                }
              }
            ]
          })(<Input />)}
        </FormItem>

        <FormItem {...formItemLayout} label="菜单URL" hasFeedback>
          {getFieldDecorator('menuUrl', {
            initialValue: objInfo.url
          })(<Input />)}
          <Tips title="三级菜单需要设置URL" />
        </FormItem>

        <FormItem {...formItemLayout} label="菜单Icon" hasFeedback>
          {getFieldDecorator('menuIcon', {
            initialValue: objInfo.icon
          })(<Input />)}
          <Tips title="一级、二级菜单需要设置icon" />
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
