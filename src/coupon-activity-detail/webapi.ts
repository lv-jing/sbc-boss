import { Fetch } from 'qmkit';

/**
 * 获取优惠券活动详情
 */
export function activityDetail(id) {
  return Fetch<TResult>(`/coupon-activity/${id}`);
}
