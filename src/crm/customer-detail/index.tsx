import React from 'react';
import { StoreProvider } from 'plume2';
import { Breadcrumb } from 'antd';
import AppStore from './store';
import { BreadCrumb } from 'qmkit';
import BaseInfo from './components/base-info';
import EnterpriseInfo from './components/enterprise-info';
import ConsumptionAnalysis from './components/consumption-analysis';
import InfoSummary from './components/info-summary';
import BaseInfoModal from './components/base-info-modal';
import './index.less';
import TagInfo from './components/tag-info';
import TagModal from './components/tag-modal';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class CRMCustomerDetail extends React.Component<any, any> {
  store: AppStore;

  componentWillMount() {
    const { customerId } = this.props.match.params;
    this.store.init(customerId);
  }

  render() {
    const baseInfo = this.store.state().get('baseInfo');
    const isIep =
      baseInfo &&
      baseInfo.enterpriseCheckState &&
      baseInfo.enterpriseCheckState != 0;
    return (
      <div className="crm-customer-detail">
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>客户详情</Breadcrumb.Item>
        </BreadCrumb>
        <div style={{ padding: '12px 12px 0 12px' }}>
          <BaseInfo />
          <BaseInfoModal />
          {isIep ? <EnterpriseInfo /> : null}
          <TagInfo />
          <TagModal />
          {this.store.state().get('rfmStatistic') && Object.keys(this.store.state().get('rfmStatistic')).length>0 && <ConsumptionAnalysis />}          
          <InfoSummary customerId={this.props.match.params.customerId} />
        </div>
      </div>
    );
  }
}
