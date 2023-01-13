import React from 'react';
import { Col, Form, Row } from 'antd';
import { Relax, IMap } from 'plume2';
import { FormattedMessage } from 'react-intl';

const FormItem = Form.Item;

@Relax
export default class StepFour extends React.Component<any, any> {
  props: {
    form: any;
    relaxProps?: {
      paymentInfo: IMap;
    };
  };

  static relaxProps = {
    paymentInfo: 'paymentInfo'
  };

  render() {
    const { paymentInfo } = this.props.relaxProps;
    const formItemLayout = {
      labelCol: {
        span: 4,
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        span: 20,
        xs: { span: 24 },
        sm: { span: 14 }
      }
    };
    return (
      <div style={{ padding: '20px 0 40px 0' }}>
        <Form {...formItemLayout}>
          <Row>
            <Col span={12}>
              <FormItem label={<FormattedMessage id='Store.IBAN' />}>
                <span>{paymentInfo.get('bankNo')}</span>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                label={<FormattedMessage id='Store.Payout' />}>
                <span>{paymentInfo.get('payoutSummaryLabel')}</span>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                label={<FormattedMessage id='Store.Debit' />}>
                <span>{paymentInfo.get('debitSummaryLabel')}</span>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}
