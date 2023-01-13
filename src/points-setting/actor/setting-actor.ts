import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class SettingActor extends Actor {
  defaultState() {
    return {
      pointsConfig: {
        status: 0,
        overPointsAvailable: '',
        maxDeductionRate: '',
        pointsExpireMonth: '',
        pointsExpireDay: '',
        remark: '',
        pointsConfigId: ''
      },
      remarkEditor:{}
    };
  }

  /**
   * 初始化
   * @param state
   * @param info
   * @returns {Map<K, V>}
   */
  @Action('setting: init')
  init(state: IMap, info) {
    return state.set('pointsConfig', fromJS(info));
  }

  /**
   * 编辑
   * @param state
   * @param {any} field 修改的字段
   * @param {any} value 修改的值
   * @returns {any}
   */
  @Action('setting: edit')
  edit(state, { field, value }) {
    return state.setIn(['pointsConfig', field], value);
  }

  @Action('setting: remarkEditor')
  introEditor(state, remarkEditor) {
    return state.set('remarkEditor', remarkEditor);
  }
}
