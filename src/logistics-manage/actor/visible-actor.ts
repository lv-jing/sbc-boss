/**
 * Created by feitingting on 2017/6/20.
 */
import { Actor, Action, IMap } from 'plume2';

export default class VisibleActor extends Actor {
  defaultState() {
    return {
      expVisible: false,
      expressName: '',
      expressId: ''
    };
  }

  @Action('visible:addShow')
  addShow(state: IMap) {
    return (
      state
        .set('expVisible', true)
        /**
         * 模态框弹出的时候要将文本框里面的值设为空*/
        .set('expressName', '')
        .set('expressId', '')
    );
  }

  @Action('visible:hide')
  hide(state: IMap) {
    return state.set('expVisible', false);
  }

  @Action('visible:changeId')
  changeId(state: IMap, id) {
    return state.set('expressId', id);
  }

  @Action('visible:changeName')
  changeName(state: IMap, name) {
    return state.set('expressName', name);
  }

  @Action('visible:confirmAdd')
  confirmAdd(state: IMap, { id, name }) {
    return state.set('expressId', id).set('expressName', name);
  }
}
