import React from 'react';
import { Form, Select, DatePicker, Input, Radio } from 'antd';
import { Store } from 'plume2';
import { QMMethod } from 'qmkit';
import { fromJS } from 'immutable';

import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

const FormItem = Form.Item;
const Option = Select.Option;

export default class DeliveryForm extends React.Component<any, any> {
  props: {
    form: any;
  };

  _store: Store;

  //声明上下文依赖
  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
    this.state = {
      logistciIsMandotory: true
    };
  }

  render() {
    const formItemLayout = {
      labelCol: {
        span: 2,
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        span: 24,
        xs: { span: 24 },
        sm: { span: 14 }
      }
    };

    const formRadioItemLayout = {
      labelCol: {
        span: 4,
        xs: { span: 24 },
        sm: { span: 12 }
      },
      wrapperCol: {
        span: 20,
        xs: { span: 24 },
        sm: { span: 12 }
      }
    };
    const { getFieldDecorator } = this.props.form;

    const store = this._store as any;

    const logistics = store.state().get('logistics');

    const options =
      fromJS(logistics) &&
      fromJS(logistics)
        .map((v) => (
          <Option
            key={v.get('expressCompanyId')}
            value={v.get('expressCompanyId') + ''}
          >
            {v.getIn(['expressCompany', 'expressName'])}
          </Option>
        ))
        .toArray();

    return (
      <div>
        <Form className="login-form">
          <FormItem
            {...formRadioItemLayout}
            label={<FormattedMessage id="Order.LogisticMandotory" />}
          >
            <Radio.Group
              value={this.state.logistciIsMandotory}
              onChange={(e) => {
                const value = (e.target as any).value;
                this.setState({ logistciIsMandotory: value }, () => {
                  this.props.form.setFieldsValue({
                    deliverId: null,
                    deliverNo: null,
                    deliverTime: null
                  });
                });
              }}
            >
              <Radio value={true}>
                <FormattedMessage id="Order.Yes" />
              </Radio>
              <Radio value={false}>
                <FormattedMessage id="Order.No" />
              </Radio>
            </Radio.Group>
          </FormItem>
          {this.state.logistciIsMandotory ? (
            <React.Fragment>
              <FormItem
                {...formItemLayout}
                required={true}
                label={<FormattedMessage id="Order.LogisticsCompany" />}
              >
                {getFieldDecorator('deliverId', {
                  rules: [
                    {
                      required: true,
                      message: (
                        <FormattedMessage id="Order.inputLogisticsCompany" />
                      )
                    }
                  ]
                })(
                  <Select
                    dropdownStyle={{ zIndex: 1053 }}
                    notFoundContent={
                      <FormattedMessage id="Order.notLogisticsCompany" />
                    }
                  >
                    {options}
                  </Select>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                required={true}
                label={<FormattedMessage id="Order.LogisticsOrder" />}
              >
                {getFieldDecorator('deliverNo', {
                  rules: [
                    {
                      required: true,
                      message: (
                        <FormattedMessage id="Order.inputLogisticsOrder" />
                      )
                    },
                    {
                      validator: (rule, value, callback) => {
                        QMMethod.validatorDeliveryCode(
                          rule,
                          value,
                          callback,
                          'logistics order'
                        );
                      }
                    }
                  ]
                })(<Input placeholder="" />)}
              </FormItem>
              <FormItem
                {...formItemLayout}
                required={true}
                label={<FormattedMessage id="Order.DeliverDate" />}
              >
                {getFieldDecorator('deliverTime', {
                  rules: [
                    {
                      required: true,
                      message: <FormattedMessage id="Order.inputDeliverDate" />
                    }
                  ]
                })(
                  <DatePicker
                    disabledDate={this.disabledDate}
                    style={{ width: '100%' }}
                  />
                )}
              </FormItem>
            </React.Fragment>
          ) : null}
        </Form>
      </div>
    );
  }

  disabledDate(current) {
    // Can not select days before today and today
    return current && current.valueOf() > Date.now();
  }
}
