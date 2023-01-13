import { Actor, Action, IMap } from 'plume2';

export default class ViewActor extends Actor {
  defaultState() {
    return {
      receiveView: {}
    };
  }

  @Action('receive:receiveView')
  invoiceView(state: IMap, receiveView) {
    return state.set('receiveView', receiveView);
  }
}
