import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';
import { IList } from 'typings/globalType';

export default class CateActor extends Actor {
  defaultState() {
    return {
      // 分类集合
      couponCateList: [],
      // 弹框是否显示
      modalVisible: false,
      // 表单内容
      formData: {},
      isAdd: true
    };
  }

  /**
   * 初始化
   */
  @Action('cate: init')
  init(state: IMap, cates: IList) {
    return state.set('couponCateList', cates);
  }

  /**
   * 修改表单内容
   */
  @Action('cate: editFormData')
  editCateInfo(state: IMap, data: IMap) {
    return state.update('formData', (formData) => formData.merge(data));
  }

  /**
   * 显示弹窗
   */
  @Action('cate: modal')
  show(state: IMap, isAdd) {
    const visible = !state.get('modalVisible');
    if (!visible) {
      state = state.set('formData', fromJS({}));
    }
    return state.set('modalVisible', visible).set('isAdd', isAdd);
  }
}
