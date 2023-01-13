import { Actor, Action } from 'plume2';

export default class FormActor extends Actor {
  defaultState() {
    return {
      skuForm: {},
      addedFlagForm: {}
    };
  }

  @Action('formActor:sku')
  updateSkuForm(state, skuForm) {
    return state.set('skuForm', skuForm);
  }

  @Action('formActor:addedFlag')
  updateAddedFlagForm(state, addedFlagForm) {
    return state.set('addedFlagForm', addedFlagForm);
  }
}
