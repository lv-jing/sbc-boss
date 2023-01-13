import React from 'react';
import { Row, Col, Button, Input, Form } from 'antd';
import PropTypes from 'prop-types';
import { AuthWrapper, QMMethod, Tips } from 'qmkit';
import Store from '../store';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { FormattedMessage } from 'react-intl';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 8,
    xs: { span: 8 },
    sm: { span: 8 }
  },
  wrapperCol: {
    span: 14,
    xs: { span: 14 },
    sm: { span: 14 }
  }
};

export default class StoreRatioSettingForm extends React.Component<any, any> {
  form;

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
    const state = this._store.state();

    if (state.get('loading')) {
      return null;
    }

    const ratio = state.get('ratio');
    return (
      <Form
        style={{ paddingBottom: 50, maxWidth: 900 }}
        onSubmit={this._handleSubmit}
      >
        <Row>
          <Col span={18}>
            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="Store.Commodity" />}
              required={true}
            >
              {getFieldDecorator('goodsRatio', {
                initialValue: ratio.get('goodsRatio'),
                rules: [
                  {
                    required: true,
                    message: 'Please fill in the product comment coefficient'
                  },
                  {
                    validator: (rule, value, callback) => {
                      QMMethod.validatorRatioLength(rule, value, callback, '');
                    }
                  }
                ]
              })(
                <Input
                  placeholder="Two decimal places between 0 and 1"
                  onChange={(e: any) =>
                    this._store.changeRatioInfo({
                      key: 'goodsRatio',
                      value: e.target.value
                    })
                  }
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={18}>
            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="Store.Service" />}
              required={true}
            >
              {getFieldDecorator('serverRatio', {
                initialValue: ratio.get('serverRatio'),
                rules: [
                  {
                    required: true,
                    message: 'Please fill in the service comment coefficient'
                  },
                  {
                    validator: (rule, value, callback) => {
                      QMMethod.validatorRatioLength(rule, value, callback, '');
                    }
                  }
                ]
              })(
                <Input
                  placeholder="Two decimal places between 0 and 1"
                  onChange={(e) =>
                    this._store.changeRatioInfo({
                      key: 'serverRatio',
                      value: (e.target as any).value
                    })
                  }
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={18}>
            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="Store.Logistics" />}
              required={true}
            >
              {getFieldDecorator('logisticsRatio', {
                initialValue: ratio.get('logisticsRatio'),
                rules: [
                  {
                    required: true,
                    message: 'Please fill in the logistics score coefficient'
                  },
                  {
                    validator: (rule, value, callback) => {
                      QMMethod.validatorRatioLength(rule, value, callback, '');
                    }
                  }
                ]
              })(
                <Input
                  placeholder="Two decimal places between 0 and 1"
                  onChange={(e) =>
                    this._store.changeRatioInfo({
                      key: 'logisticsRatio',
                      value: (e.target as any).value
                    })
                  }
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Tips title="The coefficient maintenance total is 1. After the adjustment, the coefficient calculation will take effect in the next statistics, and the merchant evaluation will be counted daily" />
        <AuthWrapper functionName="f_share_app_edit">
          <div className="bar-button">
            <Button type="primary" htmlType="submit">
              save
            </Button>
          </div>
        </AuthWrapper>
      </Form>
    );
  }

  /**
   * 提交
   */
  _handleSubmit = (e) => {
    e.preventDefault();
    const form = this.props.form as WrappedFormUtils;
    form.validateFields(null, (errs, values) => {
      if (!errs) {
        (this._store as any).editRatio(values);
      }
    });
  };
}
