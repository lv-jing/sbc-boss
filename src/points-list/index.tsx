import React from 'react';
import { StoreProvider } from 'plume2';
import { Headline,BreadCrumb } from 'qmkit';
import PointsTitle from './components/points-title';
import Tabs from './components/tabs';

import AppStore from './store';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class pointsList extends React.Component<any, any> {
    store: AppStore;

  componentDidMount() {
    this.store.init();
    this.store.initCustomer();
    this.store.pointsNumDeatil();
    
  }
 
  render() {
    return (
        <div>
          <BreadcrumbF/>
          <div className="container">
            <Headline title="客户积分" />
            <PointsTitle />
            <Tabs />
          </div>
        </div>
    );
  }
}



export const BreadcrumbF = () => {
  return (
    <BreadCrumb/>
    // <Breadcrumb separator=">">
    //   <Breadcrumb.Item>客户</Breadcrumb.Item>
    //   <Breadcrumb.Item>客户管理</Breadcrumb.Item>
    //   <Breadcrumb.Item>客户积分</Breadcrumb.Item>
    // </Breadcrumb>
  );
};
