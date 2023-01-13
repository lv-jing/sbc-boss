import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class CustomerAddressListActor extends Actor {
  defaultState() {
    return {
      addressList: [],
      addressFormVisible: false
    };
  }

  @Action('customerAddressListActor: init')
  init(state: IMap, res) {
    return state.set('addressList', fromJS(res));
  }

  @Action('switchAddressFormVisible')
  switchAddressFormVisible(state: IMap, result) {
    return state.set('addressFormVisible', result);
  }
}
