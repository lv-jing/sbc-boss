import { Actor, Action, IMap } from 'plume2';

export default class LoadingActor extends Actor {
  defaultState() {
    return {
      loading: true,
      logisticsLoading: false
    };
  }

  @Action('loading:start')
  start(state: IMap) {
    return state.set('loading', true);
  }

  @Action('loading:end')
  end(state: IMap) {
    return state.set('loading', false);
  }

  @Action('logisticsLoading:start')
  startLogistics(state: IMap) {
    return state.set('logisticsLoading', true);
  }

  @Action('logisticsLoading:end')
  endLogistics(state: IMap) {
    return state.set('logisticsLoading', false);
  }
}
