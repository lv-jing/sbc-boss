import { Actor, Action } from 'plume2';

export default class FormActor extends Actor {
  defaultState() {
    return {
      goodsForm: {},
      // 运费模板表单
      freightForm: {},
      skuForm: {},
      specForm: {},
      levelPriceForm: {},
      userPriceForm: {},
      areaPriceForm: {}
    };
  }

  @Action('formActor:goods')
  updateGoodsForm(state, goodsForm) {
    return state.set('goodsForm', goodsForm);
  }

  /**
   * 更新运费模板表单
   */
  @Action('formActor:freight')
  updateFreightForm(state, freightForm) {
    return state.set('freightForm', freightForm);
  }

  @Action('formActor:sku')
  updateSkuForm(state, skuForm) {
    return state.set('skuForm', skuForm);
  }

  @Action('formActor:spec')
  updateSpecForm(state, specForm) {
    return state.set('specForm', specForm);
  }

  @Action('formActor:levelprice')
  updateLevelPriceForm(state, levelPriceForm) {
    return state.set('levelPriceForm', levelPriceForm);
  }

  @Action('formActor:userprice')
  updateUserPriceForm(state, userPriceForm) {
    return state.set('userPriceForm', userPriceForm);
  }

  @Action('formActor:areaprice')
  updateAreaPriceForm(state, areaPriceForm) {
    return state.set('areaPriceForm', areaPriceForm);
  }
}
