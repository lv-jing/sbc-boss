import { Action, Actor, IMap } from 'plume2';

export default class PointsDetailActor extends Actor {
  defaultState() {
    return {
      total: 0, //当前的数据总数
      pageSize: 10, //当前的分页条数
      pageNum: 1, //当前页
      pointsDetailList: [], //列表数据
      customerId: null
    };
  }

  @Action('init')
  init(state: IMap, { pointsDetailList, total, pageNum }) {
    return state
      .set('pointsDetailList', pointsDetailList)
      .set('total', total)
      .set('pageNum', pageNum);
  }

  @Action('point-detail:customerId')
  pointDetailCustomerId(state: IMap, customerId: string) {
    return state.set('customerId', customerId);
  }
}
