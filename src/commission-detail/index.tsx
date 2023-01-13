import React from 'react';
import { Breadcrumb } from 'antd';
import { BreadCrumb } from 'qmkit';

import { StoreProvider } from 'plume2';
import AppStore from './store';
import Tab from './component/tab';
import GeneralCommissionDetail from './component/search-form';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class CommissionDetail extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    const { tid } = this.props.match.params;
    //存储customerId
    this.store.setFormField('customerId', tid);
    //获取全部佣金明细
    this.store.init();
    //获取概况
    this.store.getGeneralCommissionDetail(tid);
  }

  render() {
    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>佣金明细</Breadcrumb.Item>
        </BreadCrumb>
        <div className="container">
          <h2>佣金明细</h2>
          {/*会员资金统计展示区*/}
          <GeneralCommissionDetail />

          {/*Tab切换明细列表*/}
          <Tab />
        </div>
      </div>
    );
  }
}
