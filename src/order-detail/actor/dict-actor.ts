import { Actor, Action, IMap } from 'plume2';
import { List } from 'immutable';

export default class DictActor extends Actor {
  defaultState() {
    return {
      countryDict: [],
      cityDict: [],
      refresh: []
    };
  }

  @Action('dict:initCity')
  initCity(state: IMap, list: List<any>) {
    return state.set('cityDict', list);
  }

  @Action('dict:initCountry')
  initCountry(state: IMap, list: List<any>) {
    return state.set('countryDict', list);
  }

  @Action('dict:refresh')
  refresh(state: IMap, list: List<any>) {
    return state.set('refresh', list);
  }
}
