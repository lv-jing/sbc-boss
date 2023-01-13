import { Actor, Action, IMap } from 'plume2';
import actionType from '../action-type';

export default class LoginInterfaceActor extends Actor {
  defaultState() {
    return {
      formVisible: false, // 微信弹出框可见性

      // 微信登录设置，结构:
      // {
      //   mobileServerStatus: 0, // 0 不启用，1 启用
      //   mobileAppId: '',
      //   mobileAppSecret: '',
      //   pcServerStatus: 0, // 0 不启用，1 启用
      //   pcAppId: '',
      //   pcAppSecret: '',
      //   appServerStatus: 0, // 0 不启用，1 启用
      // }
      wxloginSet: {}
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
    return state.set('wxloginSet', set);
  }

  /**
   * 改变表单字段值
   */
  @Action(actionType.CHANGE_WX_FORM_VALUE)
  changeWxFormValue(state: IMap, { key, value }) {
    return state.setIn(['wxloginSet', key], value);
  }
}
