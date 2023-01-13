import { Actor, Action, IMap } from 'plume2';
import { List } from 'immutable';

declare type IList = List<any>;

export default class PropActor extends Actor {
  defaultState() {
    return {
      propList: []
    };
  }

  @Action('propActor: init')
  init(state: IMap, propList: IList) {
    return state.set('propList', propList);
  }
}
