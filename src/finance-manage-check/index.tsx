//资金管理-财务对账
import React from 'react';
import { StoreProvider } from 'plume2';
import { Tabs, Button } from 'antd';

import { Headline, AuthWrapper, BreadCrumb } from 'qmkit';
import AppStore from './store';
import SearchForm from './components/search-form';
import RefundList from './components/refund-list';
import RevenueList from './components/revenue-list';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class FinancialAccounts extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    if (this.props.location.state) {
      //明细种类
      const { kind } = this.props.location.state;
      if (kind) {
        this.store.setTab(kind);
      }
    }
    this.store.init();
  }

  render() {
    return (
      <div>
        <BreadCrumb />
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>财务</Breadcrumb.Item>
          <Breadcrumb.Item>资金管理</Breadcrumb.Item>
          <Breadcrumb.Item>财务对账</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className="container">
          <Headline title="财务对账" />
          <SearchForm />
          <AuthWrapper functionName="f_check_export_1">
            <div style={{ paddingBottom: '16px' }}>
              <Button onClick={() => this.store.bulk_export()}>批量导出</Button>
            </div>
          </AuthWrapper>

          <Tabs
            onChange={(key) => this.store.onTabChange(key)}
            activeKey={this.store.state().get('tabKey')}
          >
            <Tabs.TabPane tab="收入对账" key="1">
              {/*收入对账*/}
              <RevenueList />
            </Tabs.TabPane>

            <Tabs.TabPane tab="退款对账" key="2">
              {/*退款对账*/}
              <RefundList />
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}
