import { Actor, Action, IMap } from 'plume2';

export default class EditActor extends Actor {
  defaultState() {
    return {
      edit: false,
      customerLevel: {}
    };
  }

  @Action('edit')
  edit(state: IMap, status: boolean) {
    return state.set('edit', status);
  }

  @Action('edit:init')
  init(state: IMap, res) {
    return state.set('customerLevel', res);
  }
}
