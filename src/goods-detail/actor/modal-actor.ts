import { Action, Actor } from 'plume2';

export default class ModalActor extends Actor {
  defaultState() {
    return {
      modalRejectVisible: false,
      modalForbidVisible: false
    };
  }

  @Action('modal: reject-visible')
  modalRejectVisible(state, modalRejectVisible) {
    return state.set('modalRejectVisible', modalRejectVisible);
  }

  @Action('modal: forbid-visible')
  modalForbidVisible(state, modalForbidVisible) {
    return state.set('modalForbidVisible', modalForbidVisible);
  }
}
