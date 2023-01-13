import React from 'react';
import { Relax } from 'plume2';
import { Tabs } from 'antd';
import { noop } from 'qmkit';
import CustomerEditForm from './customer-edit-form';
import AddressInfoForm from './address-info-form';
import FinanceInfoForm from './finance-info-form';
import InvoiceSet from './invoice-set';

@Relax
export default class TabEditForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onTabChange: Function;
      setValue: Function;
    };
  };

  static relaxProps = {
    onTabChange: noop,
    setValue: noop
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { onTabChange } = this.props.relaxProps;

    return (
      <Tabs onChange={(key) => onTabChange(key)}>
        <Tabs.TabPane tab="客户信息" key="-1">
          <CustomerEditForm ref="_customerEditForm" />
        </Tabs.TabPane>

        <Tabs.TabPane tab="收货地址" key="0">
          <AddressInfoForm />
        </Tabs.TabPane>

        <Tabs.TabPane tab="财务信息" key="1">
          <FinanceInfoForm />
        </Tabs.TabPane>

        <Tabs.TabPane tab="增票资质" key="2">
          <InvoiceSet />
        </Tabs.TabPane>
      </Tabs>
    );
  }
}
