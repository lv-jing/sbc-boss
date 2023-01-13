import { Actor, Action, IMap } from 'plume2';

export default class ModalActor extends Actor {
  defaultState() {
    return {
      // 弹框是否显示
      modalVisible: false,
      //审核不通过增票id
      invoiceId: '',
      // 原因
      reason: ''
    };
  }

  /**
   * 显示/关闭 弹窗
   */
  @Action('modal: switch')
  switch(state: IMap, invoiceId) {
    const flag = !state.get('modalVisible');
    return state.withMutations((state) => {
      state
        .set('modalVisible', flag)
        .set('invoiceId', invoiceId)
        .set('reason', '');
    });
  }

  /**
   * 输入原因
   */
  @Action('modal: reason')
  enterReason(state: IMap, reason) {
    return state.set('reason', reason);
  }
}
