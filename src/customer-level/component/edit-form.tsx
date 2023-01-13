import React from 'react';
import { Store } from 'plume2';
import PropTypes from 'prop-types';
import { Form, Input } from 'antd';
import { QMMethod } from 'qmkit';

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

    let customerLevelName = {};
    const _state = this._store.state();

    //如果是编辑状态
    if (_state.get('edit')) {
      customerLevelName = {
        initialValue: _state.getIn(['customerLevel', 'customerLevelName'])
      };
    }

    return (
      <Form>
        <FormItem {...formItemLayout} label="等级名称">
          {getFieldDecorator('customerLevelName', {
            ...customerLevelName,
            rules: [
              { required: true, message: '请输入等级名称', whitespace: true },
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorMinAndMax(
                    rule,
                    value,
                    callback,
                    '等级名称',
                    1,
                    20
                  );
                }
              }
            ]
          })(<Input />)}
        </FormItem>
      </Form>
    );
  }
}
