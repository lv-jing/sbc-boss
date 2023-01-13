import * as React from 'react';
import { IOptions, StoreProvider } from 'plume2';
import { Breadcrumb, Tabs, Form, Alert, Spin } from 'antd';
import { Const, Headline, history, checkAuth, BreadCrumb, ErrorBoundary, RCi18n } from 'qmkit';
import './index.less';
import AppStore from './store';
import Goods from './component/goods';
import Related from './component/related';
import GoodsPropDetail from './component/goodsPropDetail';
import Spec from './component/spec';
import SkuTable from './component/sku-table';
import SeoForm from './component/seoForm';
const SeoFormModel = Form.create({})(SeoForm);

//import Price from './component/price';
import { Router } from 'react-router-dom';
import Detail from './component/detail';
import Foot from './component/foot';
import BrandModal from './component/brand-modal';
import CateModal from './component/cate-modal';
import PicModal from './component/pic-modal';
import ImgModal from './component/img-modal';
import Logistics from './component/logistics';
import VideoModal from './component/video-modal';
import { FormattedMessage } from 'react-intl';
import AlertInfo from './component/alret';
import ProductPrice from './component/productPrice';
import ProductInventory from './component/productInventory';
import ShippingInformation from './component/shippingInformation';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class Main extends React.Component<any, any> {
  store: AppStore;
  constructor(props: IOptions) {
    super(props);
    this.state = {
      tabType: 'main'
    };
  }

  componentDidMount() {
    const { gid } = this.props.match.params;
    this.store.init(gid, this.props.location.state.storeId);
    this.store.setFreightList();
    //初始化素材
    // this.store.initImg({
    //   pageNum: 0,
    //   cateId: -1,
    //   successCount: 0
    // });
    // this.store.initVideo({
    //   pageNum: 0,
    //   cateId: -1,
    //   successCount: 0
    // }); //传入-1时,则会去初始化第一个分类的信息
    if (this.props.location.state != undefined) {
      this.store.onMainTabChange(this.props.location.state.tab, false);
    }
  }

  onMainTabChange = (res) => {
    this.setState({
      tabType: res
    });
    this.store.onTabChanges(res);
  };

  onPrev = (res) => {
    let type = '';
    if (res == 'price') {
      type = 'main';
    } else if (res == 'inventory') {
      type = 'price';
    } else if (res == 'shipping') {
      type = 'inventory';
    } else if (res == 'related') {
      type = 'shipping';
    } else if (res == 'seo') {
      type = 'related';
    }
    this.setState({
      tabType: type
    });
    this.store.onMainTabChange(type);
  };

  onNext = (res) => {
    let type = res || 'main';
    if (res == 'main' /*&& this.store._validMainForms()*/) {
      type = 'price';
    } else if (res == 'price' /*&& this.store._validPriceFormsNew()*/) {
      type = 'inventory';
    } else if (res == 'inventory' /*&& this.store._validInventoryFormsNew()*/) {
      type = 'shipping';
    } else if (res == 'shipping') {
      type = 'related';
    } else if (res == 'related') {
      type = 'seo';
    }
    this.setState({
      tabType: type
    });
    this.store.onMainTabChange(type);
  };

  render() {
    const { gid } = this.props.match.params;
    //默认添加商品的编辑与设价权限
    let goodsFuncName = 'f_goods_add_1';
    let priceFuncName = 'f_goods_add_2';
    if (gid) {
      //编辑tabType
      if (this.props.location.pathname.indexOf('/goods-check-edit') > -1) {
        //待审核商品编辑,设价
        goodsFuncName = 'f_goods_sku_edit';
        priceFuncName = 'f_goods_sku_price';
      } else {
        //已审核商品编辑,设价
        goodsFuncName = 'f_goods_sku_edit_2';
        priceFuncName = 'f_goods_sku_edit_3';
      }
    }
    const currentTab = this.store.state().get('currentTab');

    const path = this.props.match.path || '';
    const parentPath = path.indexOf('/goods-check-edit/') > -1 ? '待审核商品' : '商品列表';

    return (
      <div>
        {/* BreadCrumb */}
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>{gid ? 'Regular product' : 'Regular product'}</Breadcrumb.Item>
        </BreadCrumb>
        {/* Headline */}
        <div className="container-search">
          {/* <Headline title={gid ? 'Edit product (Regular product)' : 'New product (Regular product)'} state={this._getState(gid)} /> */}
          <Headline title={gid ? 'Regular product' : 'Regular product'} />
        </div>
        {/* Tabs */}
        <div className="container">
          <Tabs
            activeKey={this.store.get('activeTabKey')}
            // onChange={(activeKey) => this.store.onMainTabChange(activeKey)}
            defaultActiveKey="main"
            ref={(e) => {
              this._Tabs = e;
            }}
            onChange={(activeKey) => this.onMainTabChange(activeKey)}
          >
            {/* Product information */}
            {/* {(checkAuth(goodsFuncName) || checkAuth(priceFuncName)) && ( */}
              <Tabs.TabPane tab={<FormattedMessage id="Product.Productinformation" />} key="main">
                <AlertInfo />
                {/* Basic information 》商品基本信息 */}
                <Goods />

                {/* Attribute information 》商品属性信息 */}
                <GoodsPropDetail />
                
                {/* Specification setting 》商品规格信息 */}
                <Spec />

                {/*商品表格*/}
                <SkuTable />

                {/*物流表单*/}
                {/* <Logistics /> */}

                {/*详情*/}
                {/*<ErrorBoundary>
                  <Detail />
                </ErrorBoundary>*/}
                <Detail />
              </Tabs.TabPane>
            {/* )} */}
            {/* Product price */}
            <Tabs.TabPane tab={<FormattedMessage id="Product.Productprice" />} key="price">
              <AlertInfo />

              <ProductPrice />
            </Tabs.TabPane>
            {/* Product inventory */}
            <Tabs.TabPane tab={<FormattedMessage id="Product.Productinventory" />} key="inventory">
              <AlertInfo />

              <ProductInventory />
            </Tabs.TabPane>
            {/* shipping information */}
            <Tabs.TabPane tab={<FormattedMessage id="Product.shippingInformation" />} key="shipping">
              <AlertInfo />

              <ShippingInformation />
            </Tabs.TabPane>
            {/* Related product */}
            <Tabs.TabPane
              tab={<FormattedMessage id="Product.Relatedproduct" />}
              key="related"
              //disabled={!this.store.state().getIn(['goods', 'goodsId'])}
            >
              <AlertInfo />

              <Related />
            </Tabs.TabPane>
            {/* SEO setting */}
            <Tabs.TabPane
              tab={<FormattedMessage id="Product.SEOsetting" />}
              key="seo"
              // disabled={!this.store.state().getIn(['goods', 'goodsId'])}
            >
              <AlertInfo
                message={
                  <div>
                    <p><FormattedMessage id="Product.SEOsettingalert" /></p>
                  </div>
                }
              />
              <SeoFormModel />
            </Tabs.TabPane>
          </Tabs>

          {/*页脚*/}
          <Foot goodsFuncName={goodsFuncName} isLeave={true} priceFuncName={priceFuncName} tabType={this.store.get('activeTabKey')} onNext={this.onNext} onPrev={this.onPrev} loading={this.store.get('loading')} />
          {/*{this.state.tabType != 'related' ? <Foot goodsFuncName={goodsFuncName} priceFuncName={priceFuncName} /> : null}*/}

          {/*品牌*/}
          <BrandModal />

          {/*分类*/}
          <CateModal />

          {/*图片库*/}
          <PicModal />

          <ImgModal />

          {/*视频库*/}
          <VideoModal />

          {this.store.get('loading') ? (
            <div className="spin">
              <Spin spinning={this.store.get('loading')} />
              {/* <img className="spinner" src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/202011020724162245.gif" style={{ width: '90px' }} alt="" /> */}
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  /**
   * 展示商品状态
   * @param gid
   * @returns {any}
   * @private
   */
  _getState(gid) {
    // 已保存的才有这种状态
    if (gid) {
      const auditStatus = this.store.state().getIn(['goods', 'auditStatus']);
      // 待审核的不能修改
      if (auditStatus == 0) {
        history.goBack();
      }
      return Const.goodsState[auditStatus] && RCi18n({id:`Product.${Const.goodsState[auditStatus]}`});
    }

    return null;
  }
}
