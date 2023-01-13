/**
 * Created by feitingting on 2017/6/20.
 */
import { Action, Actor, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class ExpActor extends Actor {
  defaultState() {
    return {
      allExpressList: []
    };
  }
  constructor() {
    super();
  }
  /**
   * action建立actor的handle和store的dispatch之间的关联*/
  @Action('exp:init')
  init(state: IMap, exp) {
    return state.withMutations((state) => {
      state.set('allExpressList', fromJS(exp));
    });
  }

  @Action('exp:changeName')
  changeName(state: IMap, e) {
    return state.set('expressName', e.target.value);
  }
}
