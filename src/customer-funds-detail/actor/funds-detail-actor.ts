import { Actor, Action } from 'plume2';
import { List, fromJS } from 'immutable';
import { IMap } from 'typings/globalType';

export default class FundsActor extends Actor {
  defaultState() {
    return {
      customerName: '',
      customerAccount: '',
      //余额
      accountBalance: 0.0,
      //冻结余额
      blockedBalance: 0.0,
      //可提现余额
      withdrawAmount: 0.0,
      //收入笔数
      income: 0,
      //收入金额
      amountReceived: 0.0,
      //支出笔数
      expenditure: 0,
      //支出金额
      amountPaid: 0.0,
      //当前的数据总数
      total: 0,
      //当前的分页条数
      pageSize: 10,
      // 后端返回的页码
      pageNum: 0,
      dataList: List(),
      // 表单内容
      form: {
        //会员ID
        customerId: '',
        // Tab类型 0: 全部, 1: 收入, 2: 支出
        tabType: '0',
        // 资金类型  0:全部 ； 1：分销佣金；2：佣金提现；3：邀新奖励
        fundsType: 0,
        //会员资金明细-资金状态 0: 未入账 1:成功入账(只查询成功入账的)
        fundsStatus: 1,
        // 业务编号
        businessId: '',
        //入账开始时间
        startTime: '',
        //入账结束时间
        endTime: '',
        //排序字段
        sortMap: {
          createTime: 'desc',
          customerFundsDetailId: 'desc'
        }
      }
    };
  }

  /**
   * 设置会员资金统计（余额总额、冻结余额总额、可提现余额总额）
   * @param state
   * @param res
   */
  @Action('funds:detail:statistics')
  statistics(state, res) {
    return state.update((state) => {
      return state
        .set('customerAccount', res.customerAccount)
        .set('customerName', res.customerName)
        .set('accountBalance', res.accountBalance)
        .set('blockedBalance', res.blockedBalance)
        .set('withdrawAmount', res.withdrawAmount)
        .set('income', res.income)
        .set('amountReceived', res.amountReceived)
        .set('expenditure', res.expenditure)
        .set('amountPaid', res.amountPaid);
    });
  }

  /**
   * 初始化余额明细列表
   */
  @Action('funds:detail:init')
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
  @Action('funds:detail:form:field')
  setFormField(state: IMap, { field, value }) {
    return state.setIn(['form', field], value);
  }

  /**
   * 切换tab展示余额明细
   * @param state
   * @param tabType
   */
  @Action('funds:detail:changeTab')
  changeTab(state: IMap, tabType) {
    const form = state.get('form');
    const customerId = form.get('customerId');
    const businessId = form.get('businessId');
    return state.set(
      'form',
      fromJS({
        //会员ID
        customerId: customerId,
        // Tab类型 0: 全部, 1: 收入, 2: 支出
        tabType: tabType,
        // 资金类型  0:全部 ； 1：分销佣金；2：佣金提现；3：邀新奖励
        fundsType: '0',
        //会员资金明细-资金状态 0: 未入账 1:成功入账(只查询成功入账的)
        fundsStatus: 1,
        // 业务编号
        businessId: businessId,
        //入账开始时间
        startTime: '',
        //入账结束时间
        endTime: '',
        //排序字段
        sortMap: {
          createTime: 'desc',
          customerFundsDetailId: 'desc'
        }
      })
    );
  }
}
