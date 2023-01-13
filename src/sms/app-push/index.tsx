import React from 'react';
import { StoreProvider } from 'plume2';
import { Const, Headline, DialogChooseUnit } from 'qmkit';

import AppStore from './store';
import { Tabs } from 'antd';

import './index.less';
import Setting from './components/setting';
import SettingModal from './components/setting-modal';
import SendSettingModal from './components/send-setting-modal';
import SendNodeModal from './components/send-node-modal';
import PushList from './components/push-list';
import NoticeList from './components/notice-list';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class AppPush extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    // const { type, id } = this.props.match.params;
    this.store.init('push');
  }

  render() {
    return (
      <div className="container">
        <Headline title="APP Push" />

        <Setting />

        <Tabs
          onChange={(key) => {
            this.store.initList(key);
          }}
          defaultActiveKey="push"
        >
          <Tabs.TabPane tab="推送任务列表" key="push">
            <PushList />
          </Tabs.TabPane>
          <Tabs.TabPane tab="通知类推送" key="notice">
            <NoticeList />
          </Tabs.TabPane>
        </Tabs>

        {/*APP push 设置*/}
        <SettingModal />

        {/*创建推送任务*/}
        <SendSettingModal />
        {/*编辑通知类推送*/}
        <SendNodeModal />

        <DialogChooseUnit
          platform="weixin"
          systemCode="d2cStore"
          apiHost={Const.HOST}
        />
      </div>
    );
  }
}
