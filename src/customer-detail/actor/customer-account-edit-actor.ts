import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class CustomerAccountEditActor extends Actor {
  defaultState() {
    return {
      selectedAccountId: '',
      //选中的收发票地址
      selectedInvoiceAddrId: '',
      //编辑当前的收货地址的索引，-1没有任何编辑
      editAccountIndex: -1,
      //银行账号
      accountList: []
    };
  }

  /**
   * 收发票地址选择
   * @param state
   * @param addId
   * @returns {Map<string, string|any[]|Buffer>}
   */
  @Action('addrs:invoice:select')
  invoiceSelect(state: IMap, addId) {
    let addrs = state.get('invoiceAddrs');
    const addr = addrs.find((add) => add.get('deliveryAddressId') === addId);
    addrs = addrs.filter((add) => add.get('deliveryAddressId') !== addId);
    return state
      .set('selectedInvoiceAddrId', addId)
      .set('invoiceAddrs', fromJS([addr]).concat(addrs));
  }

  @Action('account:edit')
  edit(state: IMap, index: number) {
    return state.set('editAccountIndex', index);
  }

  @Action('account:reset-edit-index')
  name(state: IMap) {
    return state.set('editAccountIndex', -1);
  }

  /**
   * 清除收货地址
   * @param state
   * @returns {Map<string, string>}
   */
  @Action('account:clear')
  clear(state: IMap) {
    return state.set('accountList', fromJS([])).set('selectedAccountId', '');
  }
}
