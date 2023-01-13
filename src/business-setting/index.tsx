import React from 'react';
import { Tabs } from 'antd';
import { Headline, BreadCrumb } from 'qmkit';
import { StoreProvider } from 'plume2';
import AppStore from './store';
import SettingForm from './components/setting-form';
import SettingUEditor from './components/setting-ueditor';
import SettingSupForm from './components/setting-sup-form';
import SettingSupUEditor from './components/setting-sup-ueditor';
import PicModal from './components/pic-modal';
@StoreProvider(AppStore, { debug: __DEV__ })
export default class BasicSetting extends React.Component<any, any> {
  store: AppStore;
  _a: any;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.store.init();
    this.store.initImg({ pageNum: 0, cateId: -1, successCount: 0 });
  }

  render() {
    return (
      <div>
        <BreadCrumb />
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>设置</Breadcrumb.Item>
          <Breadcrumb.Item>站点设置</Breadcrumb.Item>
          <Breadcrumb.Item>招商页设置</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className="container">
          <Headline title="招商页设置" />
          <Tabs onChange={(key)=>this.store.changeTab(key)}>         
            <Tabs.TabPane tab="商家" key="1">
              <SettingSupForm />
              <SettingSupUEditor />
            </Tabs.TabPane>
            <Tabs.TabPane tab="供应商" key="2">
              <SettingForm />
              <SettingUEditor />
            </Tabs.TabPane>
          </Tabs>
          <PicModal />
        </div>
      </div>
    );
  }
}
