import React from 'react';
import { StoreProvider } from 'plume2';
import { BreadCrumb, Headline } from 'qmkit';
import AppStore from './store';
import './style.less';
import './index.less';
import Head from './components/head';
import Recommend from './components/recommend';
import { Tabs, Button, message } from 'antd';
import GroupModal from './components/group-modal';
import CRMGroupList from './components/crm-group-list';
import SendSettingModal from './components/send-sms-modal';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class AboutUs extends React.Component<any, any> {
  store: AppStore;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.store.init();
  }

  render() {
    const { onTabChange, openModal } = this.store;
    return (
      <div className="crm-customer-group">
        <BreadCrumb />
        <div className="container">
          <Headline title="会员分群" />
          <Head />
          <Tabs onChange={(key) => onTabChange({ key })}>
            <Tabs.TabPane tab="系统推荐人群" key="1">
              <Recommend />
            </Tabs.TabPane>
            <Tabs.TabPane tab="自定义人群" key="2">
              <Button
                type="primary"
                className="add-btn"
                onClick={() => {
                  const total = this.store.state().get('total');
                  if (total >= 100) {
                    message.error('最多可创建100个自定义人群');
                  } else {
                    openModal(1);
                  }
                }}
              >
                添加自定义人群
              </Button>
              <CRMGroupList />
            </Tabs.TabPane>
          </Tabs>
          <GroupModal />
          <SendSettingModal />
        </div>
      </div>
    );
  }
}
