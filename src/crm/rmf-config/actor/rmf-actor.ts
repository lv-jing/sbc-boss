import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class RmfActor extends Actor {
  defaultState() {
    return {
      r: [],
      f: [],
      m: [],
      period: 0
    };
  }

  /**
   * 初始参数
   */
  @Action('rmf-init')
  init(state: IMap, params) {
    return state.merge(fromJS(params));
  }

  /**
   * 改变表单值
   */
  @Action('change:form:value')
  changeFormValue(state: IMap, { keys, val }) {
    return state.setIn(keys, val);
  }

  /**
   * 改变范围
   */
  @Action('change:period')
  changePeriod(state: IMap, val) {
    return state.set('period', val);
  }

  /**
   * 删除一条记录
   */
  @Action('del:item')
  delItem(state: IMap, path) {
    return state.deleteIn(path);
  }

  /**
   * 添加一条记录
   */
  @Action('add:item')
  addItem(state: IMap, key) {
    return state.update(key, (items) => items.push(fromJS({})));
  }
}
