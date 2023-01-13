//对账明细
import React from 'react';
import { Breadcrumb, Tabs } from 'antd';

import { Headline,BreadCrumb } from 'qmkit';

import RevenueList from './components/revenue-list';
import RefundList from './components/refund-list';

export default class ReconciliationDetails extends React.Component<any, any> {
  render() {
    return (
      <div>
        <BreadCrumb>
        <Breadcrumb.Item>对账明细</Breadcrumb.Item>
        </BreadCrumb>
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>财务</Breadcrumb.Item>
          <Breadcrumb.Item>资金管理</Breadcrumb.Item>
          <Breadcrumb.Item>财务对账</Breadcrumb.Item>
          <Breadcrumb.Item>对账明细</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className="container">
          <Headline title="对账明细" />
          <Tabs>
            <Tabs.TabPane tab="收入对账明细" key="1">
              <RevenueList />
            </Tabs.TabPane>
            <Tabs.TabPane tab="退款对账明细" key="2">
              <RefundList />
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}
