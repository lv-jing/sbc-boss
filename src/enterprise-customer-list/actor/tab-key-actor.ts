import { Actor, Action, IMap } from 'plume2';

export default class TabKeyActor extends Actor {
  defaultState() {
    return {
      key: 1 // 选中的tab页
    };
  }

  /**
   * 设置选中的tab
   * @param state
   * @param key
   */
  @Action('enterprise: tab: key')
  show(state: IMap, key) {
    return state.set('key', key);
  }
}
