import React from 'react';
import { StoreProvider } from 'plume2';

import { Headline, BreadCrumb } from 'qmkit';

import AppStore from './store';

import './index.less';
import AddSale from './components/add-sale';
import AddVerify from './components/add-verify';
import AddNotice from './components/add-notice';

const arr = ['验证码类短信模板', '通知类短信模板', '营销类短信模板'];

@StoreProvider(AppStore, { debug: __DEV__ })
export default class SMSTemplate extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    const { type, id } = this.props.match.params;
    this.store.init(type, id);
  }

  render() {
    const type = this.store.state().get('type');
    const ifEdit = this.store.state().get('ifEdit');
    let title = ifEdit ? '编辑' : '新增';
    title += arr[type];
    return (
      <div>
        <BreadCrumb />
        <div className="container">
          <Headline title={title} />
          {+type === 0 && <AddVerify />}
          {+type === 1 && <AddNotice />}
          {+type === 2 && <AddSale />}
        </div>
      </div>
    );
  }
}
