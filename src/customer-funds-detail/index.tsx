import React from 'react';
import { Breadcrumb } from 'antd';
import { StoreProvider } from 'plume2';

import { Headline, BreadCrumb } from 'qmkit';
import AppStore from './store';
import Search from './component/search';
import Tab from './component/tab';
import Statistics from './component/statistics';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class CustomerFunds extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    const customerId =
      this.props.customerId || this.props.match.params.customerId;
    this.store.setFormField('customerId', customerId);
    this.store.statistics();
    this.store.init();
  }

  render() {
    return (
      <div>
        {!this.props.customerId && (
          <BreadCrumb thirdLevel={true}>
            <Breadcrumb.Item>余额明细</Breadcrumb.Item>
          </BreadCrumb>
        )}
        <div className="container" style={this.props.customerId ? { padding: 0, margin: 0 } : {}}>
          {!this.props.customerId && <Headline title="余额明细" />}
          {/*会员资金统计展示区*/}
          <Statistics />
          {/*搜索框*/}
          <Search />
          {/*Tab切换明细列表*/}
          <Tab />
        </div>
      </div>
    );
  }
}
