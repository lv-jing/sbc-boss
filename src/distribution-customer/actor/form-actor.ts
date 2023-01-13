import { Actor, Action, IMap } from 'plume2';
import { Map, fromJS, List } from 'immutable';

export default class FormActor extends Actor {
  defaultState() {
    return {
      form: {
        // 搜索项类型 0: 分销员账号 1: 分销员名称
        optType: '0',
        //分销员名称
        customerName: '',
        //分销员名称
        customerAccount: '',
        //分销员等级ID
        distributorLevelId: '',
        // 加入时间 起始
        createTimeBegin: null,
        // 加入时间 结束
        createTimeEnd: null,
        //账号状态 0：启用中  1：禁用中
        forbiddenFlag: null,
        //邀新人数-从
        inviteCountStart: '',
        //邀新人数-至
        inviteCountEnd: '',
        //有效邀新人数-从
        inviteAvailableCountStart: '',
        //有效邀新人数-至
        inviteAvailableCountEnd: '',
        //邀新奖金(元)-从
        rewardCashStart: '',
        //邀新奖金(元)-至
        rewardCashEnd: '',
        //分销订单(笔)-从
        distributionTradeCountStart: '',
        //分销订单(笔)-至
        distributionTradeCountEnd: '',
        //销售额(元)-从
        salesStart: '',
        //销售额(元)-至
        salesEnd: '',
        //分销佣金(元)-从
        commissionStart: '',
        //分销佣金(元)-至
        commissionEnd: '',
        //排序字段
        sortColumn: 'createTime',
        //排序规则 desc asc
        sortRole: 'desc'
      },
      //列表页字段排序规则
      sortedInfo: Map({ order: 'descend', columnKey: 'createTime' }),
      distributorLevelIds: List()
    };
  }

  //排序
  @Action('form:checkState')
  checkState(state: IMap, index: string) {
    return state.setIn(['form', 'checkState'], index);
  }

  @Action('form:field')
  changeField(state: IMap, { field, value }) {
    return state.setIn(['form', field], value);
  }

  /**
   * 更改搜索项-二选一
   * @param state
   * @param val
   */
  @Action('form: changeOption')
  changeOption(state: IMap, val) {
    return state
      .setIn(['form', 'optType'], val)
      .setIn(['form', 'customerName'], '')
      .setIn(['form', 'customerAccount'], '');
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

  /**
   * 设置分销员等级列表
   * @param {IMap} state
   * @param data
   * @returns {Map<string, V>}
   */
  @Action('set:distributor:level:list')
  setDistributorLevelList(state: IMap, data) {
    return state.set('distributorLevelIds', fromJS(data));
  }
}
