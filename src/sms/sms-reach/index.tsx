import React from 'react';
import { StoreProvider } from 'plume2';

import { Headline, BreadCrumb } from 'qmkit';

import AppStore from './store';
import { Tabs } from 'antd';
import './index.less';

import SMSSignature from './components/sms-signature';
import SMSTemplate from './components/sms-template';
import TaskList from './components/task-list';
import SettingEntry from './components/setting-entry';
import InterfaceSetting from './components/interface-setting';
import SendSettingModal from './components/send-setting-modal';
import SyncModal from './components/sync-modal';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class SMSReach extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    let location = this.props.location;
    this.store.init(
      location.state && location.state.tab ? location.state.tab : 'task'
    );
  }

  render() {
    let location = this.props.location;
    return (
      <div>
        <BreadCrumb />
        <div className="container sms-reach">
          <Headline title="短信触达" />
          <SettingEntry />
          <SendSettingModal />
          <SyncModal />
          <InterfaceSetting />
          <Tabs
            type="card"
            onChange={(key) => {
              this.store.initList(key);
            }}
            defaultActiveKey={
              location.state && location.state.tab ? location.state.tab : 'task'
            }
          >
            <Tabs.TabPane tab="发送任务列表" key="task">
              <TaskList />
            </Tabs.TabPane>
            <Tabs.TabPane tab="短信模板" key="template">
              <SMSTemplate
                type={
                  location.state && location.state.type
                    ? location.state.type
                    : ''
                }
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab="短信签名" key="sign">
              <SMSSignature />
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}
