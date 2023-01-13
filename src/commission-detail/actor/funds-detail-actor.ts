import { Actor, Action } from 'plume2';
import { List, fromJS } from 'immutable';
import { IMap } from 'typings/globalType';

export default class FundsActor extends Actor {
  defaultState() {
    return {
      //当前的数据总数
      total: 0,
      //当前的分页条数
      pageSize: 10,
      // 后端返回的页码
      pageNum: 0,
      dataList: List(),
      //头部概览
      generalCommissionDetail: fromJS({
        //佣金总额
        commissionTotal: 0,
        //分销佣金总额
        commission: 0,
        //邀新奖金总额
        rewardCash: 0,
        //未入账分销佣金总额
        commissionNotRecorded: 0,
        //未入账邀新奖金总额
        rewardCashNotRecorded: 0,
        //分销员名称
        customerName: ''
      }),
      // 表单内容
      form: {
        //会员资金ID
        customerId: '',
        // Tab类型 0: 全部, 1: 收入, 2: 支出,3:分销佣金和邀新奖励
        tabType: '3',
        // 资金类型  0:全部 ； 1：分销佣金 ;3：邀新奖励
        fundsType: '0',
        // 业务编号
        businessId: '',
        //入账开始时间
        startTime: '',
        //入账结束时间
        endTime: '',
        //排序字段
        sortColumn: 'createTime',
        //排序规则 desc asc
        sortRole: 'desc'
      }
    };
  }

  /**
   * 初始化佣金明细列表
   */
  @Action('commission:detail:init')
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
  @Action('commission:detail:form:field')
  setFormField(state: IMap, { field, value }) {
    return state.setIn(['form', field], value);
  }

  /**
   * 切换tab展示佣金明细
   * @param state
   * @param tabType
   */
  @Action('commission:detail:changeTab')
  changeTab(state: IMap, tabType) {
    return state.set(
      'form',
      fromJS({
        //customerId始终不变
        customerId: state.get('form').get('customerId'),
        // Tab类型 0: 全部, 1: 收入, 2: 支出,3:分销佣金和邀新奖励
        tabType: '3',
        // 资金类型  0:全部 ； 1：分销佣金；2：佣金提现；3：邀新奖励
        fundsType: tabType,
        // 业务编号
        businessId: '',
        //入账开始时间
        startTime: '',
        //入账结束时间
        endTime: '',
        //排序字段
        sortColumn: 'createTime',
        //排序规则 desc asc
        sortRole: 'desc'
      })
    );
  }

  @Action('commission:detai:general')
  general(state, res) {
    return state.update('generalCommissionDetail', (generalCommissionDetail) =>
      generalCommissionDetail.merge(fromJS(res))
    );
  }
}
