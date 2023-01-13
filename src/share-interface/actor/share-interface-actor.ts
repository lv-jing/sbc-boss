import { Actor, Action, IMap } from 'plume2';

export default class ShareInterfaceActor extends Actor {
  defaultState() {
    return {
      wxFormVisible: false, // 微信弹出框可见性

      // 微信登录设置，结构:
      // {
      //   mobileServerStatus: '', // 0 不启用，1 启用
      //   mobileAppId: '',
      //   mobileAppSecret: '',
      //   pcServerStatus: '', // 0 不启用，1 启用
      //   pcAppId: '',
      //   pcAppSecret: '',
      //   appServerStatus: '', // 0 不启用，1 启用
      // }
      wxShareSet: {
        shareAppId: '',
        shareAppSecret: ''
      }
    };
  }

  /**
   * 设置弹出框可见性
   */
  @Action('changeWxFormVisible')
  changeWxFormVisible(state: IMap) {
    return state.set('wxFormVisible', !state.get('wxFormVisible'));
  }

  /**
   * 初始化
   */
  @Action('wxFromInit')
  wxFormInit(state: IMap, set) {
    return state.set('wxShareSet', set);
  }

  /**
   * 改变表单字段值
   */
  @Action('changeWxFrom')
  changeWxFrom(state: IMap, { key, value }) {
    return state.setIn(['wxShareSet', key], value);
  }
}
