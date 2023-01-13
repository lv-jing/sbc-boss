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

export default class ExpressForm extends React.Component<any, any> {
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
    const portForm = _state.get('portObj');
    let customerKey = {
      initialValue: portForm.customerKey
    };
    let deliveryKey = {
      initialValue: portForm.deliveryKey
    };
    let status = {
      initialValue: portForm.status
    };
    return (
      <Form>
        <FormItem {...formItemLayout} label="公司编号">
          {getFieldDecorator('customerKey', {
            ...customerKey,
            rules: [
              { required: true, message: '请填写公司编号' },
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorMinAndMax(
                    rule,
                    value,
                    callback,
                    '公司编号',
                    1,
                    50
                  );
                }
              }
            ]
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="授权秘钥key">
          {getFieldDecorator('deliveryKey', {
            ...deliveryKey,
            rules: [
              { required: true, message: '请填写授权秘钥' },
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorMinAndMax(
                    rule,
                    value,
                    callback,
                    '授权秘钥',
                    1,
                    50
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
              <Radio value={1}>是</Radio>
              <Radio value={0}>否</Radio>
            </RadioGroup>
          )}
        </FormItem>
      </Form>
    );
  }
}
