import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 获取优惠券详情
 */
export const getActivityDetail = (activityId) => {
  return Fetch<TResult>(`/coupon-activity/${activityId}`);
};

/**
 * 新增优惠券活动
 */
export const addCouponActivity = (params) => {
  return Fetch<TResult>('/coupon-activity/add', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 修改优惠券活动
 */
export const modifyCouponActivity = (params) => {
  return Fetch<TResult>('/coupon-activity/modify', {
    method: 'PUT',
    body: JSON.stringify(params)
  });
};
