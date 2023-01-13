import React from 'react';
import { StoreProvider } from 'plume2';

import { AuthWrapper, Headline, BreadCrumb } from 'qmkit';

import AppStore from './store';
import SearchHead from './components/search-head';
import SearchList from './components/search-list';
import ButtonGroup from './components/button-group';
import TagModal from './components/tag-moadl'
@StoreProvider(AppStore, { debug: __DEV__ })
export default class CouponActivityList extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.init();
  }

  render() {
    return (
      <AuthWrapper functionName={'f_tag_list'}>
        <BreadCrumb />
        <div>
          {/* <BreadCrumb/> */}
          <div className="container coupon">
            <Headline title="标签列表" />
            <SearchHead />
            {/*操作按钮组*/}
            <ButtonGroup />
            <SearchList />
            <TagModal />
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
