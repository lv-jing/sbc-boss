import React from 'react';
import { StoreProvider } from 'plume2';
import { Breadcrumb } from 'antd';
import { Headline, BreadCrumb } from 'qmkit';
import PointsDetailTitle from './components/points-detail-title';
import PointsDetailList from './components/points-list';
import AppStore from './store';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class PointsDetail extends React.Component<any, any> {
  store: AppStore;

  componentWillMount() {
    let cid = this.props.cid || this.props.match.params.cid;
    this.store.setCustomerId(cid);
  }

  componentDidMount() {
    this.store.init();
    this.store.queryInfo();
  }

  render() {
    const { cid } = this.props;
    return (
      <div>
        {!cid && (<BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>客户积分详情</Breadcrumb.Item>
        </BreadCrumb>)}
        <div className="container" style={cid ? { padding: 0, margin: 0 } : {}}>
          {!cid && <Headline title="客户积分详情" />}
          <PointsDetailTitle />
          <p
            className="detailTitle"
            style={{ marginBottom: 10, marginTop: 10 }}
          >
            积分明细
          </p>
          <PointsDetailList />
        </div>
      </div>
    );
  }
}
