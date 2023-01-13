import { Actor, Action } from 'plume2';
import { IMap } from 'typings/globalType';

export default class LoadingActor extends Actor {

//loading
@Action('loading:start')
start(state: IMap) {
  return state.set('loading', true);
}

@Action('loading:end')
end(state: IMap) {
  return state.set('loading', false);
}

}