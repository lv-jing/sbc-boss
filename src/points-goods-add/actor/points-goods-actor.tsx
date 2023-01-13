import { Action, Actor } from 'plume2';
import { fromJS } from 'immutable';
import { IMap } from 'plume2/es5/typings';

export default class PointsGoodsActor extends Actor {
  defaultState() {
    return {
      // 活动开始时间
      startTime: '',
      // 活动结束时间
      endTime: '',
      // 选择的商品ids
      chooseSkuIds: [],
      // 选择的具体商品信息
      goodsRows: [],
      // 分类列表
      cateList: []
    };
  }

  /**
   * 初始化所有分类列表
   * @param state
   * @param res
   * @returns {Map<string, V>}
   */
  @Action('new:cate:init')
  init(state: IMap, res) {
    return state.set('cateList', res);
  }

  /**
   * 键值设置
   * @param state
   * @param param1
   */
  @Action('goods: info: field: value')
  fieldsValue(state, { field, value }) {
    state = state.set(field, fromJS(value));
    return state;
  }

  /**
   * 修改时间区间
   * @param state
   * @param param1
   */
  @Action('goods: info: date: range')
  changeDateRange(state, { startTime, endTime }) {
    return state.set('startTime', startTime).set('endTime', endTime);
  }

  @Action('modalActor: change:goods')
  changePointsGoods(state: IMap, { goodsInfoId, field, value }) {
    return state.update('goodsRows', (rows) =>
      rows.map((goodsInfo) => {
        if (goodsInfo.get('goodsInfoId') == goodsInfoId) {
          return goodsInfo.set(field, value);
        }
        return goodsInfo;
      })
    );
  }

  @Action('delete: selected: sku')
  deleteSelectSku(state, skuId) {
    let goodsRows = state.get('goodsRows');
    let chooseSkuIds = state.get('chooseSkuIds');
    chooseSkuIds = chooseSkuIds.splice(
      chooseSkuIds.findIndex((item) => item == skuId),
      1
    );
    goodsRows = goodsRows.delete(
      goodsRows.findIndex((row) => row.get('goodsInfoId') == skuId)
    );
    return state.set('goodsRows', goodsRows).set('chooseSkuIds', chooseSkuIds);
  }
}
