import React from 'react';
import { StoreProvider } from 'plume2';
import { Tabs, message } from 'antd';

import { Headline, BreadCrumb, checkAuth, AuthWrapper } from 'qmkit';
import Tips from './components/tips';
import CheckList from './components/list';
import UserSettig from './components/user';
import GoodsListSetting from './components/good';
import MiniShareSetting from './components/mini';
import AppStore from './store';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class CheckManage extends React.Component<any, any> {
  store;

  componentWillMount() {
    if (checkAuth('f_checkManage_view')) {
      this.store.init();
    } else {
      message.error('此功能您没有权限访问');
    }
  }

  render() {
    return (
      <div>
        <BreadCrumb />
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>设置</Breadcrumb.Item>
          <Breadcrumb.Item>系统管理</Breadcrumb.Item>
          <Breadcrumb.Item>高级设置</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className="container">
          <Headline title="高级设置" />
          <Tips />
          <AuthWrapper functionName="f_checkManage_view">
            <Tabs tabBarStyle={{ marginTop: 10 }}>
              <Tabs.TabPane tab="用户设置" key="1">
                <UserSettig />
              </Tabs.TabPane>
              <Tabs.TabPane tab="商品设置" key="2">
                <GoodsListSetting />
              </Tabs.TabPane>
              <Tabs.TabPane tab="审核设置" key="3">
                <CheckList />
              </Tabs.TabPane>
              <Tabs.TabPane tab="小程序分享设置" key="4">
                <MiniShareSetting />
              </Tabs.TabPane>
            </Tabs>
          </AuthWrapper>
        </div>
      </div>
    );
  }
}
