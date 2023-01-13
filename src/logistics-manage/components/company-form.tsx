import React from 'react';
import { Store } from 'plume2';
import { Form, Input, Row, Col } from 'antd';
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
    sm: { span: 18 }
  }
};

export default class CompanyForm extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  _store: Store;

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form>
        <FormItem {...formItemLayout} required label="物流公司名称">
          <Row>
            <Col span={15}>
              {getFieldDecorator('expressName', {
                rules: [
                  {
                    validator: (rule, value, callback) => {
                      QMMethod.validatorTrimMinAndMax(
                        rule,
                        value,
                        callback,
                        '公司名称',
                        1,
                        10
                      );
                    }
                  }
                ]
              })(<Input />)}
            </Col>
            <Col span={9}>
              <span>&nbsp;</span>
            </Col>
          </Row>
        </FormItem>
        <FormItem {...formItemLayout} required label="物流公司代码">
          <Row>
            <Col span={15}>
              {getFieldDecorator('expressCode', {
                rules: [
                  {
                    validator: (rule, value, callback) => {
                      QMMethod.validatorTrimMinAndMax(
                        rule,
                        value,
                        callback,
                        '代码',
                        1,
                        50
                      );
                    }
                  }
                ]
              })(<Input />)}
            </Col>
            <Col span={9}>
              <span>（由快递100提供）</span>
            </Col>
          </Row>
        </FormItem>
      </Form>
    );
  }
}
