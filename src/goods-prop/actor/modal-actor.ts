import { Actor, Action } from 'plume2';

export default class modalActor extends Actor {
  defaultState() {
    return {
      modalTitle: '',
      modalVisible: false
    };
  }

  @Action('modalActor: chooseTitle')
  chooseTitle(state, modalTitle: string) {
    return state.set('modalTitle', modalTitle);
  }

  @Action('modalActor: isVisible')
  isVisible(state, modalVisible: boolean) {
    return state.set('modalVisible', modalVisible);
  }
}
