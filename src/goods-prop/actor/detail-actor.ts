import { Actor, Action } from 'plume2';
import { IMap, IList } from 'typings/globalType';

export default class DetailActor extends Actor {
  defaultState() {
    return {
      oneProp: {},
      deleteList: [],
      checkAdd: false
    };
  }

  @Action('detail:init')
  initProp(state: IMap, oneProp: IMap) {
    return state.set('oneProp', oneProp);
  }

  @Action('detail:delete')
  deleteDetail(state: IMap, deleteList: IList) {
    return state.set('deleteList', deleteList);
  }

  @Action('detail:checkAdd')
  eidtCheckStatus(state: IMap, checkAdd: boolean) {
    return state.set('checkAdd', checkAdd);
  }
}
