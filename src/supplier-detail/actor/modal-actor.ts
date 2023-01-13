import { Action, Actor } from 'plume2';

export default class ModalActor extends Actor {
  defaultState() {
    return {
      // 商家审核弹框
      supplierVisible: false,
      //驳回弹框
      dismissedVisible: false,
      //提示弹框
      tipsVisible: false
    };
  }

  /**
   * 商家审核弹框
   */
  @Action('modalActor: supplierModal')
  clickCheck(state) {
    return state.set('supplierVisible', !state.get('supplierVisible'));
  }

  /**
   * 驳回弹框
   */
  @Action('modalActor: dismissedModal')
  click(state) {
    return state.set('dismissedVisible', !state.get('dismissedVisible'));
  }

  /**
   * 提示框
   * @param state
   */
  @Action('modalActor:tipsModal')
  tipsModal(state) {
    return state.set('tipsVisible', !state.get('tipsVisible'));
  }
}
