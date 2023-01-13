import React from 'react';
import { StoreProvider } from 'plume2';
import { BreadCrumb } from 'qmkit';
import AppStore from './store';
import GradeList from './component/grade-list';
import GradeModal from './component/grade-modal';
import Tool from './component/tool';
import Tip from './component/tip'
import Headline from "../../web_modules/qmkit/head-line";

@StoreProvider(AppStore, { debug: __DEV__ })
export default class CustomerGrade extends React.Component<any, any> {
  store: AppStore;

  componentDidMount(){
    this.store.init();
    this.store.queryEquities();
  }
  render() {

    return (
      <div>
        <BreadCrumb/>
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>客户</Breadcrumb.Item>
          <Breadcrumb.Item>忠诚度管理</Breadcrumb.Item>
          <Breadcrumb.Item>客户等级</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className="container">
          <Headline title="平台客户等级" />
          {/* 提示语 */}
          <Tip />
          {/*工具条*/}
          <Tool />
          {/*列表*/}
          <GradeList />
          {/*弹框*/}
          <GradeModal />
        </div>
      </div>
    );
  }
}
