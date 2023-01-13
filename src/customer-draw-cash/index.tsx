import React from 'react';
import { StoreProvider } from 'plume2';

import { Headline, BreadCrumb } from 'qmkit';
import AppStore from './store';
import SearchHead from './components/search-head';
import TabDataGrid from './components/tab-data-grid';
import RejectModal from './components/reject-modal';
import ButtonGroup from './components/button-group';
import './index.less';
@StoreProvider(AppStore, { debug: __DEV__ })
export default class CustomerDrawCash extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    const state = this.props.location.state;
    this.store.gather();
    if (state && state.key) {
      this.store.onTabChange(state.key);
    } else {
      this.store.init();
    }
  }

  render() {
    return (
      <div className="customer-draw-cash">
        <BreadCrumb />
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>财务</Breadcrumb.Item>
          <Breadcrumb.Item>资金管理</Breadcrumb.Item>
          <Breadcrumb.Item>会员提现管理</Breadcrumb.Item>
        </Breadcrumb> */}

        <div className="container">
          {/*标题*/}
          <Headline title="会员提现管理" />

          {/*搜索框*/}
          <SearchHead />

          {/*操作按钮组*/}
          <ButtonGroup />

          {/*各个会员提现管理列表*/}
          <TabDataGrid />

          {/*驳回弹窗*/}
          <RejectModal />
        </div>
      </div>
    );
  }
}
