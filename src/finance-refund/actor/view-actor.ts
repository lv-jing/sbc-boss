import { Actor, Action, IMap } from 'plume2';

export default class ViewActor extends Actor {
  defaultState() {
    return {
      refundView: {}
    };
  }

  @Action('refund:refundView')
  invoiceView(state: IMap, refundView) {
    return state.set('refundView', refundView);
  }
}
