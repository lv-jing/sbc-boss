import { Actor, Action } from 'plume2';
import { List, Map, fromJS } from 'immutable';
import { IMap } from 'typings/globalType';

export default class FundsActor extends Actor {
  defaultState() {
    return {
      //余额总额
      accountBalanceTotal: 0.0,
      //冻结余额总额
      blockedBalanceTotal: 0.0,
      //可提现余额总额
      withdrawAmountTotal: 0.0,
      //当前的数据总数
      total: 0,
      //当前的分页条数
      pageSize: 10,
      // 后端返回的页码
      pageNum: 0,
      dataList: List(),
      // 表单内容
      form: {
        // 搜索项类型 0: 会员账号 1: 会员名称
        optType: '0',
        // 会员账号
        customerAccount: '',
        // 会员名称
        customerName: '',
        //是否分销员，0：否，1：是
        distributor: '-1',
        //账户余额开始
        startAccountBalance: '',
        //账户余额结束
        endAccountBalance: '',
        //冻结余额开始
        startBlockedBalance: '',
        //冻结余额结束
        endBlockedBalance: '',
        //可提现余额开始
        startWithdrawAmount: '',
        //可提现余额结束
        endWithdrawAmount: '',
        //排序字段
        sortColumn: 'createTime',
        //排序规则 desc asc
        sortRole: 'desc'
      },
      //列表页字段排序规则
      sortedInfo: Map({ order: 'descend', columnKey: 'createTime' })
    };
  }

  /**
   * 设置会员资金统计（余额总额、冻结余额总额、可提现余额总额）
   * @param state
   * @param res
   */
  @Action('funds: statistics')
  statistics(state, res) {
    return state.update((state) => {
      return state
        .set('accountBalanceTotal', res.accountBalanceTotal)
        .set('blockedBalanceTotal', res.blockedBalanceTotal)
        .set('withdrawAmountTotal', res.withdrawAmountTotal);
    });
  }

  /**
   * 初始化会员资金列表
   */
  @Action('funds: init')
  init(state, res) {
    return state.update((state) => {
      return state
        .set('total', res.totalElements)
        .set('pageSize', res.size)
        .set('pageNum', res.number)
        .set('dataList', fromJS(res.content));
    });
  }

  /**
   * 设置列表form请求参数
   * @param state
   * @param param1
   */
  @Action('funds: form: field')
  setFormField(state: IMap, { field, value }) {
    return state.setIn(['form', field], value);
  }

  /**
   * 更改搜索项(会员账号、会员名称)
   * @param state
   * @param val
   */
  @Action('funds: form: changeCustomerAccountOrNameOption')
  changeCustomerAccountOrNameOption(state: IMap, val) {
    return state
      .setIn(['form', 'optType'], val)
      .setIn(['form', 'customerAccount'], '')
      .setIn(['form', 'customerName'], '');
  }

  /**
   * 设置排序规则
   * @param {IMap} state
   * @param data
   * @returns {Map<string, V>}
   */
  @Action('funds:setSortedInfo')
  setSortedInfo(state: IMap, data) {
    let sortedInfo = data;
    if (!sortedInfo.columnKey) {
      sortedInfo = { columnKey: 'createTime', order: 'descend' };
    }
    return state.set('sortedInfo', fromJS(sortedInfo));
  }
}
