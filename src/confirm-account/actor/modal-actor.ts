import { Actor, Action } from 'plume2';

export default class ModalActor extends Actor {
  defaultState() {
    return {
      //弹框是否显示
      visible: false,
      modalContent: {}
    };
  }

  /**
   * 打款弹框
   */
  @Action('modalActor: FightmoneyModal')
  click(state) {
    return state.set('visible', !state.get('visible'));
  }

  /**
   * 填充弹框内容
   * @param state
   * @param content
   */
  @Action('modalActor:content')
  content(state, content) {
    return state.set('modalContent', content);
  }

  /**
   * 打款金额
   * @param state
   * @param value
   * @returns {any}
   */
  @Action('modal:remitPrice')
  remitPrice(state, value) {
    return state.setIn(['modalContent', 'remitPrice'], value);
  }
}
