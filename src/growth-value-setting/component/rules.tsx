import React from 'react';

import {Form, Tabs} from 'antd';

import ShopRuleModal from "./shop-rule-modal";
import BasicRule from "./basic-rule";
import ShopRule from "./shop-rule";
import PicModal from "./pic-modal";
import {Relax} from 'plume2';
import SettingUEditor from "./setting-ueditor";

const BasicRuleForm = Relax(Form.create()(BasicRule));

export default class Rules extends React.Component<any, any> {
  render() {
    return (
      <Tabs>
        <Tabs.TabPane tab="基础获取规则" key="0">
          <BasicRuleForm/>
          <SettingUEditor/>
          <PicModal />
        </Tabs.TabPane>

        <Tabs.TabPane tab="购物获取规则" key="1">
          <ShopRule />
          <ShopRuleModal />
        </Tabs.TabPane>
      </Tabs>
    );
  }

}
