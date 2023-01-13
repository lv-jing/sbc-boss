import { Action, Actor, IMap } from 'plume2';

export default class customerInfoActor extends Actor {
  defaultState() {
    return {
      customerInfo: {
        pointsUsed: 0,
        pointsAvailable: 0,
        customerName: '',
        customerAccount: ''
      }
    };
  }

  @Action('pointsDetail:userInfo')
  pointDetailCustomerInfo(state: IMap, customerInfo: IMap) {
    return state.set('customerInfo', customerInfo);
  }
}
