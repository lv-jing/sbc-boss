import * as React from 'react';
import { StoreProvider } from 'plume2';
import { Breadcrumb } from 'antd';
import { Headline } from 'qmkit';
import AppStore from './store';
import SkuTable from './component/sku-table';
import PicModal from './component/pic-modal';
import ImgModal from './component/img-modal';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class GoodsSKUEdit extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    const { goodsId } = this.props.match.params;
    this.store.init(goodsId);
    this.store.initImg({ pageNum: 0, cateId: -1, successCount: 0 }); //传入-1时,则会去初始化第一个分类的信息
  }

  render() {
    //默认添加商品的编辑与设价权限
    return (
      <div>
        <Breadcrumb separator=">">
          <Breadcrumb.Item>商品</Breadcrumb.Item>
          <Breadcrumb.Item>商品管理</Breadcrumb.Item>
          <Breadcrumb.Item>商品库</Breadcrumb.Item>
          <Breadcrumb.Item>编辑商品库商品SKU</Breadcrumb.Item>
        </Breadcrumb>
        <div className="container" style={{ paddingBottom: 50 }}>
          <Headline title="编辑商品SKU" />

          {/*商品表格*/}
          <SkuTable />

          <PicModal />
          <ImgModal />
        </div>
      </div>
    );
  }
}
