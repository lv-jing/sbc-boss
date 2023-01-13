import React from 'react';
import { Form } from 'antd';
import { StoreProvider } from 'plume2';
import { Headline,BreadCrumb } from 'qmkit';
import AppStore from './store';
import TabDataGrid from './components/tab-data-grid';

const FlashSaleSetting = Form.create()(TabDataGrid as any);

@StoreProvider(AppStore, { debug: __DEV__ })
export default class FlashSale extends React.Component<any, any> {
  store: AppStore;

  componentWillMount() {
    this.store.init();
  }

  render() {
    const storeCount = this.store.state().get('storeCount');
    return (
      <div>
        {/* 面包屑导航 */}
        <BreadCrumb/>
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>营销</Breadcrumb.Item>
          <Breadcrumb.Item>抢购活动</Breadcrumb.Item>
          <Breadcrumb.Item>整点秒杀</Breadcrumb.Item>
        </Breadcrumb> */}

        <div className="container">
          {/* 头部标题 数量传值*/}
          <Headline
            title="整点秒杀"
            smallTitle={`当前参与商家${storeCount}个`}
          />
          {/*tab*/}
          <FlashSaleSetting />
        </div>
      </div>
    );
  }
}
