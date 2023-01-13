import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class LevelActor extends Actor {
  defaultState() {
    return {
      //当前的数据总数
      total: 0,
      //当前的分页条数
      pageSize: 10,
      dataList: [],
      currentPage: 1
    };
  }

  @Action('level:init')
  init(state: IMap, res) {
    return state.update((state) => {
      return state
        .set('total', res.totalElements)
        .set('pageSize', res.size)
        .set('dataList', fromJS(res.content));
    });
  }

  @Action('level:currentPage')
  currentPage(state: IMap, current) {
    return state.set('currentPage', current);
  }
}
