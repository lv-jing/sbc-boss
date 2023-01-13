import {Action, Actor, IMap} from 'plume2';
import {IList} from 'typings/globalType';

export default class CateActor extends Actor {
  defaultState() {
    return {
      cateList: [],
      modalVisible: false,
      isAdd: true,
      formData: {
      },
      images: [],
    };
  }

  /**
   * 初始化
   */
  @Action('cate: init')
  init(state: IMap, cateList: IList) {
    return state.set('cateList', cateList)
  }


   /**
   * 显示弹窗
   */
  @Action('cate: modal')
  show(state: IMap, isAdd:boolean) {
    const visible = !state.get('modalVisible');
    state = state.set('isAdd', isAdd);
    return state.set('modalVisible', visible);
  }

  /**
   * 修改表单内容
   */
  @Action('cate: editFormData')
  editCateInfo(state: IMap, data: IMap) {
    return state.update('formData', (formData) => formData.merge(data));
  }

}
