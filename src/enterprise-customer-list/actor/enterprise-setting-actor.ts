import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class EnterpriseSettingActor extends Actor {
  defaultState() {
    return {
      setting: {}
    };
  }

  /**
   * 设置企业购设置信息
   * @param state
   * @param key
   */
  @Action('enterprise: setting: info')
  detail(state: IMap, setting) {
    return state.set('setting', fromJS(setting));
  }

  /**
   * 设置企业购设置信息
   * @param state
   * @param key
   */
  @Action('enterprise: setting: info: modify')
  modify(state: IMap, { field, value }) {
    return state.setIn(['setting', field], value);
  }
}
