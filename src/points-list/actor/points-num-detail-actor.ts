import { Action, Actor, IMap } from 'plume2';

export default class ponitsNumberDetailsActor extends Actor {
  defaultState() {
    return {
      ponitsNumberDetails: {
        pointsIssueStatictics:0,
        pointsAvailableStatictics:0
      } //积分统计
    };
  }

  @Action('ponits-number-details')
  ponitsNumberDetails(state: IMap, ponitsNumberDetails: IMap) {
    return state.set('ponitsNumberDetails', ponitsNumberDetails);
  }
}
