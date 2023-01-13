import { Actor, Action, IMap } from 'plume2';

export default class PlanActor extends Actor {
  defaultState() {
    return {
      customerPlan: null,
      customerPlanSendCount: null,
      planstatisticsmessagepush: null,
      customerPlanConversion: null
    };
  }

  @Action('plan: customerPlan')
  setCustomerPlan(state: IMap, customerPlan) {
    return state.set('customerPlan', customerPlan);
  }

  @Action('plan: customerPlanSendCount')
  setCustomerPlanSendCount(state, customerPlanSendCount) {
    return state.set('customerPlanSendCount', customerPlanSendCount);
  }

  @Action('plan: planstatisticsmessagepush')
  setPlanstatisticsmessagepush(state, planstatisticsmessagepush) {
    return state.set('planstatisticsmessagepush', planstatisticsmessagepush);
  }

  @Action('plan: customerPlanConversion')
  setCustomerPlanConversion(state, customerPlanConversion) {
    return state.set('customerPlanConversion', customerPlanConversion);
  }
}
