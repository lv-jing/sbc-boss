import React from 'react';
import { StoreProvider, Relax } from 'plume2';
import { Headline, BreadCrumb, AuthWrapper } from 'qmkit';
import AppStore from './store';
import SearchForm from './components/search-form';
import ButtonGroup from './components/button-group';
import CustomerList from './components/tab-data-grid';
import CustomerModal from './components/customer-modal';
import RejectModal from './components/reject-modal';
import ForbidModal from './components/forbid-modal';
import { Form } from 'antd';

import SettingForm from './components/setting/setting-form';
import PicModal from './components/setting/pic-modal';

const SettingFormRelax = Relax(Form.create()(SettingForm));

import { Tabs } from 'antd';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class Customer extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    const state = this.props.location.state;
    if (state && state.key) {
      this.store.onTabChange(state.key);
    } else if (state && state.addCustomer) {
      this.store.onAdd();
      this.store.init();
    } else {
      this.store.init();
    }
    this.store.getCRMConfig();
  }

  render() {
    const key = this.store.state().get('key');
    return (
      <div>
        {/*导航面包屑*/}
        <BreadCrumb />
        <AuthWrapper functionName={'f_enterprise_customer_list'}>
          <div className="container customer">
            <Headline title="企业会员" />
            <Tabs
              activeKey={key.toString()}
              onChange={(key) => this._handleClick(key)}
            >
              <Tabs.TabPane tab="企业会员列表" key="1">
                {/*搜索条件*/}
                <SearchForm />

                {/*操作按钮组*/}
                <ButtonGroup />

                {/*tab的客户列表*/}
                <CustomerList />

                {/*新增弹窗*/}
                <CustomerModal />

                {/*驳回弹窗*/}
                <RejectModal />

                {/*禁用弹窗*/}
                <ForbidModal />
              </Tabs.TabPane>
              <Tabs.TabPane tab="企业购设置" key="2">
                <SettingFormRelax />
                <PicModal />
              </Tabs.TabPane>
            </Tabs>
          </div>
        </AuthWrapper>
      </div>
    );
  }

  _handleClick = (key) => {
    this.store.changeTabKey(key);
  };
}
