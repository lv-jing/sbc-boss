import React from 'react';
import { Relax, IMap } from 'plume2';
import { Row, Col, Form } from 'antd';
import moment from 'moment';
import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';

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

const GreyBg = styled.div`
  background: #f5f5f5;
  padding: 15px;
  color: #333333;
  margin-bottom: 20px;

  span {
    width: 100px;
    text-align: right;
    color: #666666;
    display: inline-block;
    margin: 5px 0;
  }

  .reason {
    padding-left: 100px;
    position: relative;
    word-break: break-all;

    span {
      position: absolute;
      left: 0;
      top: -5px;
    }
  }
`;

// 审核状态 0、待审核 1、已审核 2、审核未通过
const AUDIT_STATE = {
  0: <FormattedMessage id="Store.ToAudit" />,
  1: <FormattedMessage id="Store.Reviewed" />,
  2: <FormattedMessage id="Store.FailedAudit" />
};

// 店铺状态 0、开启 1、关店
const STORE_STATE = {
  0: <FormattedMessage id="Store.Open" />,
  1: <FormattedMessage id="Store.CloseShop" />
};

// 账户状态  0：启用   1：禁用
const ACCOUNT_STATE = {
  0: <FormattedMessage id="Store.Enable" />,
  1: <FormattedMessage id="Store.Disable" />
};

@Relax
export default class StepOne extends React.Component<any, any> {
  props: {
    form: any;
    relaxProps?: {
      company: IMap;
      dictionary: IMap;
    };
  };

  static relaxProps = {
    company: 'company',
    dictionary: 'dictionary'
  };

  getVaulesByData(data, ids) {
    let idlist = ids ? ids.toJS() : [];
    let valueList = [];

    idlist.map(function (item) {
      let result = data.find((x) => x.id.toString() === item);
      if (result) {
        valueList.push(result.valueEn);
      }
    });
    return valueList.join(',');
  }

  getVauleByData(data, id) {
    let result = data.find((x) => x.id === id);
    if (result) {
      return result.valueEn;
    }
    return '';
  }
  getCountryName = (data, id) => {
    let result = data.find((x) => x.id === id);
    if (result) {
      if (result.valueEn) {
        sessionStorage.setItem('currentCountry', result.valueEn);
      } else {
        sessionStorage.setItem('currentCountry', '');
      }
      return result.valueEn;
    }
    sessionStorage.setItem('currentCountry', '');
    return '';
  };

  render() {
    const { company, dictionary } = this.props.relaxProps;
    const storeInfo = company.get('storeInfo');
    const countryData = dictionary.get('country').toJS();
    const cityData = dictionary.get('city').toJS();
    const languageData = dictionary.get('language').toJS();
    const currencyData = dictionary.get('currency').toJS();
    const timeZoneData = dictionary.get('timeZone').toJS();
    return (
      <div>
        <Row>
          <Col span={8}>
            <FormItem
              {...formItemLayout}
              required={false}
              label={<FormattedMessage id="Store.shopLogo" />}
            >
              <img
                src={storeInfo.get('storeLogo')}
                style={{ width: '100px' }}
              ></img>
            </FormItem>
          </Col>
        </Row>
        <GreyBg>
          <Row>
            <Col span={8}>
              <span>
                <FormattedMessage id="Store.AuditStatus" />：
              </span>{' '}
              {storeInfo.get('auditState') != null
                ? AUDIT_STATE[storeInfo.get('auditState')]
                : '-'}
            </Col>
            <Col span={8}>
              <span>
                <FormattedMessage id="Store.AccountStatus" />：
              </span>{' '}
              {storeInfo.get('accountState') != null
                ? ACCOUNT_STATE[storeInfo.get('accountState')]
                : '-'}
            </Col>
            <Col span={8}>
              <span>
                <FormattedMessage id="Store.StoreStatus" />：
              </span>{' '}
              {storeInfo.get('storeState') != null
                ? moment(storeInfo.get('contractEndDate')).isBefore(moment())
                  ? 'Expired'
                  : STORE_STATE[storeInfo.get('storeState')]
                : '-'}
            </Col>
            {storeInfo.get('auditState') != null &&
            storeInfo.get('auditState') == 2 ? (
              <Col span={8}>
                <p className="reason">
                  <span>Reasons for review rejection：</span>{' '}
                  {storeInfo.get('auditReason')
                    ? storeInfo.get('auditReason')
                    : '-'}
                </p>
              </Col>
            ) : null}
            {storeInfo.get('accountState') != null &&
            storeInfo.get('accountState') == 1 ? (
              <Col span={8}>
                <p className="reason">
                  <span>Reasons for disabling the account：</span>{' '}
                  {storeInfo.get('accountDisableReason')
                    ? storeInfo.get('accountDisableReason')
                    : '-'}
                </p>
              </Col>
            ) : null}
            {storeInfo.get('storeState') != null &&
            storeInfo.get('storeState') == 1 ? (
              <Col span={8}>
                <p className="reason">
                  <span>Reasons for store closure：</span>{' '}
                  {storeInfo.get('storeClosedReason')
                    ? storeInfo.get('storeClosedReason')
                    : '-'}
                </p>
              </Col>
            ) : null}
          </Row>
        </GreyBg>
        <Form>
          <Row>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label={<FormattedMessage id="Store.storeLanguage" />}
              >
                <p style={{ color: '#333' }}>
                  {this.getVaulesByData(
                    languageData,
                    storeInfo.get('languageId')
                  )}
                </p>
              </FormItem>
              <span
                style={{ position: 'absolute', left: '86px', top: '30px' }}
                className="ant-form-item-required"
              >
                The first is the default language
              </span>
            </Col>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                required={false}
                label={<FormattedMessage id="Store.timeZone" />}
              >
                <p style={{ color: '#333' }}>
                  {this.getVauleByData(
                    timeZoneData,
                    storeInfo.get('timeZoneId')
                  )}
                </p>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                required={false}
                label={<FormattedMessage id="Store.TargetCountry" />}
              >
                <p style={{ color: '#333' }}>
                  {this.getCountryName(countryData, storeInfo.get('countryId'))}
                </p>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                required={false}
                label={<FormattedMessage id="Store.TargetCity" />}
              >
                <p style={{ color: '#333' }}>
                  {this.getVaulesByData(cityData, storeInfo.get('cityIds'))}
                </p>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                required={false}
                label={<FormattedMessage id="Store.Currency" />}
              >
                <p style={{ color: '#333' }}>
                  {this.getVauleByData(
                    currencyData,
                    storeInfo.get('currencyId')
                  )}
                </p>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                required={false}
                label={<FormattedMessage id="Store.TaxRate" />}
              >
                <p style={{ color: '#333' }}>{storeInfo.get('taxRate')}%</p>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                required={false}
                label={<FormattedMessage id="Store.DomainName" />}
              >
                <p style={{ color: '#333' }}>{storeInfo.get('domainName')}</p>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                required={false}
                label={<FormattedMessage id="Store.MinimumCharge" />}
              >
                <p style={{ color: '#333' }}>{storeInfo.get('miniCharge')}</p>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}
