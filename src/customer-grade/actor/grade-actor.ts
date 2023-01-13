import {Action, Actor, IMap} from 'plume2';
import {IList} from 'typings/globalType';
import {fromJS, Map} from 'immutable';

export default class GradeActor extends Actor {
  defaultState() {
    return {
      gradeList: [],// 分类集合
      modalVisible: false,// 弹框是否显示
      isAdd: true,//显示编辑还是添加
      formData: {
        customerLevelDiscount:"1"
      }, // 表单内容
      images: [],//图片
      lastData:"",//最后一个
      equities:[],
      firstData:"" ,//第一个值
      rightsType:[] //当前类型集合

    };
  }

  /**
   * 初始化
   */
  @Action('grade: init')
  init(state: IMap, gradeList: IList) {
    return state.set('gradeList', gradeList)
  }


  /**
   * 权益
   */
  @Action('grade: equities')
  equities(state: IMap, equities: IList) {
    return state.set('equities', equities)
  }



  /**
   * 找到最后一个的值
   */
  @Action('grade: lastData')
  lastData(state: IMap, lastData) {
    return state.set('lastData', lastData)
  }

  /**
   * 找到第一个值
   */
  @Action('grade: firstData')
  firstData(state: IMap, firstData) {
    return state.set('firstData', firstData)
  }



   /**
   * 显示弹窗
   */
  @Action('grade: modal')
  show(state: IMap, isAdd) {
    const visible = !state.get('modalVisible');
     if (!visible) {
       state = state
         .set(
           'formData',
           Map({customerLevelDiscount:"1"})
         ).set('images', fromJS([]))
     }
    state = state.set('isAdd', isAdd);
    return state.set('modalVisible', visible);
  }

  /**
   * 修改表单内容
   */
  @Action('grade: editFormData')
  editCateInfo(state: IMap, data: IMap) {
    return state.update('formData', (formData) => formData.merge(data));
  }


  @Action('grade: editImages')
  editImages(state, images) {
    return state.set('images', images);
  }



  @Action('grade: rightsType')
  rightsType(state, rightsType) {
    return state.set('rightsType', rightsType);
  }





}
