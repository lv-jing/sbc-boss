import { Actor, Action, IMap } from 'plume2';

export default class FormActor extends Actor {
  defaultState() {
    return {
      regEditor: {},
      settings: {
        pcWebsite: '', // PC端商城网址
        mobileWebsite: '', // 移动端商城网址
        supplierWebsite: '', //商家后台登录网址
        pcTitle: '', // PC商城title
        pcLogo: '', // PC商城logo
        pcBanner: '', // PC商城登录页banner
        pcIco: '',
        registerContent: ''
      }
    };
  }

  /**
   * 将editor ref对象存储到actor中
   */
  @Action('setting: regEditor')
  setRegEditor(state: IMap, regEditor) {
    return state.set('regEditor', regEditor);
  }

  @Action('setting:init')
  init(state: IMap, setting) {
    return state.mergeIn(['settings'], setting);
  }

  @Action('setting:editSetting')
  editSetting(state, data: IMap) {
    return state.update('settings', (settings) => settings.merge(data));
  }
  /**
   * 保存新增的基本信息
   * @param state
   * @param data
   */
  @Action('setting:saveSetting')
  saveSetting(state, data: IMap) {
    return state.set('settings', data);
  }
}
