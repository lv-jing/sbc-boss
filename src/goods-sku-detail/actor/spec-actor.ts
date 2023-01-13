import { Actor, Action } from 'plume2';
import { IList } from 'typings/globalType';
import { fromJS } from 'immutable';

export default class GoodsSpecActor extends Actor {
  defaultState() {
    return {
      // 规格列表
      goodsSpecs: [
        {
          specId: this._getRandom(),
          specName: '',
          specValues: []
        }
      ],
      goodsList: [{ id: this._getRandom(), index: 1 }]
    };
  }

  /**
   *  初始化规格及商品
   */
  @Action('goodsSpecActor: init')
  init(
    state,
    { goodsSpecs, goodsList }: { goodsSpecs: IList; goodsList: IList }
  ) {
    if (!goodsSpecs.isEmpty()) {
      state = state.set('goodsSpecs', goodsSpecs);
    }
    return state.set('goodsList', goodsList);
  }

  /**
   * 修改商品属性
   */
  @Action('goodsSpecActor: editGoodsItem')
  editGoodsItem(
    state,
    { id, key, value }: { id: string; key: string; value: any }
  ) {
    return state.update('goodsList', (goodsList) => {
      const index = goodsList.findIndex((item) => item.get('id') == id);
      return goodsList.update(index, (item) => item.set(key, value));
    });
  }

  /**
   *  获取整数随机数
   */
  _getRandom = () => {
    return parseInt(
      Math.random()
        .toString()
        .substring(2, 18)
    );
  };

  /**
   * 移除sku图片
   * @param state
   * @param skuId
   */
  @Action('goodsSpecActor: removeImg')
  removeImg(state, skuId: string) {
    return state.update('goodsList', (goodsList) => {
      const index = goodsList.findIndex((item) => item.get('id') == skuId);
      return goodsList.update(index, (item) => item.set('images', fromJS([])));
    });
  }
}
