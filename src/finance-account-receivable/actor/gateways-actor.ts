import { Actor, Action, IMap } from 'plume2';

export default class GateWaysActor extends Actor {
  defaultState() {
    return {
      gateways: [],
      channelJson: {},
      channel_visible: false,
      wx_pay_visible: false
    };
  }

  constructor() {
    super();
  }

  @Action('gateWays:init')
  init(state: IMap, content) {
    return state.set('gateways', content);
  }

  @Action('gateWays:formValue')
  formValue(state: IMap, valueJson) {
    return state.setIn(valueJson['key'], valueJson['value']);
  }

  @Action('modal:channel_show')
  show(state: IMap, channelJson) {
    return state.set('channel_visible', true).set('channelJson', channelJson);
  }

  @Action('modal:channel_hide')
  hide(state: IMap) {
    return state.set('channel_visible', false);
  }

  @Action('modal:union_b2b_show')
  b2b_show(state: IMap, channelJson) {
    return state.set('b2b_visible', true).set('channelJson', channelJson);
  }

  @Action('modal:union_b2b_hide')
  b2b_hide(state: IMap) {
    return state.set('b2b_visible', false);
  }

  @Action('modal:wx_pay_show')
  wx_pay_show(state: IMap, channelJson) {
    return state.set('wx_pay_visible', true).set('channelJson', channelJson);
  }

  @Action('modal:wx_pay_hide')
  wx_pay_hide(state: IMap) {
    return state.set('wx_pay_visible', false);
  }

  @Action('modal:alipay_show')
  alipay_show(state: IMap, channelJson) {
    return state.set('alipay_visible', true).set('channelJson', channelJson);
  }

  @Action('modal:alipay_hide')
  alipay_hide(state: IMap) {
    return state.set('alipay_visible', false);
  }

  @Action('modal:balance_show')
  balance_show(state: IMap, channelJson) {
    return state.set('balance_visible', true).set('channelJson', channelJson);
  }

  @Action('modal:balance_hide')
  balance_hide(state: IMap) {
    return state.set('balance_visible', false);
  }
}
