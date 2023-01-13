import React from 'react';
import { Breadcrumb, Form } from 'antd';
import { StoreProvider } from 'plume2';

import { Headline, BreadCrumb } from 'qmkit';
import { DistributionGoodsMatterHead, ShowImageModel } from 'biz';

import AppStore from './store';
import GoodsMatterForm from './components/goods-matter-form';
import PicModal from './components/pic-modal';
import LinkModal from './components/link-modal';
const GoodsMatterFormBox = Form.create()(GoodsMatterForm);

@StoreProvider(AppStore, { debug: __DEV__ })
export default class DistributionGoodsMatterInfo extends React.Component<
any,
any
> {
  store: AppStore;
  _form: any;

  componentWillMount() {
    const { id } = this.props.match.params;
    const data = this.props.location.state;
    this.store.init(data, id);
    this.store.initImg({
      pageNum: 0,
      cateId: -1,
      successCount: 0
    });
    //  this.store.initVideo({
    //   pageNum: 0,
    //   cateId: -1,
    //   successCount: 0
    // }); //传入-1时,则会去初始化第一个分类的信息
  }

  render() {
    const data = this.props.location.state;
    const { id } = this.props.match.params;
    const previewImage = this.store.state().get('previewImage');
    return (
      <div>
        {/*导航面包屑*/}
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>{id ? '编辑' : '新增'}分销素材</Breadcrumb.Item>
        </BreadCrumb>
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>营销</Breadcrumb.Item>
          <Breadcrumb.Item>社交分销管理</Breadcrumb.Item>
          <Breadcrumb.Item>分销商品</Breadcrumb.Item>
          <Breadcrumb.Item>{id ? '编辑' : '新增'}分销素材</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className="container">
          <Headline title="分销素材" />

          {
            data.goodsInfoId == -1 ? null :
              <DistributionGoodsMatterHead
                skuImageUrl={data.goodsInfoImg}
                skuName={data.goodsInfoName}
                skuNo={data.goodsInfoNo}
                skuSpe={data.currentGoodsSpecDetails}
              />
          }

          <GoodsMatterFormBox ref={(form) => (this['_form'] = form)} />

          <PicModal />

          {/*<VideoModal />*/}

          <ShowImageModel
            url={previewImage}
            visible={previewImage != ''}
            clickImg={() => this.store.clickImg('')}
          />
        </div>
        <LinkModal />
      </div>
    );
  }
}
