import { Actor, Action, IMap } from 'plume2';

export default class RatioActor extends Actor {
  defaultState() {
    return {
      ratio: {}
    };
  }

  @Action('init:ratio')
  ratio(state: IMap, ratio) {
    return state.set('ratio', ratio);
  }

    @Action('ratio:field')
    changeRatioField(state: IMap, { key, value }) {
        return state.setIn(['ratio', key], value);
    }
}
