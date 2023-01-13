import { Actor, Action, IMap } from 'plume2';

export default class ModalActor extends Actor {
  defaultState() {
    return {
      // 弹框是否显示
      modalVisible: false,
      // 弹框类型 0: 禁用弹框 1: 关店弹框
      modalType: 0,
      // 原因
      reason: '',
      // 公司Id/店铺Id
      id: -1
    };
  }

  /**
   * 显示/关闭 弹窗
   */
  @Action('modal: switch')
  switch(state: IMap, { modalType, id }) {
    const flag = !state.get('modalVisible');
    return state
      .set('modalVisible', flag)
      .set('modalType', modalType)
      .set('reason', '')
      .set('id', flag ? id : -1);
  }

  /**
   * 输入原因
   */
  @Action('modal: reason')
  enterReason(state: IMap, reason) {
    return state.set('reason', reason);
  }
}
