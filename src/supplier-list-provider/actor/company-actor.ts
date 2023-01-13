import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class CompanyActor extends Actor {
  defaultState() {
    return {
      // 商家列表
      infos: [],
      form: {
        // 审核状态 -1: 全部, 0: 待审核, 1: 已审核, 2: 未通过审核
        auditState: '-1',
        // 商家名称
        supplierName: '',
        // 店铺名称
        storeName: '',
        // 商家账号
        accountName: '',
        // 商家编号
        companyCode: '',
        // 签约到期时间
        contractEndDate: '',
        // 账户状态 -1:全部  0：启用   1：禁用
        accountState: '-1',
        // 审核状态 -1:全部 0:待审核 1:已审核 2:审核未通过
        storeState: '-1',
        // 搜索项类型 0: 商家名称 1: 店铺名称 2: 商家账号
        optType: '0'
      },
      // 每页展示数量
      pageSize: 10,
      // 当前页
      pageNum: 0,
      // 总数量
      total: 0
    };
  }

  /**
   * 初始化商家列表
   */
  @Action('company: init: supplier')
  fetchSuppliers(state: IMap, context: any) {
    const infos = context.content;
    return state
      .set('infos', fromJS(infos))
      .set('pageSize', context.size)
      .set('total', context.totalElements);
  }

  /**
   * 设置列表form请求参数
   * @param state
   * @param param1
   */
  @Action('company: form: field')
  setField(state: IMap, { field, value }) {
    return state.setIn(['form', field], value);
  }

  /**
   * 切换tab展示商家列表
   * @param state
   * @param auditState
   */
  @Action('company: form: set')
  setAuditState(state: IMap, auditState) {
    return state.set(
      'form',
      fromJS({
        auditState,
        supplierName: '',
        storeName: '',
        accountName: '',
        companyCode: '',
        contractEndDate: '',
        accountState: '-1',
        storeState: '-1',
        optType: '0'
      })
    );
  }

  /**
   * 更改搜索项
   * @param state
   * @param val
   */
  @Action('company: form: changeOption')
  changeOption(state: IMap, val) {
    return state
      .setIn(['form', 'optType'], val)
      .setIn(['form', 'supplierName'], '')
      .setIn(['form', 'storeName'], '')
      .setIn(['form', 'accountName'], '');
  }

  /**
   * 设置当前页面
   * @param state
   * @param currentPage
   */
  @Action('company: currentPage')
  currentPage(state: IMap, currentPage) {
    return state.set('pageNum', currentPage);
  }
}
