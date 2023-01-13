import React from 'react';
import { StoreProvider } from 'plume2';
import { BreadCrumb } from 'qmkit';
import AppStore from './store';
import GeneralCommission from './components/search-form';
import DistributionCommisionList from './components/list';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class DistributionCommission extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.initDistributorLevelBaseInfo();
    this.store.init();
    this.store.getStatistics();
  }

  render() {
    return (
      <div>
        {/*导航面包屑*/}
        <BreadCrumb/>
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>财务</Breadcrumb.Item>
          <Breadcrumb.Item>资金管理</Breadcrumb.Item>
          <Breadcrumb.Item>分销员佣金</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className="container customer">
          <h2>分销员佣金</h2>

          {/*佣金概况和搜索条件*/}
          <GeneralCommission />

          {/*分销员佣金列表*/}
          <DistributionCommisionList />
        </div>
      </div>
    );
  }
}
