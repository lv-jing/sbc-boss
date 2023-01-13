import React from 'react';
import {Relax, StoreProvider} from 'plume2';
import { Form, Tabs} from 'antd';
import { Headline, AuthWrapper,BreadCrumb } from 'qmkit';
import AppStore from './store';
import Tips from './component/tips';
import BasicRule from "./component/basic-rule";
import ShopRule from "./component/shop-rule";
import ShopRuleModal from "./component/shop-rule-modal";
import Setting from "./component/setting";
import PicModal from "./component/pic-modal";

const BasicRuleForm = Relax(Form.create()(BasicRule));
const SettingForm = Form.create()(Setting as any);

@StoreProvider(AppStore, { debug: __DEV__ })
export default class PointsSetting extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.initImg({ pageNum: 0, cateId: -1, successCount: 0 });
    this.store.init();
    this.store.initCate();
  }

  render() {
    return (
      <AuthWrapper functionName={'f_points_setting_view'}>
        <div>
          <BreadCrumb/>
          {/* <Breadcrumb separator=">">
            <Breadcrumb.Item>客户</Breadcrumb.Item>
            <Breadcrumb.Item>权益管理</Breadcrumb.Item>
            <Breadcrumb.Item>积分设置</Breadcrumb.Item>
          </Breadcrumb> */}
          <div className="container">
            <Headline title="积分设置" />

            <Tips />

            <Tabs>
              <Tabs.TabPane tab="积分设置" key="0">
                <SettingForm/>
                <PicModal/>
              </Tabs.TabPane>

              <Tabs.TabPane tab="基础获取规则" key="1">
                <BasicRuleForm/>
              </Tabs.TabPane>

              <Tabs.TabPane tab="购物获取规则" key="2">
                <ShopRule />
                <ShopRuleModal />
              </Tabs.TabPane>
            </Tabs>
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
