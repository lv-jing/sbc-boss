import { Fetch } from 'qmkit';

/**
 * 通过客户ID查询客户详细信息
 * @param customerId
 * @returns {Promise<Response>}
 */
export const fetchCouponInfo = (couponId: string) => {
  return Fetch<TResult>(`/coupon-info/${couponId}`);
};
