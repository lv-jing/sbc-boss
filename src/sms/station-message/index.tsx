import React from 'react';
import { StoreProvider } from 'plume2';

import { Const, Headline, DialogChooseUnit } from 'qmkit';

import AppStore from './store';

import './index.less';
import { Tabs } from 'antd';
import NoticeList from './components/notice-list';
import TaskList from './components/task-list';
import SendSettingModal from './components/send-setting-modal';
import SendNodeModal from './components/send-node-modal';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class StationMessage extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    // const { type, id } = this.props.match.params;
    this.store.init('task');
  }

  render() {
    return (
      <div className="container">
        <Headline title="站内信" />

        <Tabs
          onChange={(key) => {
            this.store.initList(key);
          }}
        >
          <Tabs.TabPane tab="发送任务列表" key="task">
            <TaskList />
          </Tabs.TabPane>
          <Tabs.TabPane tab="通知类站内信" key="notice">
            <NoticeList />
          </Tabs.TabPane>
        </Tabs>

        {/*创建站内信*/}
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
