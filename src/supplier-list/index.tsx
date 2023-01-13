import React from 'react';
import { StoreProvider } from 'plume2';
import { Headline, BreadCrumb } from 'qmkit';
import AppStore from './store';
import SearchForm from './components/search-form';
import Tab from './components/tab';
import OperateModal from './components/modal';
import { FormattedMessage } from 'react-intl';
@StoreProvider(AppStore, { debug: __DEV__ })
export default class SupplierList extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    const state = this.props.location.state;
    if (state) {
      this.store.changeTab(state.auditState);
    } else {
      this.store.initSuppliers();
    }
  }

  render() {
    return (
      <div>
        <BreadCrumb />
        <div className="container">
          <Headline title={<FormattedMessage id="Store.list" />} />
          <SearchForm />
          <Tab />
        </div>
        {/* 禁用弹框 */}
        <OperateModal />
      </div>
    );
  }
}
