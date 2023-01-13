import { Action, Actor, IMap } from 'plume2';
/**
 * Created by chenpeng on 2017/10/13.
 */

export default class ShowTodoActor extends Actor {
  defaultState() {
    return {
      todoVisible: true, //是否显示待处理事项
      f_supplier_list_1: false, //待审核商家
      f_goods_check_1: false, //待审核商品
      fOrderList001: false, //待付款订单
      rolf001: false, //待退款退单
      f_customer_3: false, //待审核客户
      changeInvoice: false, //待审核增票资质
      f_finance_manage_settle: false //待结算账单
    };
  }

  /**
   * 待处理事项merge操作
   */
  @Action('show-todo-actor:mergeShowTodo')
  mergeShowTodo(state: IMap, res: IMap) {
    return state.merge(res);
  }
}
