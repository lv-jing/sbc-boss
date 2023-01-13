import { Actor, Action, IMap } from 'plume2';

export default class VisibleActor extends Actor {
  defaultState() {
    return {
      visible: false,
      onSubmit: true
    };
  }

  @Action('enterprise: modal:show')
  show(state: IMap) {
    return state.set('visible', true);
  }

  @Action('enterprise: modal:hide')
  hide(state: IMap) {
    return state.set('visible', false).set('onSubmit', true);
  }

  @Action('enterprise: modal:submit')
  submit(state: IMap, onSubmit) {
    return state.set('onSubmit', onSubmit);
  }
}
