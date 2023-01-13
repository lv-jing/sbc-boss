import { Action, Actor } from 'plume2';

export default class PointsCouponActor extends Actor {
  defaultState() {
    return {
      // 活动开始时间
      startTime: '',
      // 活动结束时间
      endTime: ''
    };
  }

  /**
   * 修改时间区间
   * @param state
   * @param param1
   */
  @Action('goods: info: date: range')
  changeDateRange(state, { startTime, endTime }) {
    return state.set('startTime', startTime).set('endTime', endTime);
  }
}
