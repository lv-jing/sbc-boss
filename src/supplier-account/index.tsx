import React from 'react';
import { Headline, BreadCrumb } from 'qmkit';

import { StoreProvider } from 'plume2';
import AppStore from './store';
import FormBar from './components/form';
import AccountList from './components/list';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class SupplierAccount extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.init();
  }

  render() {
    return (
      <div>
        <BreadCrumb />
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>财务</Breadcrumb.Item>
          <Breadcrumb.Item>收款账户</Breadcrumb.Item>
          <Breadcrumb.Item>商家收款账户</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className="container">
          <div style={{ display: 'flex' }}>
            <Headline title="商家收款账户" />
            <div>(共{this.store.state().get('total')}条)</div>
          </div>
          <FormBar />
          <AccountList />
        </div>
      </div>
    );
  }
}
