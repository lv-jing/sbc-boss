import React from 'react';
import { Breadcrumb, Alert } from 'antd';
import { StoreProvider } from 'plume2';

import { Headline, BreadCrumb } from 'qmkit';
import AppStore from './store';
import CateList from './component/cate-list';
import CateModal from './component/cate-modal';
import Tool from './component/tool';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class GoodsCate extends React.Component<any, any> {
  store: AppStore;

  componentWillMount() {
    this.store.init();
  }

  render() {
    const firstCount = this.store.state().get('firstCount');
    const secondCount = this.store.state().get('secondCount');
    const thirdCount = this.store.state().get('thirdCount');
    return (
      <div>
        <BreadCrumb />
        <div className="container">
          <Headline
            title="商品类目"
            smallTitle={`当前总共${firstCount}个一级类目, ${secondCount}个二级类目, ${thirdCount}个三级类目`}
          />
          <div style={{ marginBottom: 16 }}>
            <Alert
              message="商品类目最多可添加3个层级，一级及二级类目只做为结构类目存在，店铺只能签约第三级类目，未添加三级类目的类目不会在商城前台展示。对商品类目的编辑或删除将会影响到商家的商品展示与销售分润，请谨慎操作，尽量使用“编辑”而避免“删除”！"
              type="info"
              showIcon
            />
          </div>

          {/*工具条*/}
          <Tool />

          {/*列表*/}
          <CateList />

          {/*弹框*/}
          <CateModal />
        </div>
      </div>
    );
  }
}
