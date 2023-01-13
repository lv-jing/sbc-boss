import * as React from 'react';
import { StoreProvider } from 'plume2';
import { Breadcrumb } from 'antd';
import { Headline, BreadCrumb } from 'qmkit';
import AppStore from './store';
import Goods from './component/goods';
import GoodsPropDetail from './component/goodsPropDetail';
import Spec from './component/spec';
import SkuTable from './component/sku-table';
import Freight from './component/freight';
import Detail from './component/detail';
import PicModal from './component/pic-modal';
import ImgModal from './component/img-modal';
import VideoModal from './component/video-modal';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class GoodsAdd extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    const { goodsId } = this.props.match.params;
    this.store.init(goodsId);
    //初始化素材
    this.store.initResource({
      pageNum: 0,
      pageSize: 10,
      cateId: -1
    }); //传入-1时,则会去初始化第一个分类的信息
  }

  render() {
    const { goodsId } = this.props.match.params;
    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>{goodsId ? '编辑商品' : '新增商品'}</Breadcrumb.Item>
        </BreadCrumb>

        <div className="container" style={{ paddingBottom: 50 }}>
          <Headline title={goodsId ? '编辑商品' : '新增商品'} />

          {/*商品基本信息*/}
          <Goods />
          {/*商品属性信息*/}
          <GoodsPropDetail />

          {/*商品规格信息*/}
          <Spec />

          {/*商品表格*/}
          <SkuTable />

          {/*物流*/}
          <Freight />

          {/*详情*/}
          <Detail />

          {/*图片库*/}
          <PicModal />

          <ImgModal />

          {/*视频库*/}
          <VideoModal />
        </div>
      </div>
    );
  }
}
