import { Actor, Action, IMap } from 'plume2';

export default class FormActor extends Actor {
  defaultState() {
    return {
      form: {
        //店铺名称
        storeName: '',
        // 评分周期 0：30天，1：90天，2：180天
        scoreCycle: '2',
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
}
