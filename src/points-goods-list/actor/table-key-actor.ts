import { Actor, Action, IMap } from 'plume2';

export default class VisibleActor extends Actor {
  defaultState() {
    return {
      key: '0',
    };
  }

  @Action('change:key')
  changeKey(state: IMap,key) {
    return state.set('key', key);
  }
}
