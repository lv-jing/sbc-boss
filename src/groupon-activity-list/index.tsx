import React from 'react';
import { StoreProvider } from 'plume2';

import { Headline, AuthWrapper,BreadCrumb } from 'qmkit';
import AppStore from './store';
import Search from './component/search';
import Tab from './component/tab';
import ForbidModal from './component/forbid-modal';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class GrouponActivity extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.getGrouponCateList();
    this.store.init();
  }

  render() {
    return (
      <div>
        <BreadCrumb/>
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>营销</Breadcrumb.Item>
          <Breadcrumb.Item>营销中心</Breadcrumb.Item>
          <Breadcrumb.Item>拼团活动</Breadcrumb.Item>
        </Breadcrumb> */}
        <AuthWrapper functionName="f_groupon-activity-list">
          <div className="container">
            <Headline title="拼团活动" />
            {/*搜索框*/}
            <Search />
            {/*Tab切换拼团活动列表*/}
            <Tab />
            {/*禁售理由弹出框*/}
            <ForbidModal />
          </div>
        </AuthWrapper>
      </div>
    );
  }
}
