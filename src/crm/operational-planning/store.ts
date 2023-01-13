import { IOptions, Store } from 'plume2';
import PlanActor from './actor/plan-actor';
import { fetchCustomerPlan, fetchCustomerPlanSendCount, fetchPlanStatisticsMessagePush, fetchCustomerPlanConversion } from './webapi'
import { Const } from 'qmkit';
import { fromJS } from 'immutable';
import { message } from 'antd';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new PlanActor()];
  }

  init = async (planId: number) => {
    await this.getCustomerPlan(planId);
    await this.getCustomerPlanSendCount(planId);
    await this.getPlanstatisticsmessagepush(planId);
    await this.getCustomerPlanConversion(planId);
  }

  getCustomerPlan = async (planId: number) => {
    const { res } = await fetchCustomerPlan(planId) as any;
    const { code, context } = res;
    if (code == Const.SUCCESS_CODE) {
      const { customerPlanVO } = context;
      this.dispatch('plan: customerPlan', fromJS(customerPlanVO));
    } else {
      message.error(res.message);
    }
  }

  getCustomerPlanSendCount = async (planId: number) => {
    const { res } = await fetchCustomerPlanSendCount(planId) as any;
    const { code, context } = res;
    if (code == Const.SUCCESS_CODE) {
      const { customerPlanSendCountVO } = context;
      this.dispatch('plan: customerPlanSendCount', fromJS(customerPlanSendCountVO));
    } else {
      message.error(res.message);
    }
  }

  getPlanstatisticsmessagepush = async (planId: number) => {
    const { res } = await fetchPlanStatisticsMessagePush(planId) as any;
    const { code, context } = res;
    if (code == Const.SUCCESS_CODE) {
      const { planStatisticsMessagePushVo } = context;
      this.dispatch('plan: planstatisticsmessagepush', fromJS(planStatisticsMessagePushVo));
    } else {
      message.error(res.message);
    }
  }

  getCustomerPlanConversion = async (planId: number) => {
    const { res } = await fetchCustomerPlanConversion(planId) as any;
    const { code, context } = res;
    if (code == Const.SUCCESS_CODE) {
      const { customerPlanConversionVO } = context;
      this.dispatch('plan: customerPlanConversion', fromJS(customerPlanConversionVO));
    } else {
      message.error(res.message);
    }
  }
}
