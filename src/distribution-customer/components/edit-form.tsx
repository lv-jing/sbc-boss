import React from 'react';
import { Store } from 'plume2';
import PropTypes from 'prop-types';
import { Form, Input, Select } from 'antd';
import { ValidConst } from 'qmkit';

const Option = Select.Option;
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
    const customerForm = _state.get('customerForm');

    let customerAccount = {};

    //如果是编辑状态
    if (_state.get('edit')) {
      customerAccount = {
        initialValue: customerForm.get('customerAccount')
      };
    }

    const distributorLevelIds = _state.get('distributorLevelIds');
    return (
      <Form>
        <FormItem
          {...formItemLayout}
          label="用户手机号"
          required={true}
          hasFeedback={true}
        >
          {getFieldDecorator('customerAccount', {
            ...customerAccount,
            rules: [
              {
                required: true,
                message: '请准确输入客户手机号',
                whitespace: true
              },
              { pattern: ValidConst.phone, message: '请输入正确的手机号' }
            ]
          })(<Input placeholder="请准确输入客户手机号" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="分销员等级">
          {getFieldDecorator('distributorLevelId', {
            initialValue: null,
            rules: [{ required: true, message: '请选择分销员等级' }]
          })(
            <Select dropdownStyle={{ zIndex: 1053 }}>
              <Option value={null}>请选择</Option>
              {distributorLevelIds &&
                distributorLevelIds.map((v) => (
                  <Option
                    key={v.get('distributorLevelId').toString()}
                    value={v.get('distributorLevelId').toString()}
                  >
                    {v.get('distributorLevelName')}
                  </Option>
                ))}
            </Select>
          )}
        </FormItem>
      </Form>
    );
  }
}
