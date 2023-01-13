import { Actor, Action } from 'plume2';
import { List } from 'immutable';
import { treeNesting } from '../../../web_modules/qmkit/utils/utils'
declare type IList = List<any>;

export default class CateActor extends Actor {
  defaultState() {
    return {
      cateList: [], //层级结构的分类列表
      allCateList: [], //扁平的分类列表

      productCateList: [],
      sourceGoodCateList: []
    };
  }

  @Action('cateActor: init')
  init(state, cateList: IList) {
    const newDataList = treeNesting(cateList,'cateParentId','cateId')
    return state.set('cateList', newDataList).set('allCateList', cateList);
  }

  @Action('goodsActor:getGoodsCate')
  getGoodsCate(state, dataList) {
    const newDataList = treeNesting(dataList,'cateParentId','cateId')
    return state.set('productCateList', newDataList).set('sourceGoodCateList', dataList);
  }
}
