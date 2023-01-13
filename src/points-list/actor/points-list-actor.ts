import { Action, Actor } from 'plume2';

export default class custometListActor extends Actor {
  defaultState() {
    return {
      _total: 0, //当前的数据总数
      _pageSize: 10, //当前的分页条数
      _pageNum: 1, //当前页
      customertList: [], //列表数据
      _form: {
          //客户名称
          customerName: '',
          customerStatus: null,
          customerAccount: '',
          pointsAvailableBegin:null,
          pointsAvailableEnd:null,
      }
    };
  }

  @Action('customer-point-init')
  customerPointInit(state:any, { customertList, total, pageNum }) {
    return state
      .set('customertList', customertList)
      .set('_total', total)
      .set('_pageNum', pageNum);
  }

  @Action('customer:form:field')
  customerFormFiledChange(state, { key, value }) {
    return state.setIn(['_form', key], value);
  }
}
