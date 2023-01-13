import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class CustomerAddressEditActor extends Actor {
  defaultState() {
    return {
      selectedAddrId: '',
      // addressList: [],
      addressInfo: {},
      isEdit: false
    };
  }

  /**
   * 清除收货地址
   * @param state
   * @returns {Map<string, string>}
   */
  @Action('addrs:clear')
  clear(state: IMap) {
    return state.set('addressList', fromJS([])).set('selectedAddrId', '');
  }

  @Action('addressInfo')
  addressInfo(state: IMap, addressInfo) {
    return state.set('addressInfo', fromJS(addressInfo)).set('isEdit', true);
  }

  /**
   * 清除收货地址信息
   * @param state
   * @returns {Map<string, string>}
   */
  @Action('addrs:clearInfo')
  clearInfo(state: IMap) {
    return state.set('addressInfo', fromJS({})).set('isEdit', false);
  }
}
