import React from 'react';
import { StoreProvider } from 'plume2';
import { Breadcrumb, Tabs, Form } from 'antd';
import { Headline,BreadCrumb } from 'qmkit';

import AppStore from './store';
import StepOne from './components/step-one';
import StepTwo from './components/step-two';
import StepThree from './components/step-three';
import StepFour from './components/step-four';
import BrandModal from './components/brand-modal';
import SortsModal from './components/sort-modal';

const StepTwoForm = Form.create()(StepTwo as any);
const StepOneForm = Form.create()(StepOne as any);
const SortsForm = Form.create()(SortsModal as any);
const BrandForm = Form.create()(BrandModal as any);
const StepFourForm = Form.create()(StepFour as any);

const TabPane = Tabs.TabPane;

@StoreProvider(AppStore, { debug: __DEV__ })
export default class SupplierEdit extends React.Component<any, any> {
  store: AppStore;

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const { sid } = this.props.match.params;
    this.store.init(sid);
  }

  render() {
    const momentTab = this.store.state().get('momentTab');
    return (
      <div>
        <BreadCrumb>
        <Breadcrumb.Item>编辑商家</Breadcrumb.Item>
        </BreadCrumb>
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>商家</Breadcrumb.Item>
          <Breadcrumb.Item>商家管理</Breadcrumb.Item>
          <Breadcrumb.Item>商家列表</Breadcrumb.Item>
          <Breadcrumb.Item>编辑商家</Breadcrumb.Item>
        </Breadcrumb> */}

        <div className="container">
          <Headline title="商家编辑" />

          <Tabs
            key={this.store.state().get('randomKey')}
            defaultActiveKey={momentTab}
            onChange={(data) => this.change(data)}
          >
            <TabPane tab="基本信息" key="1">
              <StepOneForm />
            </TabPane>
            <TabPane tab="工商信息" key="2">
              <StepTwoForm />
            </TabPane>
            <TabPane tab="签约信息" key="3">
              <StepThree />
            </TabPane>
            <TabPane tab="财务信息" key="4">
              <StepFourForm />
            </TabPane>
          </Tabs>
        </div>

        {/* 签约品牌弹框 */}
        <BrandForm />

        {/* 签约类目弹框*/}
        <SortsForm />
      </div>
    );
  }

  /**
   * 切换tab页面
   */
  change = (value) => {
    this.store.setTab(value);
  };
}
