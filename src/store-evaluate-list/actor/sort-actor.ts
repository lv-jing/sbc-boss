import { Actor, Action, IMap } from 'plume2';
import { fromJS, Map } from 'immutable';

export default class VisibleActor extends Actor {
  defaultState() {
    return {
      sortedInfo:  Map({ order: 'descend', columnKey: 'sumCompositeScore' }),
    };
  }
    @Action('flow:setSortedInfo')
    setSortedInfo(state: IMap, data) {
        let sortedInfo = data;
        if (!sortedInfo.columnKey) {
            sortedInfo = { columnKey: 'sumCompositeScore', order: 'descend' };
        }
        return state.set('sortedInfo', fromJS(sortedInfo));
    }
}
