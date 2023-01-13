import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class SelectedActor extends Actor {
  defaultState() {
    return {
      selected: []
    };
  }

  @Action('enterprise: select:init')
  init(state: IMap, list) {
    return state.set('selected', fromJS(list));
  }
}
