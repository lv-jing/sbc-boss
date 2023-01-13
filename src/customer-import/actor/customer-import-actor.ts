import { Action, Actor, IMap } from 'plume2';

export default class CustomerImportActor extends Actor {
  defaultState() {
    return {
      currentStep: 0
    };
  }

  @Action('step:change')
  setCurrsntStep(state: IMap, step) {
    return state.set('currentStep', step);
  }
}
