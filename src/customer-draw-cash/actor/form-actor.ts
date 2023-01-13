import { Actor, Action } from 'plume2';
import { List, fromJS } from 'immutable';
import { IMap } from 'typings/globalType';

export default class FormActor extends Actor {
  defaultState() {
    return {
      //待审核总数
      waitAuditTotal: 0,
      //已完成总数
      finishTotal: 0,
      //提现失败总数
      drawCashFailedTotal: 0,
      //审核未通过总数
      auditNotPassTotal: 0,
      //已取消总数
      canceledTotal: 0,
      //当前的数据总数
      total: 0,
      //当前的分页条数
      pageSize: 10,
      // 后端返回的页码
      pageNum: 0,

      dataList: List(),

      selected: [],

      checkState: '0',

      rejectDrawCashId: null,

      rejectModalVisible: false,

      customerOptions: 'customerAccount',
      customerOptionsValue: '',

      // drawCashOptions: 'drawCashAccount',
      // drawCashOptionsValue: '',

      // 表单内容
      form: {
        //提现单号
        drawCashNo: '',
        // 会员账号
        customerAccount: '',
        // 会员名称
        customerName: '',

        //提现账户账号
        drawCashAccount: '',

        //提现账户账号名称
        drawCashAccountName: '',

        //申请开始时间
        applyTimeBegin: null,

        //申请结束时间
        applyTimeEnd: null,

        //完成开始时间
        finishTimeBegin: null,

        //完成开始时间
        finishTimeEnd: null,

        checkState: '0',

        auditStatus: '0',

        drawCashStatus: '',

        customerOperateStatus: '',

        finishStatus: ''
      }
    };
  }

  @Action('form:checkState')
  checkState(state: IMap, index: string) {
    return state.setIn(['form', 'checkState'], index);
  }

  @Action('form:field')
  changeField(state: IMap, { field, value }) {
    return state.setIn(['form', field], value);
  }

  @Action('form:field:customerName')
  changeField1(state: IMap, value: string) {
    return state.setIn(['form', 'customerName'], value);
  }

  @Action('form:field:customerAccount')
  changeField2(state: IMap, value: string) {
    return state.setIn(['form', 'customerAccount'], value);
  }

  @Action('form:field:drawCashAccount')
  changeField3(state: IMap, value: string) {
    return state.setIn(['form', 'drawCashAccount'], value);
  }

  @Action('form:field:drawCashAccountName')
  changeField4(state: IMap, value: string) {
    return state.setIn(['form', 'drawCashAccountName'], value);
  }

  /**
   * 初始化会员提现列表
   */
  @Action('draw: init')
  init(state, res) {
    return state.update((state) => {
      return state
        .set('total', res.totalElements)
        .set('pageSize', res.size)
        .set('pageNum', res.number)
        .set('dataList', fromJS(res.content));
    });
  }

  @Action('select:init')
  selectInit(state: IMap, list) {
    return state.set('selected', fromJS(list));
  }

  @Action('loading:start')
  start(state: IMap) {
    return state.set('loading', true);
  }

  @Action('loading:end')
  end(state: IMap) {
    return state.set('loading', false);
  }

  @Action('change:form')
  searchForm(state: IMap, { field, value }) {
    return state.setIn(['form', field], value);
  }

  @Action('reject:setRejectDrawCashId')
  setRejectCustomerId(state: IMap, drawCashId) {
    return state.set('rejectDrawCashId', drawCashId);
  }

  @Action('reject:setRejectModalVisible')
  setRejectModalVisible(state: IMap, visible) {
    return state.set('rejectModalVisible', visible);
  }

  @Action('list:currentPage')
  currentPage(state: IMap, current) {
    return state.set('currentPage', current);
  }

  /**
   * 设置会员提现列表统计
   * @param state
   * @param res
   */
  @Action('draw: gather')
  gather(state, res) {
    return state.update((state) => {
      return state
        .set('waitAuditTotal', res.waitAuditTotal)
        .set('finishTotal', res.finishTotal)
        .set('drawCashFailedTotal', res.drawCashFailedTotal)
        .set('auditNotPassTotal', res.auditNotPassTotal)
        .set('canceledTotal', res.canceledTotal);
    });
  }
}
