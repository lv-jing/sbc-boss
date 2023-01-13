import React from 'react';
import { Relax } from 'plume2';

import styled from 'styled-components';
import { Form, Input, Button, Select, DatePicker, Row, Col } from 'antd';
import { noop, SelectGroup, Const, RCi18n } from 'qmkit';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';

const FormItem = Form.Item;
const { Option } = Select;

const OPTION_TYPE = {
  0: 'supplierName',
  1: 'storeName',
  2: 'accountName'
};

const DueTo = styled.div`
  display: inline-block;
  .ant-form-item-label label:after {
    content: none;
  }

  .ant-form-item-label label {
    display: table-cell;
    padding: 0 11px;
    font-size: 14px;
    font-weight: normal;
    line-height: 1;
    color: #000000a6;
    text-align: center;
    background-color: #fff;
    border: 1px solid #d9d9d9;
    border-bottom-left-radius: 4px;
    border-top-left-radius: 4px;
    position: relative;
    transition: all 0.3s;
    border-right: 0;
    height: 32px;
    vertical-align: middle;
  }
  .ant-form-item-control-wrapper .ant-input {
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
  }
`;

@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      form: any;

      setField: Function;
      changeOption: Function;
      initSuppliers: Function;
    };
  };

  static relaxProps = {
    // 搜索项
    form: 'form',

    setField: noop,
    changeOption: noop,
    initSuppliers: noop
  };

  render() {
    const { form, setField, initSuppliers } = this.props.relaxProps;
    const {
      supplierName,
      storeName,
      accountName,
      companyCode,
      contractEndDate,
      accountState,
      storeState
    } = form.toJS();

    const searchText = supplierName || storeName || accountName;

    return (
      <div>
        <Form className="filter-content" layout="inline">
          <Row>
            <Col span={8}>
              <FormItem>
                <Input
                  addonBefore={this._buildOptions()}
                  style={{width: 300}}
                  value={searchText}
                  onChange={(e: any) => this._setField(e.target.value)}
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem>
                <Input
                  addonBefore={<p style={{width:108}}><FormattedMessage id="Store.MerchantNumber" /></p>}
                  style={{width: 300}}
                  value={companyCode}
                  onChange={(e: any) =>
                    setField({ field: 'companyCode', value: e.target.value })
                  }
                />
              </FormItem>
            </Col>
          {/* <DueTo>
            <FormItem label={<FormattedMessage id="Store.ExpirationTime" />}>
              <DatePicker
                getCalendarContainer={() =>
                  document.getElementById('page-content')
                }
                format={Const.DAY_FORMAT}
                placeholder="-- Pre maturity merchant"
                value={
                  contractEndDate
                    ? moment(contractEndDate, Const.DAY_FORMAT)
                    : null
                }
                onChange={(_date, dateString) =>
                  setField({ field: 'contractEndDate', value: dateString })
                }
              />
            </FormItem>
          </DueTo> */}
            <Col span={8}>
              <FormItem>
                <SelectGroup
                  getPopupContainer={() => document.getElementById('page-content')}
                  label={<p style={{width:108}}><FormattedMessage id="Store.AccountStatus" /></p>}
                  style={{width: 170}}
                  value={accountState}
                  onChange={(e) =>
                    setField({ field: 'accountState', value: e.valueOf() })
                  }
                >
                  <Option key="-1" value="-1">
                    All
                  </Option>
                  <Option key="0" value="0">
                    Open
                  </Option>
                  <Option key="1" value="1">
                    Disable
                  </Option>
                </SelectGroup>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem>
                <SelectGroup
                  getPopupContainer={() => document.getElementById('page-content')}
                  label={<p style={{width:108}}><FormattedMessage id="Store.StoreStatus" /></p>}
                  style={{width: 170}}
                  value={storeState}
                  onChange={(e) =>
                    setField({ field: 'storeState', value: e.valueOf() })
                  }
                >
                  <Option key="-1" value="-1">
                    All
                  </Option>
                  <Option key="0" value="0">
                    Open
                  </Option>
                  <Option key="1" value="1">
                    Close
                  </Option>
                  <Option key="2" value="2">
                    Expired
                  </Option>
                </SelectGroup>
              </FormItem>
            </Col>
            <Col span={24} style={{textAlign:'center'}}>
              <FormItem>
                <Button
                  icon="search"
                  type="primary"
                  onClick={() => initSuppliers()}
                  htmlType="submit"
                >
                  <FormattedMessage id="Store.Search" />
                </Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }

  /**
   * 构建Option结构
   */
  _buildOptions = () => {
    const { form } = this.props.relaxProps;
    return (
      <Select
        value={form.get('optType')}
        style={{width:130}}
        getPopupContainer={() => document.getElementById('page-content')}
        onChange={(val) => this._changeOptions(val)}
      >
        <Option value="1" title={RCi18n({id:'Store.StoreName'})}>
          <FormattedMessage id="Store.StoreName" />
        </Option>
        <Option value="2" title={RCi18n({id:'Store.MerchantAccount'})}>
          <FormattedMessage id="Store.MerchantAccount" />
        </Option>
      </Select>
    );
  };

  /**
   * 更改Option
   */
  _changeOptions = (val) => {
    this.props.relaxProps.changeOption(val);
  };

  /**
   * 搜索项设置搜索信息
   */
  _setField = (val) => {
    const { setField, form } = this.props.relaxProps;
    setField({ field: OPTION_TYPE[form.get('optType')], value: val });
  };
}
