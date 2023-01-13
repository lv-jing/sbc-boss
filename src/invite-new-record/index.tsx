import React from 'react';
import { StoreProvider } from 'plume2';
import { Headline, BreadCrumb } from 'qmkit';
import AppStore from './store';
import SearchForm from './components/search-form';
import TabDataGrid from './components/tab-data-grid';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class InviteNewRecord extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.init(this.props.match.params);
  }

  render() {
    return (
      <div>
        {/*导航面包屑*/}
        <BreadCrumb />
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>营销</Breadcrumb.Item>
          <Breadcrumb.Item>社交分销管理</Breadcrumb.Item>
          <Breadcrumb.Item>邀新记录</Breadcrumb.Item>
        </Breadcrumb> */}
        {!this.store.state().get('loading') && (
          <div className="container customer">
            <Headline title="邀新记录" />

            {/*搜索条件*/}
            <SearchForm />

            {/*tab已入账/未入账邀新记录*/}
            <TabDataGrid />
          </div>
        )}
      </div>
    );
  }
}
