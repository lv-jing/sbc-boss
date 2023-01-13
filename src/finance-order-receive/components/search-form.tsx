import React from 'react';
import { Relax } from 'plume2';
import { Button, Form, Input, Select } from 'antd';
import { Map } from 'immutable';

import { SelectGroup } from 'qmkit';

const FormItem = Form.Item;
const Option = Select.Option;

@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    form?: any;
    relaxProps?: {
      onFormChange: Function;
      onSearch: Function;
      searchForm: Map<string, any>;
    };
  };

  static relaxProps = {
    onFormChange: Function,
    onSearch: Function,
    searchForm: 'searchForm'
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { onFormChange, onSearch, searchForm } = this.props.relaxProps;

    return (
      <div>
        <Form className="filter-content" layout="inline">
          <FormItem>
            <Input
              addonBefore="客户名称"
              onChange={(e) => {
                const value = (e.target as any).value;
                onFormChange({
                  field: 'customerName',
                  value
                });
              }}
              value={searchForm.get('customerName')}
            />
          </FormItem>
          <FormItem>
            <Input
              addonBefore="商家名称"
              onChange={(e) => {
                const value = (e.target as any).value;
                onFormChange({
                  field: 'supplierName',
                  value
                });
              }}
              value={searchForm.get('supplierName')}
            />
          </FormItem>
          <FormItem>
            <Input
              addonBefore="订单号"
              onChange={(e) => {
                const value = (e.target as any).value;
                onFormChange({
                  field: 'orderCode',
                  value
                });
              }}
              value={searchForm.get('orderCode')}
            />
          </FormItem>
          <FormItem>
            <Input
              addonBefore="收款流水号"
              onChange={(e) => {
                const value = (e.target as any).value;
                onFormChange({
                  field: 'payBillNo',
                  value
                });
              }}
              value={searchForm.get('payBillNo')}
            />
          </FormItem>
          <FormItem>
            <SelectGroup
              getPopupContainer={() => document.getElementById('page-content')}
              label="付款状态"
              style={{ width: 80 }}
              onChange={(e) => {
                onFormChange({
                  field: 'payOrderStatus',
                  value: e
                });
              }}
              defaultValue={null}
            >
              <Option value={null}>全部</Option>
              <Option value={'0'}>已付款</Option>
              <Option value={'1'}>未付款</Option>
              <Option value={'2'}>待确认</Option>
            </SelectGroup>
          </FormItem>
          <FormItem>
            <Input
              addonBefore="收款账号"
              onChange={(e) => {
                const value = (e.target as any).value;
                onFormChange({
                  field: 'account',
                  value
                });
              }}
              value={searchForm.get('account')}
            />
          </FormItem>
          <FormItem>
            <Button type="primary" onClick={() => onSearch()}   htmlType="submit">
              搜索
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}
