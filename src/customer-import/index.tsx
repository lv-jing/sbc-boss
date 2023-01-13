import React from 'react';
import { StoreProvider } from 'plume2';
import { Headline,BreadCrumb } from 'qmkit';
import AppStore from './store';
import Tips from './components/tips';
import ImportStep from './components/step';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class CustomerImport extends React.Component<any, any> {
  store: AppStore;

  render() {
    return (
      <div>
        {/*导航面包屑*/}
        <BreadCrumb/>
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>客户</Breadcrumb.Item>
          <Breadcrumb.Item>客户管理</Breadcrumb.Item>
          <Breadcrumb.Item>客户导入</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className="container">
          <Headline title="客户导入" />
          {/*操作说明*/}
          <Tips />
          {/*步骤条*/}
          <ImportStep />
        </div>
      </div>
    );
  }
}
