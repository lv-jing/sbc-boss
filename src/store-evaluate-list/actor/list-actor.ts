import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

interface IStoreEvaluateResponse {
  content: Array<any>;
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
	    serviceModalVisible: false,
    };
  }

  @Action('listActor:init')
  init(state: IMap, res: IStoreEvaluateResponse) {
    const { content, total } = res;
    return state.withMutations((state) => {
      state.set('total', total).set('dataList', fromJS(content));
    });
  }

  @Action('list:currentPage')
  currentPage(state: IMap, current) {
    return state.set('currentPage', current);
  }

	@Action('service: modal')
	service(state: IMap, visible) {
		return state.set('serviceModalVisible', visible);
	}
}
