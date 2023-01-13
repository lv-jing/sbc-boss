import React from 'react';
import { StoreProvider } from 'plume2';
import { Headline, BreadCrumb, AuthWrapper } from 'qmkit';
import AppStore from './store';
import ListView from './component/list';
import Toolbar from './component/toolbar';
import LevelModal from './component/level-modal';
import Tips from './component/tips';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class CustomerLevel extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.init();
  }

  render() {
    return (
      <AuthWrapper functionName="f_customer_0">
        <div>
          <BreadCrumb />
          {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>客户</Breadcrumb.Item>
          <Breadcrumb.Item>客户管理</Breadcrumb.Item>
          <Breadcrumb.Item>客户等级</Breadcrumb.Item>
        </Breadcrumb> */}
          <div className="container">
            <Headline title="客户等级" />

            <Tips />

            <Toolbar />

            <ListView />

            <LevelModal />
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
