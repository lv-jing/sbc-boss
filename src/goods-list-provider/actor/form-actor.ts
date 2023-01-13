import { Actor, Action, IMap } from 'plume2';

export default class FormActor extends Actor {
  defaultState() {
    return {
      // 模糊条件-商品名称
      likeGoodsName: '',
      // 模糊条件-商家名称
      likeSupplierName: '',
      // 模糊条件-SKU编码
      likeGoodsInfoNo: '',
      // 模糊条件-SPU编码
      likeGoodsNo: '',
      // 商品分类
      cateId: '-1',
      // 品牌编号
      brandId: '-1',
      // 上下架状态
      addedFlag: '-1',
      // 销售类别 批发or零售
      saleType: '-1',
      pageNum: 0,
      pageSize: 10,
      //商品类型 实物商品or虚拟商品
      goodsType: '-1',
      // 搜索项类型 0: SPU 1: SKU
      optType: '0'
    };
  }

  @Action('form:field')
  formFieldChange(state: IMap, { key, value }) {
    return state.set(key, value);
  }
}
