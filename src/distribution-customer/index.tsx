import React from 'react';
import { StoreProvider } from 'plume2';
import { Headline,BreadCrumb } from 'qmkit';
import AppStore from './store';
import SearchForm from './components/search-form';
import ButtonGroup from './components/button-group';
import CustomerList from './components/list';
import CustomerModal from './components/customer-modal';
import ForbidModal from './components/forbid-modal';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class DistributionCustomer extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.initDistributorLevelBaseInfo();
    this.store.init();
  }

  render() {
    return (
      <div>
        {/*导航面包屑*/}
        <BreadCrumb/>
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>营销</Breadcrumb.Item>
          <Breadcrumb.Item>社交分销管理</Breadcrumb.Item>
          <Breadcrumb.Item>分销员</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className="container">
          <Headline title="分销员" />

          {/*搜索条件*/}
          <SearchForm />

          {/*操作按钮组*/}
          <ButtonGroup />

          {/*tab的分销员列表*/}
          <CustomerList />

          {/*新增弹窗*/}
          <CustomerModal />

          {/*禁用弹窗*/}
          <ForbidModal />
        </div>
      </div>
    );
  }
}
