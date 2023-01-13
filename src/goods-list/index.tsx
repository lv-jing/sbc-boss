import React from 'react';
import { StoreProvider } from 'plume2';
import { Row, Col } from 'antd';
import { Headline, AuthWrapper, BreadCrumb } from 'qmkit';
import AppStore from './store';
import SearchForm from './components/search-form';
// import Tool from './components/tool';
import Tab from './components/tab';
import FreightModal from './components/freight-modal';
import { FormattedMessage } from 'react-intl';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class GoodsView extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.init();
    this.store.setFreightList();
  }

  render() {
    return (
      <AuthWrapper functionName="f_goods_1">
        <div>
          <BreadCrumb />
          {/* <Breadcrumb separator=">">
            <Breadcrumb.Item>商品</Breadcrumb.Item>
            <Breadcrumb.Item>商品管理</Breadcrumb.Item>
            <Breadcrumb.Item>商品列表</Breadcrumb.Item>
          </Breadcrumb> */}
          <div className="container-search">
            <Headline title={<FormattedMessage id="Product.productList" />} />

            {/*搜索*/}
            <SearchForm />
          </div>
          <div className="container">
            {/*工具条*/}
            {/* <Tool /> */}

            {/*tab页显示商品列表*/}
            <Tab />

            {/*批量设置运费模板Modal*/}
            <FreightModal />
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
