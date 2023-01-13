import { Actor, Action, IMap } from 'plume2';

export default class DetailActor extends Actor {
  defaultState() {
    return {
      detail: {},
      // 表单内容
      formData: {}
    };
  }

  @Action('detail:init')
  init(state: IMap, res: Object) {
    return state.update('detail', (detail) => detail.merge(res));
  }

  @Action('detail-actor:changeDeliverNum')
  changeDeliverNum(state: IMap, { index, num }) {
    return state.update('detail', (detail) => {
      return detail.setIn(['tradeItems', index, 'deliveringNum'], num);
    });
  }
}
