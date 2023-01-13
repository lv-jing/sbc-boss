import React from 'react';
import { StoreProvider } from 'plume2';

import { Headline, AuthWrapper,BreadCrumb } from 'qmkit';
import AppStore from './store';
import SearchForm from './components/search-form';
import Tool from './components/tool';
import GoodsLibraryList from './components/goods-library-list';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class GoodsView extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.init();
  }

  render() {
    return (
      <AuthWrapper functionName="f_goods_library_watch">
        <div>
          <BreadCrumb/>
          {/* <Breadcrumb separator=">">
            <Breadcrumb.Item>商品</Breadcrumb.Item>
            <Breadcrumb.Item>商品管理</Breadcrumb.Item>
            <Breadcrumb.Item>商品库</Breadcrumb.Item>
          </Breadcrumb> */}
          <div className="container">
            <Headline title="商品库" />

            {/*搜索*/}
            <SearchForm />

            {/*工具条*/}
            <Tool />

            <GoodsLibraryList />
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
