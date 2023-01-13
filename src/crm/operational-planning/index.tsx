import React from 'react';
import { StoreProvider } from 'plume2';
import { Headline, BreadCrumb } from 'qmkit';
import { Breadcrumb } from 'antd';
import PlanAlert from './components/plan-alert';
import PlanLine from './components/plan-line';
import PlanMarketing from './components/plan-marketing';
import PlanNotice from './components/plan-notice';
import PlanEffect from './components/plan-effect';
import AppStore from './store';
import './index.less';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class AboutUs extends React.Component<any, any> {
  store: AppStore;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { planId } = this.props.match.params;
    this.store.init(planId);
  }

  render() {
    return (
      <div>
        <BreadCrumb>
          <Breadcrumb.Item>运营计划效果数据</Breadcrumb.Item>
        </BreadCrumb>
        <div className="container">
          <Headline title="运营计划效果数据" />
          <PlanAlert />
          <PlanLine textDetail="覆盖人/次" />
          <PlanMarketing />
          <PlanLine textDetail="通知人/次" />
          <PlanNotice />
          <PlanLine textDetail="转换效果" />
          <PlanEffect />
        </div>
      </div>
    );
  }
}
