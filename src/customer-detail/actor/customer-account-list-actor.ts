import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class CustomerAccountListActor extends Actor {
  defaultState() {
    return {
      accountList: [],
      accountFormVisible: false,
      showAdd: false
    };
  }

  @Action('customerAccountListActor: init')
  init(state: IMap, res) {
    if (fromJS(res).count() >= 5) {
      state = state.set('showAdd', true);
    } else {
      state = state.set('showAdd', false);
    }
    return state.set('accountList', fromJS(res));
  }

  @Action('switchAccountFormVisible')
  switchAccountFormVisible(state: IMap, result) {
    return state.set('accountFormVisible', result);
  }
}
