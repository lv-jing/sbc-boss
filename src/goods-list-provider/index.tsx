import React from 'react';
import { StoreProvider } from 'plume2';

import { Headline, BreadCrumb, AuthWrapper, RCi18n } from 'qmkit';
import AppStore from './store';
import SearchForm from './components/search-form';
import GoodsList from './components/goods-list';
import ForbidModal from './components/forbid-modal';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class GoodsView extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.init();
  }

  render() {
    return (
      <div>
        <BreadCrumb />
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>商品</Breadcrumb.Item>
          <Breadcrumb.Item>商品管理</Breadcrumb.Item>
          <Breadcrumb.Item>商品列表</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className="container">
          <Headline title={RCi18n({ id: 'Product.Productlist' })} />

          {/*搜索*/}
          <SearchForm />

          {/*列表*/}
          <AuthWrapper functionName={'f_goods_1_provider'}>
            <GoodsList />
          </AuthWrapper>

          {/*禁售理由弹出框*/}
          <ForbidModal />
        </div>
      </div>
    );
  }
}
