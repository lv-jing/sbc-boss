import { Action, Actor } from 'plume2';
import { List } from 'immutable';

declare type IList = List<any>;

export default class CateActor extends Actor {
  defaultState() {
    return {
      cateList: []
    };
  }

  @Action('cateActor: init')
  init(state, cateList: IList) {
    return state.set('cateList', cateList);
  }
}
