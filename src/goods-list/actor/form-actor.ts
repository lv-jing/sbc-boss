import { Actor, Action, IMap } from 'plume2';

export default class FormActor extends Actor {
  defaultState() {
    return {
      // 已审核状态的商品列表
      auditStatus: 1,
      // 模糊条件-商品名称
      likeGoodsName: '',
      // 模糊条件-SKU编码
      likeGoodsInfoNo: '',
      // 模糊条件-SPU编码
      likeGoodsNo: '',
      // 商品店铺分类
      storeCateId: null,
      // 品牌编号
      brandId: '-1',
      cateId: '',
      // 上下架状态-也是tab页的下标
      addedFlag: '-1',
      // 销售类别 批发or零售
      saleType: '-1',
      //store id
      storeId: '-1',

      pageNum: 0,
      pageSize: 10
    };
  }

  @Action('form:field')
  formFieldChange(state: IMap, { key, value }) {
    return state.set(key, value);
  }
}
