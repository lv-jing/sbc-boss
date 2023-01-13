import React from 'react';
import { Alert } from 'antd';
import { StoreProvider } from 'plume2';

import { AuthWrapper, Headline, BreadCrumb } from 'qmkit';
import AppStore from './store';
import CouponCateList from './component/cate-list';
import CateModal from './component/cate-modal';
import CouponCateTool from './component/coupon-cate-tool';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class CouponCate extends React.Component<any, any> {
  store: AppStore;

  componentWillMount() {
    this.store.init();
  }

  render() {
    return (
      <AuthWrapper functionName={'f_coupon_cate_query'}>
        <div>
          <BreadCrumb />
          {/* <Breadcrumb separator=">">
            <Breadcrumb.Item>平台营销管理</Breadcrumb.Item>
            <Breadcrumb.Item>平台营销管理</Breadcrumb.Item>
            <Breadcrumb.Item>优惠券分类</Breadcrumb.Item>
          </Breadcrumb> */}
          <div className="container">
            <Headline title="优惠券分类" />
            <div style={{ marginBottom: 16 }}>
              <Alert
                message=""
                description={
                  <div>
                    <p>
                      优惠券分类为优惠券在领券中心的展示分类，最多可维护30个；
                    </p>
                    <p>
                      平台券专用分类仅支持平台操作，如：您可创建“精选”分类，并将部分优惠券归类至精选，实现对优质优惠券的推荐效果；
                    </p>
                    <p>您可拖拽排序改变分类的展示顺序；</p>
                  </div>
                }
                type="info"
              />
            </div>

            {/*工具条*/}
            <CouponCateTool />

            {/*列表*/}
            <CouponCateList />

            {/*弹框*/}
            <CateModal />
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
