import React from 'react';
import { StoreProvider } from 'plume2';
import { Alert } from 'antd';
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
      <AuthWrapper functionName={'f_groupon_cate_query'}>
        <div>
          <BreadCrumb />
          {/* <Breadcrumb separator=">">
            <Breadcrumb.Item>营销</Breadcrumb.Item>
            <Breadcrumb.Item>拼团活动</Breadcrumb.Item>
            <Breadcrumb.Item>拼团分类</Breadcrumb.Item>
          </Breadcrumb> */}
          <div className="container">
            <Headline title="拼团分类" />
            <div>
              <Alert
                message=""
                description={
                  <div>
                    <p>拼团分类为拼团活动列表页面展示分类，最多可维护30个；</p>
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
