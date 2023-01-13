import { Actor, Action, IMap } from 'plume2';

export default class EmployeeActor extends Actor {
  defaultState() {
    return {
      employee: []
    };
  }

  @Action('enterprise: employee:init')
  init(state: IMap, res) {
    return state.set('employee', res);
  }
}
