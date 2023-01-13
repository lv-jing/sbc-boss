import { Actor, Action } from 'plume2';
import { Map, fromJS } from 'immutable';
import { IMap } from 'typings/globalType';

export default class CateActor extends Actor {
  defaultState() {
    return {
      // 弹框是否显示
      modalCateVisible: false,
      // 表单内容
      cateData: {},
      childFlag: false,
      cateImages: []
    };
  }

  /**
   * 修改表单内容
   */
  @Action('cateActor: editFormData')
  editCateInfo(state, data: IMap) {
    return state.update('cateData', (formData) => formData.merge(data));
  }

  /**
   * 显示弹窗
   */
  @Action('cateActor: showModal')
  show(state) {
    return state.set('modalCateVisible', true);
  }

  /**
   * 关闭弹窗
   */
  @Action('cateActor: closeModal')
  close(state) {
    return state
      .set('modalCateVisible', false)
      .set('formData', Map())
      .set('cateImages', fromJS([]));
  }

  /**
   * 检测图片
   */
  @Action('cateActor: editImages')
  editImages(state, images) {
    return state.set('cateImages', images);
  }
}
