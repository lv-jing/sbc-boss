import React from 'react';
import { StoreProvider } from 'plume2';

import { AuthWrapper, Headline, BreadCrumb } from 'qmkit';

import AppStore from './store';
import SearchHead from './components/search-head';
import SearchList from './components/search-list';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class CouponActivityList extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.init();
    this.store.checkIEP();
  }

  render() {
    return (
      <AuthWrapper functionName={'f_coupon_activity_list'}>
        <div>
          <BreadCrumb />
          {/* <Breadcrumb separator=">">
            <Breadcrumb.Item>营销</Breadcrumb.Item>
            <Breadcrumb.Item>平台营销管理</Breadcrumb.Item>
            <Breadcrumb.Item>优惠券活动</Breadcrumb.Item>
          </Breadcrumb> */}
          <div className="container activity">
            <Headline title="优惠券活动" />
            <SearchHead />

            <SearchList />
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
