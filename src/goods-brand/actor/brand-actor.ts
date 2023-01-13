import { Actor, Action } from 'plume2';
import { List, Map, fromJS } from 'immutable';
import { IMap } from 'typings/globalType';

export default class BrandActor extends Actor {
  defaultState() {
    return {
      //当前的数据总数
      total: 0,
      //当前的分页条数
      pageSize: 10,
      // 后端返回的页码
      pageNum: 0,
      dataList: List(),
      // 搜索项信息
      searchData: {},
      // 弹框是否显示
      modalVisible: false,
      // 表单内容
      formData: {},
      // 上传的logo图片
      images: [],
      loading: false
    };
  }

  /**
   * 初始化列表
   */
  @Action('brandActor: init')
  init(state, res) {
    return state.update((state) => {
      return state
        .set('total', res.totalElements)
        .set('pageSize', res.size)
        .set('pageNum', res.number)
        .set('dataList', fromJS(res.content));
    });
  }

  /**
   * 修改表单内容
   */
  @Action('brandActor: editSearchData')
  editSearchData(state, data: IMap) {
    return state.set('searchData', data);
  }

  /**
   * 修改表单内容
   */
  @Action('brandActor: editFormData')
  editFormData(state, data: IMap) {
    return state.update('formData', (formData) => formData.merge(data));
  }

  /**
   * 显示弹窗
   */
  @Action('brandActor: showModal')
  show(state, needClear: boolean) {
    if (needClear) {
      state = state.set('formData', Map()).set('images', fromJS([]));
    }
    return state.set('modalVisible', true);
  }

  /**
   * 关闭弹窗
   */
  @Action('brandActor: closeModal')
  close(state) {
    return state
      .set('modalVisible', false)
      .set('formData', Map())
      .set('images', fromJS([]));
  }

  /**
   * 修改上传的图片内容
   */
  @Action('brandActor: editImages')
  editImages(state, images) {
    return state.set('images', images);
  }

  /**
   *  表格loading
   * @param state
   * @param loading
   */
  @Action('info:setLoading')
  setLoading(state,loading){
    return state.set('loading', loading);
  }
}
