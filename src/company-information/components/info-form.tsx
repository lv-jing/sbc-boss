import React from 'react';
import { Row, Col, Button, Input, Form, Icon, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import { AuthWrapper, QMMethod, checkAuth } from 'qmkit';
import { Store } from 'plume2';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { FormattedMessage } from 'react-intl';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 8,
    xs: { span: 6 },
    sm: { span: 8 }
  },
  wrapperCol: {
    span: 14,
    xs: { span: 14 },
    sm: { span: 16 }
  }
};

export default class InfoForm extends React.Component<any, any> {
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
    const _state = this._store.state();
    const infoForm = _state.get('infomation');

    let companyName = {
      initialValue: infoForm.get('companyName')
    };

    return (
      <Form
        className="login-form"
        style={{ paddingBottom: 50, maxWidth: 950 }}
        onSubmit={this._handleSubmit}
      >
        <Row>
          <Col span={10}>
            <FormItem
              {...formItemLayout}
              label={<FormattedMessage id="Setting.CompanyName" />}
              hasFeedback
              required={true}
            >
              {getFieldDecorator('companyName', {
                ...companyName,
                rules: [
                  {
                    validator: (rule, value, callback) => {
                      if (!value.trim()) {
                        callback(new Error('Please fill in company information'));
                        return;
                      }
                      QMMethod.validatorMinAndMax(
                        rule,
                        value,
                        callback,
                        'Company Name',
                        1,
                        20
                      );
                    }
                  }
                ]
              })(<Input size="large" readOnly={!checkAuth('f_basicSetting_1')} />)}
            </FormItem>
          </Col>
          <Col span={14}>
            <div style={styles.toolBox}>
              <Tooltip
                placement="right"
                title="The company name is both the name of your front-end mall (including PC mall and mobile mall) and the name of your management back-end."
              >
                <Icon style={{ color: '#999' }} type="exclamation-circle" />
              </Tooltip>
            </div>
          </Col>
        </Row>
        <AuthWrapper functionName={'f_companyInformation_1'}>
          <div className="bar-button">
            <Button type="primary" htmlType="submit" disabled={!checkAuth('f_basicSetting_1')}>
              Save
            </Button>
          </div>
        </AuthWrapper>
      </Form>
    );
  }

  /**
   * 提交
   * @param e
   * @private
   */
  _handleSubmit = (e) => {
    e.preventDefault();
    const form = this.props.form as WrappedFormUtils;
    form.validateFields(null, (errs, values) => {
      if (!errs) {
        (this._store as any).editInfo(values);
      }
    });
  };
}

const styles = {
  box: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  } as any,
  plus: {
    color: '#999',
    fontSize: '28px'
  },
  alertBox: {
    marginLeft: 10
  },
  toolBox: {
    marginLeft: 10,
    height: 40,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  } as any
};
