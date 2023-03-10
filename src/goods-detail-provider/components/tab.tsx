import React from 'react';
import { Tabs } from 'antd';
import BasicInfo from '../components/basic-info';
import Price from '../components/price';

const TabPane = Tabs.TabPane;

export default class Tab extends React.Component<any, any> {
  render() {
    return (
      <div>
        <Tabs defaultActiveKey="main">
          <TabPane tab="基础信息" key="main">
            <BasicInfo />
          </TabPane>
          {/*<TabPane tab="价格及订货量" key="price">
            <Price />
          </TabPane>*/}
        </Tabs>
      </div>
    );
  }
}
