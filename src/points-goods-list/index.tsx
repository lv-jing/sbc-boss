import React from 'react';
import {  Form } from 'antd';
import { StoreProvider } from 'plume2';
import { Headline,BreadCrumb } from 'qmkit';
import AppStore from './store';
import TabDataGrid from './components/tab-data-grid';

const PointsGoodsList = Form.create()(TabDataGrid as any);

@StoreProvider(AppStore, { debug: __DEV__ })
export default class InfoIndex extends React.Component<any, any> {
  store: AppStore;

  componentWillMount() {
    if (this.props.location.state != undefined) {
      this.store.onTabChange(this.props.location.state.key);
    }
    this.store.init();
  }

  render() {
    return (
      <div>
        {/* 面包屑导航 */}
        <BreadCrumb/>
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>营销</Breadcrumb.Item>
          <Breadcrumb.Item>积分商城</Breadcrumb.Item>
          <Breadcrumb.Item>积分商品</Breadcrumb.Item>
        </Breadcrumb> */}

        <div className="container">

          {/* 头部标题 */}
          <Headline title="积分商品" />
          {/*tab积分商品*/}
          <PointsGoodsList />

        </div>
      </div>
    );
  }
}
