import React, { Component } from 'react';
import { StoreProvider } from 'plume2';
import { BreadCrumb } from 'qmkit';
import AppStore from './store';
import SearchHead from './components/search-head';
import SearchList from './components/search-tab-list';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class OrderList extends Component<any, any> {
  store: AppStore;

  componentDidMount() {
    const state = this.props.location.state;
    const { customerId, customerAccount } = this.props.match.params;
    if (customerId && customerAccount) {
      this.store.saveSearchParams({
        field: 'distributorId',
        value: customerId
      });
      this.store.setData({
        field: 'customerAccount',
        value: customerAccount
      });
      this.store.onSearch();
    }

    if (state) {
      if (state.key) {
        this.store.onTabChange(this.props.location.state.key);
      }
      if (state.payStatus) {
        this.store.onSearch();
      }
    } else {
      this.store.init();
    }
  }

  render() {
    return (
      <div>
        <BreadCrumb />
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>营销</Breadcrumb.Item>
          <Breadcrumb.Item>社交分销管理</Breadcrumb.Item>
          <Breadcrumb.Item>分销记录</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className="container">
          <SearchHead />
          <SearchList />
        </div>
      </div>
    );
  }
}
