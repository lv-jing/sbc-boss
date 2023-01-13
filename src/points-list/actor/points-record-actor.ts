import { Action, Actor } from 'plume2';

export default class PointsRecordActor extends Actor {
  defaultState() {
    return {
      total: 0, //当前的数据总数
      pageSize: 10, //当前的分页条数
      pageNum: 1, //当前页
      pointsList: [], //列表数据
      form: {
        customerName: '',
        customerAccount: '',
        opTimeBegin: null,
        opTimeEnd: null
      }
    };
  }

  @Action('init')
  init(state, { pointsList, total, pageNum }) {
    return state
      .set('pointsList', pointsList)
      .set('total', total)
      .set('pageNum', pageNum);
  }

  @Action('form: field')
  formFiledChange(state, { key, value }) {
    return state.setIn(['form', key], value);
  }
}
