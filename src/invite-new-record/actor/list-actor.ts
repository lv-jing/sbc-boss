import { Actor, Action, IMap } from 'plume2';
import { fromJS, Map } from 'immutable';

interface ICustomerResponse {
  recordList: Array<any>;
  total: number;
}

export default class ListActor extends Actor {
  defaultState() {
    return {
      //当前的数据总数
      total: 0,
      //当前的分页条数
      pageSize: 10,
      //当前的客户列表
      dataList: [],
      //当前页
      currentPage: 1,
      //客户商家对应关系
      supplierNameMap: Map(),
      selected: [],
    };
  }

  @Action('invite:new:init')
  init(state: IMap, res: ICustomerResponse) {
    const { recordList, total } = res;

    return state.withMutations((state) => {
      state.set('total', total)
           .set('dataList', fromJS(recordList))
           .set('selected', fromJS([]));
    });
  }

  @Action('invite:new:currentPage')
  currentPage(state: IMap, current) {
    return state.set('currentPage', current);
  }

  @Action('list:supplierNameMap')
  supplierNameMap(state: IMap, content) {
    // let supplierNameMap = state.get('supplierNameMap');
    // supplierNameMap.set(content['customerId'], content['supplierName']);
    return state.setIn(
      ['supplierNameMap', content['customerId']],
      content['supplierName']
    );
  }

  @Action('select:init')
  initSelected(state: IMap, list) {
    return state.set('selected', fromJS(list));
  }
}
