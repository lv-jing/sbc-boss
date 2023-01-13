import { Actor, IMap, Action } from 'plume2';
import { Map } from 'immutable';

export default class FormActor extends Actor {
  defaultState() {
    return {
      form: {
        tradeState: {}
      }
    };
  }

  @Action('form:field')
  formFieldChange(state: IMap, params) {
    return state.update('form', (form) => form.mergeDeep(params));
  }

  @Action('form:clear')
  formFieldClear(state: IMap) {
    return state.set('form', Map());
  }
}
