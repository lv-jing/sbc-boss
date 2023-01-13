/**
 * Created by feitingting on 2017/12/4.
 */
import { Actor, Action } from 'plume2';
import { fromJS } from 'immutable';

export default class AccountActor extends Actor {
  defaultState() {
    return {
      accountList: [],
      total: 0,
      pageSize: 10,
      pageNum: 0,
      searchInfo: {}
    };
  }

  /**
   * 收款账户列表
   * @param state
   * @param accountList
   */
  @Action('account:list')
  account(state, accountList: any) {
    let accountArray = new Array();
    accountList.map((v, i) => {
      v = v.set('index', state.get('pageNum') * state.get('pageSize') + i + 1);
      accountArray.push(v);
    });
    return state.set('accountList', fromJS(accountArray));
  }

  /**
   * 查询条件
   * @param state
   * @param field
   * @param value
   * @returns {any}
   */
  @Action('account:list:search')
  searchInfo(state, { field, value }) {
    return state.setIn(['searchInfo', field], value);
  }

  /**
   * 页码
   * @param state
   * @param value
   */
  @Action('account:pageNum')
  pageNum(state, value) {
    return state.set('pageNum', value);
  }

  /**
   * 总数
   * @param state
   * @param value
   */
  @Action('account:total')
  total(state, value) {
    return state.set('total', value);
  }
}
