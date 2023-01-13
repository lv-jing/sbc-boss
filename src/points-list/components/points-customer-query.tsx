import React, { Component } from 'react';
import { Relax } from 'plume2';
import { Button, Form, Input, Select, InputNumber } from 'antd';
import { SelectGroup, noop } from 'qmkit';
const FormItem = Form.Item;
const Option = Select.Option;
const InputGroup = Input.Group;
import styled from 'styled-components';
const TableRow = styled.div`
  .ant-input-number {
    margin-right: 0px;
  }
  .ant-select-arrow{
    display:none;
  }
  .ant-select-selection-selected-value{
    color: #575757;
    background-color: #FAFAFA;
  }
}


`;
@Relax
export default class PointCustomerQuery extends Component<any, any> {
  props: {
    relaxProps?: {
      onCustomerFormFieldChange: Function;
      _onSearch: Function;
    };
  };

  static relaxProps = {
    onCustomerFormFieldChange: noop,
    _onSearch: noop
  };

  render() {
    const { onCustomerFormFieldChange, _onSearch } = this.props.relaxProps;
    return (
      <div>
        <Form className="filter-content" layout="inline">
          <FormItem>
            <Input
              addonBefore="客户名称"
              onChange={(e: any) => {
                onCustomerFormFieldChange('customerName', e.target.value);
              }}
            />
          </FormItem>
          <FormItem>
            <Input
              addonBefore="客户账号"
              onChange={(e: any) => {
                onCustomerFormFieldChange('customerAccount', e.target.value);
              }}
            />
          </FormItem>

          <FormItem>
            <SelectGroup
              getPopupContainer={() => document.getElementById('page-content')}
              label="账号状态"
              style={{ width: 80 }}
              onChange={(value) => {
                value = value === '' ? null : value;
                onCustomerFormFieldChange('customerStatus', value);
              }}
            >
              <Option value="">全部</Option>
              <Option value="0">启用</Option>
              <Option value="1">禁用</Option>
            </SelectGroup>
          </FormItem>

          <FormItem>
            <TableRow style={{ paddingTop: '4px' }}>
              <InputGroup compact>
                <Select defaultValue="积分值" disabled />
                <InputNumber
                  style={{ width: 100, textAlign: 'center' }}
                  placeholder="最小积分值"
                  max={99999999}
                  min={0}
                  onChange={ (val) => {
                    onCustomerFormFieldChange('pointsAvailableBegin', val);
                  }}
                />
                <Input
                  style={{
                    width: 30,
                    borderLeft: 0,
                    pointerEvents: 'none',
                    backgroundColor: '#fff'
                  }}
                  placeholder="~"
                  disabled
                />
                <InputNumber
                  style={{ width: 100, textAlign: 'center', borderLeft: 0 }}
                  placeholder="最大积分值"
                  max={99999999}
                  min={0}
                  onChange={ (val) => {
                    onCustomerFormFieldChange('pointsAvailableEnd', val);
                  }}
                />
              </InputGroup>
            </TableRow>
          </FormItem>

          <FormItem>
            <Button
              type="primary"
              icon="search"
              onClick={() => {
                _onSearch();
              }}
              htmlType="submit"
            >
              搜索
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}
