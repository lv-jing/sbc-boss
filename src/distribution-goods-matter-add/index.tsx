import React from 'react';
import { Breadcrumb, Form } from 'antd';
import { StoreProvider } from 'plume2';
import { BreadCrumb } from 'qmkit';

import { DistributionGoodsModal } from 'biz';

import AppStore from './store';
import GoodsMatterForm from './components/goods-matter-form';
import PicModal from './components/pic-modal';
import LinkModal from './components/link-modal';
import ImgModal from './components/img-modal';
const GoodsMatterFormBox = Form.create()(GoodsMatterForm);

@StoreProvider(AppStore, { debug: __DEV__ })
export default class DistributionGoodsMatterAdd extends React.Component<
any,
any
> {
  store: AppStore;
  _form: any;

  componentWillMount() {
    this.store.checkAuth();
    // const { id } = this.props.match.params;
    // const data = this.props.location.state;
    // this.store.init(data, id);
    this.store.initImg({
      pageNum: 0,
      cateId: -1,
      successCount: 0
    });
  }

  render() {
    return (
      <div>
        {/*导航面包屑*/}
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>新增分销素材</Breadcrumb.Item>
        </BreadCrumb>
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>营销</Breadcrumb.Item>
          <Breadcrumb.Item>社交分销管理</Breadcrumb.Item>
          <Breadcrumb.Item>分销商品</Breadcrumb.Item>
          <Breadcrumb.Item>新增分销素材</Breadcrumb.Item>
        </Breadcrumb> */}
        {
          this.store.state().get('auth') ?
            <div className="container">
              <GoodsMatterFormBox ref={(form) => (this['_form'] = form)} />
              <PicModal />
            </div> : null
        }
        <LinkModal />
        <DistributionGoodsModal
          showValidGood={true}
          // 是否仅勾选上架商品
          checkAddedGood={true}
          visible={this.store.state().get('goodsModalVisible')}
          selectedSkuIds={this.store.state().get('chooseSkuIds').toJS()}
          selectedRows={this.store.state().get('chooseGoodsInfos').toJS()}
          onOkBackFun={this._onOkBackFun}
          onCancelBackFun={() => this.store.toggleGoodsModal()}
          skuLimit={1}
        />
        <ImgModal />
      </div>
    );
  }

  _onOkBackFun = (skuIds, rows) => {
    // this.props.form.setFieldsValue({
    //   chooseSkuIds: skuIds
    // });    
    this.store.onOkBackFun(skuIds, rows)
  };
}
