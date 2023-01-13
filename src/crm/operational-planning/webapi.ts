import { Fetch } from 'qmkit';



/**
 * 
 * @param param
 * @returns {Promise<IAsyncResult<T>>}
 */
export const fetchCustomerPlan = (planId: number) => {
  return Fetch(`/customerplan/${planId}`);
};

export const fetchCustomerPlanSendCount = (planId: number) => {
  return Fetch(`/customerplansendcount/${planId}`);
};

export const fetchPlanStatisticsMessagePush = (planId: number) => {
  return Fetch(`/planstatisticsmessagepush/${planId}`);
}

export const fetchCustomerPlanConversion = (planId: number) => {
  return Fetch(`/customer/plan/conversion/${planId}`);
}