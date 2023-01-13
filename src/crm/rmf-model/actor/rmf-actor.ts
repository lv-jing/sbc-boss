import { Actor, Action, IMap } from 'plume2';

export default class RmfActor extends Actor {
  defaultState() {
    return {
      rfmModal: [],
      rfmBar: { x: [], y: [] }
    };
  }

  @Action('rfm: rfmModal')
  setRmfModal(state: IMap, rfmModal) {
    return state.set('rfmModal', rfmModal);
  }

  @Action('rfm: rfmBar')
  setRfmBar(state, rfmBar) {
    return state.set('rfmBar', rfmBar);
  }
}
