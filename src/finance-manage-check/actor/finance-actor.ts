/**
 * Created by feitingting on 2017/12/12.
 */

import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';
import moment from 'moment';
import { cache } from 'qmkit';

export default class FinanceActor extends Actor {
  defaultState() {
    return {
      storeId: JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA)).storeId,
      dateRange: {
        beginTime: moment(new Date())
          .format('YYYY-MM-DD')
          .toString(),
        endTime: moment(new Date())
          .format('YYYY-MM-DD')
          .toString()
      },
      //支付方式
      payWaysObj: {},
      //收入对账列表
      incomeList: [],
      //退款对账列表
      refundList: [],
      //收入对账汇总
      incomeTotal: [],
      //退款对账汇总
      refundTotal: [],
      tabKey: '1',
      //初始页码
      pageNum: 0,
      //总数
      total: 0,
      //每页显示
      pageSize: 15,
      //店铺信息
      storeMap: {},
      storeName: '',
      searchTime: {}
    };
  }

  /**
   * 支付方式类型
   * @param state
   * @param res
   */
  @Action('finance:payWays')
  payWays(state, res) {
    return state.set('payWaysObj', fromJS(res));
  }

  /**
   * 收入对账列表
   * @param state
   * @param res
   */
  @Action('finance:income')
  income(state, res) {
    return state.set('incomeList', fromJS(res));
  }

  /**
   * 改变日期范围
   * @param state
   * @param param
   */
  @Action('finance:dateRange')
  dateRange(state: IMap, param) {
    return state.setIn(['dateRange', param['key']], param['value']);
  }

  /**
   * 选项卡切换事件
   * @param state
   * @param key
   * @returns {Map<string, V>}
   */
  @Action('finance:tabkey')
  tabKey(state: IMap, key: string) {
    return state.set('tabKey', key);
  }

  /**
   * 退款对账列表
   * @param state
   * @param res
   * @returns {Map<string, V>}
   */
  @Action('finance:refund')
  refund(state: IMap, res) {
    return state.set('refundList', fromJS(res));
  }

  /**
   * 收入汇总
   * @param state
   * @param res
   * @returns {Map<string, V>}
   */
  @Action('finance:incomeTotal')
  incomeTotal(state: IMap, res) {
    return state.set('incomeTotal', fromJS(res));
  }

  /**
   * 退款汇总
   * @param state
   * @param res
   * @returns {Map<string, V>}
   */
  @Action('finance:refundTotal')
  refundTotal(state: IMap, res) {
    return state.set('refundTotal', fromJS(res));
  }

  /**
   * 页码
   * @param state
   * @param value
   */
  @Action('finance:pageNum')
  pageNum(state, value) {
    return state.set('pageNum', value);
  }

  @Action('finance:total')
  toTal(state, value) {
    return state.set('total', value);
  }

  /**
   *补全店铺名称
   */
  @Action('finance:storeMap')
  storeMap(state: IMap, storeMap) {
    return state.set('storeMap', fromJS(storeMap));
  }

  /**
   * 被查询的店铺名称
   * @param state
   * @param {string} name
   */
  @Action('finance:storeName')
  storeName(state, name: string) {
    return state.set('storeName', name);
  }

  @Action('finance:searchTime')
  searchTime(state: IMap, searchTime: IMap) {
    return state.set('searchTime', searchTime);
  }
}
