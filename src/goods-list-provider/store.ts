import { Store, IOptions } from 'plume2';
import { fromJS } from 'immutable';
import CateActor from './actor/cate-actor';
import BrandActor from './actor/brand-actor';
import GoodsActor from './actor/goods-actor';
import FormActor from './actor/form-actor';
import { message } from 'antd';
import { Const } from 'qmkit';
import {
  goodsList,
  getCateList,
  getBrandList,
  forbidSale,
  copyToGoodsLibrary
} from './webapi';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      window['_store'] = this;
    }
  }

  bindActor() {
    return [
      new CateActor(),
      new BrandActor(),
      new GoodsActor(),
      new FormActor()
    ];
  }

  /**
   * 初始化
   */
  init = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    //已审核通过的
    const { res, err } = (await goodsList({
      pageNum,
      pageSize,
      auditStatus: 1
    })) as any;
    if (!err && res.code === Const.SUCCESS_CODE) {
      res.context.goodsPage.content.forEach((v, i) => {
        v.key = i;
      });
      this._changeData(fromJS(res.context), fromJS(res.context.importStandard));
      this.dispatch('form:field', { key: 'pageNum', value: pageNum });
    } else {
      message.error(res.message);
    }
    const cates: any = await getCateList();
    const brands: any = await getBrandList();
    this.transaction(() => {
      this.dispatch('cateActor: init', fromJS(cates.res.context));
      this.dispatch('brandActor: init', fromJS(brands.res.context));
    });
  };

  /**
   * 条件搜索
   */
  onSearch = async () => {
    this.dispatch('form:field', { key: 'pageNum', value: 0 });
    this.onPageSearch();
  };

  /**
   * 带着搜索条件的分页点击查询
   */
  onPageSearch = async () => {
    let request: any = {
      likeGoodsName: this.state().get('likeGoodsName'),
      likeSupplierName: this.state().get('likeSupplierName'),
      likeGoodsInfoNo: this.state().get('likeGoodsInfoNo'),
      likeGoodsNo: this.state().get('likeGoodsNo'),
      pageNum: this.state().get('pageNum'),
      pageSize: this.state().get('pageSize'),
      auditStatus: 1 //已审核通过
    };

    if (this.state().get('cateId') != '-1') {
      request.cateId = this.state().get('cateId');
    }
    if (this.state().get('brandId') != '-1') {
      request.brandId = this.state().get('brandId');
    }
    if (this.state().get('addedFlag') != '-1') {
      request.addedFlag = this.state().get('addedFlag');
    }
    // if (this.state().get('saleType') != '-1') {
    //   request.saleType = this.state().get('saleType');
    // }
    if (this.state().get('goodsType') != '-1') {
      request.goodsType = this.state().get('goodsType');
    }
    const { res, err } = (await goodsList(request)) as any;
    if (!err) {
      res.context.goodsPage.content.forEach((v, i) => {
        v.key = i;
      });
      this._changeData(fromJS(res.context), fromJS(res.context.importStandard));
    }
  };

  /**
   * 显示/关闭禁售理由框
   */
  switchShowModal = (flag: boolean) => {
    this.dispatch('goodsActor: switchShowModal', flag);
  };

  /**
   * 搜索条件表单的变更
   */
  onFormFieldChange = ({ key, value }) => {
    this.dispatch('form:field', { key, value });
  };

  /**
   * 搜索skuNo,利用此进行标记展开哪些spuList
   */
  onEditSkuNo = (value) => {
    this.dispatch('goodsActor:editLikeGoodsInfoNo1', value);
  };

  /**
   * 修改展开显示的spuIdList
   */
  onShowSku = (value) => {
    this.dispatch('goodsActor:editExpandedRowKeys', value);
  };

  /**
   * 修改单个禁售的spuId
   */
  changeForbidGoodsId = (forbidGoodsId) => {
    this.dispatch('goodsActor:changeForbidGoodsId', forbidGoodsId);
  };

  /**
   * 修改禁售原因
   */
  changeForbidReason = (forbidReason) => {
    this.dispatch('goodsActor:changeForbidReason', forbidReason);
  };

  /**
   * 禁售商品
   */
  forbidSaleFunc = async (id) => {
    const forbidReason = this.state().get('forbidReason');
    const data: any = await forbidSale({
      goodsIds: [id],
      auditReason: forbidReason,
      auditStatus: 3
    });
    this.message(data);
    this.onSearch();
  };

  /**
   * 提示信息
   */
  message = (data: any) => {
    if (data.res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
    } else {
      message.error(data.res.code);
    }
  };

  //判断商品是否已经加入到商品库中，加入过的set('addToGoodsLibrary', false)，
  _changeData = (data, list) => {
    let content = data.getIn(['goodsPage', 'content']);
    content = content.map((value) => {
      const goodsId = value.get('goodsId');
      if (list && list.includes(goodsId)) {
        return value.set('addToGoodsLibrary', false);
      }
      return value.set('addToGoodsLibrary', true);
    });
    data = data.setIn(['goodsPage', 'content'], content);
    this.dispatch('goodsActor: init', data);
  };

  //将商品加入到商品库中，
  addToGoodsLibrary = async (goodsId) => {
    const { res, err } = (await copyToGoodsLibrary({
      goodsIds: [goodsId]
    })) as any;
    if (!err && res.code === Const.SUCCESS_CODE) {
      //更新已加入商品库的数据
      this.dispatch('goodsActor: updateGoodsLibrary', goodsId);
      message.success('加入成功');
    } else {
      message.error(res.message);
    }
  };
}
