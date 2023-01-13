//资金管理-财务对账-对账详细
import React from 'react';
import { StoreProvider } from 'plume2';
import { Breadcrumb } from 'antd';
import { Headline, BreadCrumb } from 'qmkit';
import AppStore from './store';
import SearchForm from './components/search-form';
import RefundList from './components/refund-list';
import RevenueList from './components/revenue-list';
import Foot from './components/foot';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class FinancialRefund extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    const { sid } = this.props.match.params;
    const { kind } = this.props.match.params;
    const { beginTime, endTime, storeName } = this.props.location.state;
    this.store.init({
      sid: sid,
      kind: kind,
      beginTime: beginTime,
      endTime: endTime,
      storeName: storeName
    });
  }

  render() {
    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>收入对账明细</Breadcrumb.Item>
        </BreadCrumb>
        <div className="container">
          {this.store.state().get('kind') == 'income' ? (
            <div>
              <Headline title="收入对账明细" />
              <SearchForm name="支付渠道" />
              <RevenueList />
            </div>
          ) : (
              <div>
                <Headline title="退款对账明细" />
                <SearchForm name="退款渠道" />
                <RefundList />
              </div>
            )}

          <Foot />
        </div>
      </div>
    );
  }
}
