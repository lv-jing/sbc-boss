import React from 'react';
import { Button } from 'antd';
import { StoreProvider } from 'plume2';

import { AuthWrapper, Headline,BreadCrumb } from 'qmkit';

import AppStore from './store';
import Tips from './components/tips';
import SettingForm from './components/form';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class OrderSetting extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.init();
  }

  render() {
    return (
      <div>
        <BreadCrumb/>
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>订单</Breadcrumb.Item>
          <Breadcrumb.Item>订单管理</Breadcrumb.Item>
          <Breadcrumb.Item>订单设置</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className="container">
          <Headline title="订单设置" />
          <Tips />
          <SettingForm />
          <AuthWrapper functionName={'f_order_setting_edit'}>
            <div className="bar-button">
              <Button
                type="primary"
                onClick={() => this.store.saveEditConfigs()}
              >
                保存
              </Button>
            </div>
          </AuthWrapper>
        </div>
      </div>
    );
  }
}
