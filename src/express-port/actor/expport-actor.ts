/**
 * Created by feitingting on 2017/6/30.
 */
import { Actor, Action, IMap } from 'plume2';
export default class ExpPortActor extends Actor {
  defaultState() {
    return {
      portObj: {
        configId: '',
        deliveryKey: '',
        customerKey: '',
        status: ''
      }
    };
  }

  @Action('port:init')
  init(state: IMap, res: IMap) {
    return state.set('portObj', res);
  }
}
