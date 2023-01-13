import { Actor, Action } from 'plume2';
import { IMap } from 'typings/globalType';

export default class GoodsActor extends Actor {
  defaultState() {
    return {
      // 商品信息
      goods: {},
      spu: {},
      //保存状态loading
      saveLoading: false
    };
  }

  /**
   * 修改商品信息
   * @param state
   * @param data
   */
  @Action('goodsActor: editGoods')
  editGoods(state, data: IMap) {
    return state.update('goods', (goods) => goods.merge(data));
  }

  /**
   * spu信息
   * @param state
   * @param data
   */
  @Action('goodsActor: spu')
  spu(state, data: IMap) {
    return state.update('spu', (spu) => spu.merge(data));
  }

  /**
   * 修改商品信息
   * @param state
   * @param saveLoading
   */
  @Action('goodsActor: saveLoading')
  saveLoading(state, saveLoading: boolean) {
    return state.set('saveLoading', saveLoading);
  }

  @Action('goodsActor: tabChange')
  tabChange(state, activeKey) {
    return state.set('activeTabKey', activeKey);
  }
}
