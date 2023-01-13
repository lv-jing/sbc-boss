import { Action, Actor } from 'plume2';

export default class GrowValueActor extends Actor {
  defaultState() {
    return {
      customerId: '', //用户id
      form: {
        growthValueServiceType: null,
        gteGainStartDate: null,
        lteGainEndDate: null
      },

      total: 0, //当前的数据总数
      pageSize: 10, //当前的分页条数
      pageNum: 1, //当前页
      growValueList: [], //列表数据
      customerInfo: {},

      //当前是否是查询企业会员
      isEnterpriseCustomer: false
    };
  }

  @Action('form: field')
  formFiledChange(state, { key, value }) {
    return state.setIn(['form', key], value);
  }

  @Action('init')
  init(state, { growValueList, total, pageNum }) {
    return state
      .set('growValueList', growValueList)
      .set('total', total)
      .set('pageNum', pageNum);
  }

  @Action('init: customerId')
  initCustomerId(state, value) {
    return state.set('customerId', value);
  }

  @Action('init:customerInfo')
  initCustomerInfo(state, customerInfo) {
    return state.set('customerInfo', customerInfo);
  }

  @Action('init:isEnterpriseCustomer')
  isEnterpriseCustomer(state, flag) {
    return state.set('isEnterpriseCustomer', flag);
  }
}
