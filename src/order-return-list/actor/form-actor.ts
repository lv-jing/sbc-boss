import { Action, Actor, IMap } from 'plume2';

export default class FormActor extends Actor {
  defaultState() {
    return {
      form: {
        returnFlowState: ''
      }
    };
  }

  @Action('order-return-list:form:field')
  formFieldChange(state: IMap, params) {
    return state.update('form', (form) => form.mergeDeep(params));
  }
}
