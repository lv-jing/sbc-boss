import { Actor, Action, IMap } from 'plume2';
import actionType from '../action-type';

export default class MiniInterfaceActor extends Actor {
  defaultState() {
    return {
      formVisible: false, // 微信弹出框可见性
      miniProgramSet: {},
      status:0
    };
  }

  /**
   * 设置弹出框可见性
   */
  @Action(actionType.CHANGE_WX_FORM_SHOW)
  changeWxFormShow(state: IMap) {
    return state.set('formVisible', !state.get('formVisible'));
  }

  /**
   * 初始化
   */
  @Action(actionType.WX_FORM_INIT)
  wxFormInit(state: IMap, set) {
    return state.set('miniProgramSet', set);
  }

  @Action("weixinform:initstate")
  initstate(state:IMap,status){
    return state.set('status',status)
  }


  /**
   * 改变表单字段值
   */
  @Action(actionType.CHANGE_WX_FORM_VALUE)
  changeWxFormValue(state: IMap, { key, value }) {
    return state.setIn(['wxloginSet', key], value);
  }
}
