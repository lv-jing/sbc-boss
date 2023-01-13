import React, {Component} from 'react';
import {Relax, StoreProvider} from 'plume2';

import { Form} from 'antd';
import {Headline,BreadCrumb} from 'qmkit';

import Appstore from './store';
import PointsCouponForm from './components/points-coupon-form';

const PointsGoodsFormBox = Form.create()(PointsCouponForm as any);
const PointsGoodsRelax = Relax(PointsGoodsFormBox);

@StoreProvider(Appstore, { debug: __DEV__ })
export default class PointsGoodsInfo extends Component<any, any> {
  store: Appstore;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.store.init();
  }

  render() {
    return [
      <BreadCrumb/>,
      // <Breadcrumb separator=">" key="Breadcrumb">
      //   <Breadcrumb.Item>营销</Breadcrumb.Item>
      //   <Breadcrumb.Item>积分商城</Breadcrumb.Item>
      //   <Breadcrumb.Item>添加积分优惠券</Breadcrumb.Item>
      // </Breadcrumb>,
      <div className="container" key="container">
        <Headline title="添加积分优惠券" />
        <div style={styles.container}>
          <PointsGoodsRelax />
        </div>
      </div>
    ];
  }
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row'
  }
} as any;
