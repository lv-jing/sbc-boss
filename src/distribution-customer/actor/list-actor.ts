import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

// interface ICustomerResponse {
//   content: Array<any>;
//   total: number;
// }

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
      pageNum: 0
    };
  }

  @Action('listActor:init')
  init(state: IMap, res) {
    const { content, total, number, pageSize } = res;
    return state.withMutations((state) => {
      state
        .set('total', total)
        .set('pageSize', pageSize)
        .set('dataList', fromJS(content))
        .set('pageNum', number);
    });
  }
}
