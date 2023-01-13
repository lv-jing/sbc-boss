import { Actor, Action } from 'plume2';
import { List } from 'immutable';

declare type IList = List<any>;

export default class StoreActor extends Actor {
  defaultState() {
    return {
      storeList: List()
    };
  }

  @Action('storeActor: init')
  init(state, storeList: IList) {
    return state.set('storeList', storeList);
  }
}
