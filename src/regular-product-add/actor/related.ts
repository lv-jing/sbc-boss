import { Actor, Action } from 'plume2';
import { Map } from 'immutable';
import { IMap } from 'typings/globalType';

export default class BrandActor extends Actor {
  defaultState() {
    return {
      // 弹框是否显示
      modalBrandVisible: false,
      // 表单内容
      relatedList: [],
      id: '',
      productselect: '',
      addRelated: '',
      goodsId: '',
      SPU: '',
      productName: '',
      signedClassification: '',
      Brand: '',
      // 已审核状态的商品列表
      auditStatus: 1,
      // 模糊条件-商品名称
      likeGoodsName: '',
      // 模糊条件-SKU编码
      likeGoodsInfoNo: '',
      // 模糊条件-SPU编码
      likeGoodsNo: '',

      likeProductCategory: '',
      // 商品店铺分类
      storeCategoryIds: null,
      goodsCateId: null,
      // 品牌编号
      brandId: null,
      // 上下架状态-也是tab页的下标
      addedFlag: '',
      // 销售类别 批发or零售
      saleType: '',

      pageNum: 0,
      pageSize: 10,
      field: '',
      productTooltip: '',
      searchType: false,
      goodsCateName: ''
    };
  }

  /**
   * 修改表单内容
   */
  @Action('related:relatedList')
  relatedList(state, data: IMap) {
    return state.set('relatedList', data);
  }

  /**
   * 显示弹窗
   */
  @Action('brandActor: showModal')
  show(state, needClear: boolean) {
    if (needClear) {
      state = state.set('brandData', Map());
    }
    return state.set('modalBrandVisible', true);
  }

  /**
   * 关闭弹窗
   */
  @Action('brandActor: closeModal')
  close(state) {
    return state.set('modalBrandVisible', false).set('brandData', Map());
  }

  //product select
  @Action('product:productselect')
  productselect(state: IMap, res) {
    return state.set('productselect', res);
  }

  //add related
  @Action('related:addRelated')
  addRelated(state: IMap, res) {
    return state.set('addRelated', res);
  }

  @Action('related:goodsId')
  goodsId(state: IMap, res) {
    return state.set('goodsId', res);
  }

  /*筛选*/
  @Action('related:SPU')
  SPU(state: IMap, res) {
    return state.set('SPU', res);
  }

  @Action('related:productName')
  productName(state: IMap, res) {
    return state.set('productName', res);
  }

  @Action('related:signedClassification')
  signedClassification(state: IMap, res) {
    return state.set('signedClassification', res);
  }

  @Action('related:Brand')
  Brand(state: IMap, res) {
    return state.set('Brand', res);
  }

  @Action('form:field')
  formFieldChange(state: IMap, { key, value }) {
    return state.set(key, value);
  }

  @Action('related:productTooltip')
  productTooltip(state: IMap, res) {
    return state.set('productTooltip', res);
  }

  @Action(' related:searchType')
  searchType(state: IMap, res) {
    return state.set('searchType', res);
  }
}
