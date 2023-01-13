import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class FormActor extends Actor {
  defaultState() {
    return {
      //检测更新配置信息
      appUpgrade: {
        //APP强制更新开关 0 关，不强制更新 1 开，强制更新
        forceUpdateFlag: 0,
        //最新版本号
        latestVersion: '',
        //Android下载地址
        androidAddress: '',
        //App下载地址
        appAddress: '',
        //更新描述
        upgradeDesc: ''
      }
    };
  }

  /**
   * 初始化
   * @param state
   * @param info
   * @returns {Map<K, V>}
   */
  @Action('init')
  init(state: IMap, info) {
    return state.set('appUpgrade', fromJS(info));
  }

  /**
   * 编辑
   * @param state
   * @param {any} field 修改的字段
   * @param {any} value 修改的值
   * @returns {any}
   */
  @Action('app: upgrade: edit')
  editInfo(state, { field, value }) {
    return state.setIn(['appUpgrade', field], value);
  }
}
