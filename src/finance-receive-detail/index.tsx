//财务-订单收款
import React from 'react';
import { StoreProvider } from 'plume2';

import { Headline,BreadCrumb } from 'qmkit';
import AppStore from './store';

import SearchForm from './components/search-form';
import ButtonGroup from './components/button-group';
import PayOrderList from './components/list';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class FinanceOrderReceive extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.init();
  }

  render() {
    return (
      <div>
        <BreadCrumb/>
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>财务</Breadcrumb.Item>
          <Breadcrumb.Item>资金管理</Breadcrumb.Item>
          <Breadcrumb.Item>收款明细</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className="container">
          <Headline title="收款明细" />
          <SearchForm />
          <ButtonGroup />
          <PayOrderList />
        </div>
      </div>
    );
  }
}
