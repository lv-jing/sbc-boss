/**
 * Created by feitingting on 2017/12/6.
 */

import { Actor, Action } from 'plume2';
import { fromJS } from 'immutable';

export default class ConfirmActor extends Actor {
  defaultState() {
    return {
      //店铺账户明细
      accountDetail: [],
      //店铺基本信息
      storeInfo: {},
      //入驻时间
      applyEnterTime: '',
      //确认账号还是查询明细
      kind: ''
    };
  }

  /**
   * 店铺账户明细
   * @param state
   * @param accountDetail
   */
  @Action('confirm:detail')
  detail(state, accountDetail) {
    let accountArray = new Array();
    accountDetail.toJS().map((v) => {
      accountArray.push(v);
    });
    //数组排序
    accountArray.sort((a, b) => {
      return b.isDefaultAccount - a.isDefaultAccount;
    });
    return state.set('accountDetail', fromJS(accountArray));
  }

  /**
   * 店铺基本信息
   * @param state
   * @param info
   */
  @Action('confirm:store')
  storeInfo(state, info) {
    return state.set('storeInfo', info);
  }

  /**
   * 入驻时间
   * @param state
   * @param time
   */
  @Action('confirm:applyEnterTime')
  applyEnterTime(state, time) {
    return state.set('applyEnterTime', time);
  }

  /**
   * 文字
   * @param state
   * @param time
   */
  @Action('confirm:kind')
  setKind(state, kind) {
    return state.set('kind', kind);
  }
}
