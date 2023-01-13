import { Actor, Action, IMap } from 'plume2';

export default class LoadingActor extends Actor {
  defaultState() {
    return {
      loading: true,
      btnLoading: false
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

  @Action('btnLoading:start')
  btnstart(state: IMap) {
    return state.set('btnLoading', true);
  }

  @Action('btnLoading:end')
  btnend(state: IMap) {
    return state.set('btnLoading', false);
  }
}
