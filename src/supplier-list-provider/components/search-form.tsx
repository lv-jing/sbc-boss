import React from 'react';
import { Relax } from 'plume2';

import styled from 'styled-components';
import { Form, Input, Button, Select, DatePicker } from 'antd';
import { noop, SelectGroup, Const } from 'qmkit';
import moment from 'moment';

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
    background-color: #fafafa;
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
          <FormItem>
            <Input
              addonBefore={this._buildOptions()}
              value={searchText}
              onChange={(e: any) => this._setField(e.target.value)}
            />
          </FormItem>
          <FormItem>
            <Input
              addonBefore="商家编号"
              value={companyCode}
              onChange={(e: any) =>
                setField({ field: 'companyCode', value: e.target.value })
              }
            />
          </FormItem>
          <DueTo>
            <FormItem label="到期时间">
              <DatePicker
                getCalendarContainer={() =>
                  document.getElementById('page-content')
                }
                format={Const.DAY_FORMAT}
                placeholder="-- 前到期商家"
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
          </DueTo>
          <FormItem>
            <SelectGroup
              getPopupContainer={() => document.getElementById('page-content')}
              label="账号状态"
              value={accountState}
              onChange={(e) =>
                setField({ field: 'accountState', value: e.valueOf() })
              }
            >
              <Option key="-1" value="-1">
                全部
              </Option>
              <Option key="0" value="0">
                启用
              </Option>
              <Option key="1" value="1">
                禁用
              </Option>
            </SelectGroup>
          </FormItem>
          <FormItem>
            <SelectGroup
              getPopupContainer={() => document.getElementById('page-content')}
              label="店铺状态"
              value={storeState}
              onChange={(e) =>
                setField({ field: 'storeState', value: e.valueOf() })
              }
            >
              <Option key="-1" value="-1">
                全部
              </Option>
              <Option key="0" value="0">
                开启
              </Option>
              <Option key="1" value="1">
                关闭
              </Option>
              <Option key="2" value="2">
                过期
              </Option>
            </SelectGroup>
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              onClick={() => initSuppliers()}
              htmlType="submit"
            >
              搜索
            </Button>
          </FormItem>
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
        getPopupContainer={() => document.getElementById('page-content')}
        onChange={(val) => this._changeOptions(val)}
      >
        <Option value="0">商家名称</Option>
        <Option value="1">店铺名称</Option>
        <Option value="2">商家账号</Option>
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
