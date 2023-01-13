import React from 'react';
import { StoreProvider } from 'plume2';
import { FormattedMessage } from 'react-intl';
import { Headline,BreadCrumb } from 'qmkit';
import AppStore from './store';
import BrandList from './component/brand-list';
import BrandModal from './component/brand-modal';
import Search from './component/search';
import Tips from './component/tips';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class GoodsBrand extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.init();
  }

  render() {
    return (
      <div>
        <BreadCrumb/>
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>商品</Breadcrumb.Item>
          <Breadcrumb.Item>商品管理</Breadcrumb.Item>
          <Breadcrumb.Item>商品品牌</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className="container">
          <Headline title={<FormattedMessage id="Product.CommodityBrand" />}>
            <span className="brandsTotal">
              <FormattedMessage id="Product.There" />
              {this.store.state().get('total')}
              <FormattedMessage id="Product.brands" />
            </span>
          </Headline>

          {/*提示信息*/}
          <Tips />

          {/*搜索框*/}
          <Search />

          {/*工具条*/}

          {/*列表*/}
          <BrandList />

          {/*弹框*/}
          <BrandModal />
        </div>
      </div>
    );
  }
}
