import { Actor, Action, IMap } from 'plume2';

export default class RejectActor extends Actor {
  defaultState() {
    return {
      rejectModalVisible: false,
      rejectCustomerId: null
    };
  }

  @Action('reject:setRejectCustomerId')
  setRejectCustomerId(state: IMap, customerId) {
    return state.set('rejectCustomerId', customerId);
  }

  @Action('reject:setRejectModalVisible')
  setRejectModalVisible(state: IMap, visible) {
    return state.set('rejectModalVisible', visible);
  }
}
