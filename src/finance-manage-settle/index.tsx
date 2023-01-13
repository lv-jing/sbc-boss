//资金管理-财务结算
import React from 'react';

import { StoreProvider } from 'plume2';

import { Headline,BreadCrumb } from 'qmkit';

import AppStore from './store';
import SearchForm from './components/search-form';
import ButtonGroup from './components/button-group';
import TabList from './components/tab-list';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class FinancialSettlement extends React.Component<any, any> {
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
          <Breadcrumb.Item>财务结算</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className="container">
          <Headline title="财务结算" />

          <SearchForm />

          <ButtonGroup />

          {/*财务结算表格*/}
          <TabList />
        </div>
      </div>
    );
  }
}
