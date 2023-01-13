import { Actor, Action, IMap } from 'plume2';
import { List } from 'immutable';
declare type IList = List<any>;

export default class ModalActor extends Actor {
  defaultState() {
    return {
      //品牌弹框是否显示
      brandVisible: false,
      //类目弹框是否显示
      sortsVisible: false,
      // 弹框中签约分类集合
      cates: [],
      // 已签约分类数量
      cateSize: 0,
      // 平台全部分类
      allCates: [],
      // 被删除的分类Id集合(已签约的)
      delCateIds: []
    };
  }

  /**
   * 品牌弹框
   */
  @Action('modalActor: brandModal')
  clickBrand(state) {
    return state.set('brandVisible', !state.get('brandVisible'));
  }

  /**
   * 显示类目弹框
   */
  @Action('modalActor: sortModal')
  clickSorts(state) {
    return state.set('sortsVisible', !state.get('sortsVisible'));
  }

  /**
   * 签约分类
   * @param state
   * @param cates
   */
  @Action('modal: cates')
  modalCates(state: IMap, cates: IList) {
    return state.set('cates', cates).set('cateSize', cates.count());
  }

  /**
   * 平台全部分类
   * @param state
   * @param cates
   */
  @Action('modal: AllCates')
  allCates(state: IMap, cates) {
    return state.set('allCates', cates);
  }

  /**
   * 删除分类
   * @param state
   * @param cateIds
   */
  @Action('modal: cate: delete')
  delCate(state: IMap, cateIds) {
    return state.set('delCateIds', cateIds);
  }
}
