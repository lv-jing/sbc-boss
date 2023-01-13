import React from 'react';
import { Breadcrumb } from 'antd';
import { StoreProvider } from 'plume2';
import { Headline, BreadCrumb } from 'qmkit';
import AppStore from './store';
import DetailTab from './components/detail-tab';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class FlashSale extends React.Component<any, any> {
  store: AppStore;

  componentWillMount() {
    const state = this.props.location.state;
    this.store.init(state);
  }

  render() {
    return (
      <div>
        {/* 面包屑导航 */}
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>活动详情</Breadcrumb.Item>
        </BreadCrumb>

        <div className="container">
          {/* 头部标题 */}
          <Headline
            title={'整点秒杀'
              .concat(this.store.state().get('activityDate'))
              .concat(' ')
              .concat(this.store.state().get('activityTime'))
              .concat('场次')}
          />
          <div>
            <div>参与商家：{this.store.state().get('storeSum')}</div>
            <div>参与商品：{this.store.state().get('goodsSum')}</div>
          </div>
          {/* 数据列表区域 */}
          <DetailTab />
        </div>
      </div>
    );
  }
}
