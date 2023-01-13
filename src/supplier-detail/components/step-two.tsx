import React from 'react';
import { Relax, IMap } from 'plume2';
import { Row, Col, Form, Modal } from 'antd';
import styled from 'styled-components';

import moment from 'moment';
import { FormattedMessage } from 'react-intl';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 4,
    xs: { span: 24 },
    sm: { span: 8 }
  },
  wrapperCol: {
    span: 20,
    xs: { span: 24 },
    sm: { span: 14 }
  }
};

const PicBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justifycontent: flex-start;
  width: 430px;

  img {
    width: 60px;
    height: 60px;
    padding: 5px;
    border: 1px solid #ddd;
    margin-right: 10px;
    margin-bottom: 10px;
  }
`;

@Relax
export default class StepTwo extends React.Component<any, any> {
  props: {
    form: any;
    relaxProps?: {
      company: IMap;
    };
  };

  static relaxProps = {
    company: 'company'
  };

  render() {
    const { company } = this.props.relaxProps;
    const info = company ? company.get('info') : {};
    return (
      <div style={{ padding: '20px 0 40px 0' }}>
        <Form {...formItemLayout}>
          <Row>
            <Col span={12}>
              <FormItem label={<FormattedMessage id="Store.Trader" />}>
                <p style={{ color: '#333' }}>{info.get('socialCreditCode')}</p>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label={<FormattedMessage id="Store.Type" />}>
                <p style={{ color: '#333' }}>{info.get('companyType')===1?'business':''}</p>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                label={<FormattedMessage id="Store.LegalCompanyName" />}
              >
                <p style={{ color: '#333' }}>{info.get('companyName')}</p>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label={<FormattedMessage id="Store.Chamber" />}>
                <p style={{ color: '#333' }}>{info.get('companyCode')}</p>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label={<FormattedMessage id="Store.ContactName" />}>
                <p style={{ color: '#333' }}>{info.get('contactName')}</p>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label={<FormattedMessage id="Store.PhoneNumber" />}>
                <p style={{ color: '#333' }}>{info.get('contactPhone')}</p>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}
