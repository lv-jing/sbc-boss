import { Actor, Action, IMap } from 'plume2';
import { List, Map } from 'immutable';

/**
 * 收款记录actor
 */
export default class ReceiveRecordActor extends Actor {
  defaultState() {
    return {
      payRecord: [],
      addReceiverVisible: false,
      paymentInfo: {}
    };
  }

  @Action('receive-record-actor:init')
  init(state: IMap, res: Object) {
    return state.set('payRecord', List(res));
  }

  @Action('receive-record-actor:initPaymentInfo')
  initPaymentInfo(state: IMap, res: Object) {
    return state.set('paymentInfo', Map(res));
  }

  @Action('receive-record-actor:setReceiveVisible')
  setAddReceiverVisible(state: IMap) {
    return state.set('addReceiverVisible', !state.get('addReceiverVisible'));
  }
}
