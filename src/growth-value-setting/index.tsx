import React from 'react';
import {StoreProvider} from 'plume2';
import { Form} from 'antd';
import { Headline,BreadCrumb } from 'qmkit';
import AppStore from './store';
import Tips from './component/tips';
import Rules from './component/rules';
import Setting from './component/setting-form';

const SettingForm = Form.create()(Setting);

@StoreProvider(AppStore, { debug: __DEV__ })
export default class GrowthValueSetting extends React.Component<any, any> {
  store: AppStore;

  componentWillMount() {
    this.store.init();
    this.store.initImg({ pageNum: 0, cateId: -1, successCount: 0 });
  }

  render() {
    return (
      <div>
        <BreadCrumb/>
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>客户</Breadcrumb.Item>
          <Breadcrumb.Item>忠诚度管理</Breadcrumb.Item>
          <Breadcrumb.Item>成长值设置</Breadcrumb.Item>
        </Breadcrumb> */}
        {
          <div className="container" style={{'display':this.store.state().get('loading')?'none':'block'}}>
            <Headline title="成长值设置" />

            <Tips />

            <SettingForm/>

            <Rules/>
          </div>
        }
      </div>
    );
  }
}
