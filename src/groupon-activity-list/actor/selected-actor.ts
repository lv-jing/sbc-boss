import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class SelectedActor extends Actor {
  defaultState() {
    return {
      selected: [],
      // 驳回 或 禁止分销理由弹出框是否显示
      modalVisible: false,
      // 驳回 或 禁止分销商品标识
      grouponActivityId: '',
      // 驳回原因
      forbidReason: ''
    };
  }

  @Action('select:init')
  init(state: IMap, list) {
    return state.set('selected', fromJS(list));
  }

  /**
   * 数值变化
   * @param state
   * @param param1
   */
  @Action('groupon: field: change')
  onFieldChange(state: IMap, { field, value }) {
    return state.set(field, value);
  }

  /**
   * 显示/关闭弹窗
   */
  @Action('groupon: switchShowModal')
  switchShow(state, flag: boolean) {
    if (flag) {
      return state.set('modalVisible', flag);
    } else {
      return state
        .set('modalVisible', flag)
        .set('grouponActivityId', '')
        .set('forbidReason', '');
    }
  }
}
