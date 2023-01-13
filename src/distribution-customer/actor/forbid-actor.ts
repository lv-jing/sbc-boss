import { Actor, Action, IMap } from 'plume2';

export default class ForbidActor extends Actor {
  defaultState() {
    return {
      forbidModalVisible: false,
      forbidCustomerId: null
    };
  }

  @Action('forbid:setForbidCustomerId')
  setForbidCustomerId(state: IMap, customerId) {
    return state.set('forbidCustomerId', customerId);
  }

  @Action('forbid:setForbidModalVisible')
  setForbidModalVisible(state: IMap, visible) {
    return state.set('forbidModalVisible', visible);
  }
}
