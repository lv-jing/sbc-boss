import { Actor, Action, IMap } from 'plume2';

export default class FormActor extends Actor {
  defaultState() {
    return {
      // 模糊条件-商品名称
      propName: ''
    };
  }

  @Action('form:field')
  fieldChange(state: IMap, { key, value }) {
    return state.set(key, value);
  }
}
