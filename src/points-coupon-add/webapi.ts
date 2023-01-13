import { Fetch } from 'qmkit';


/**
 * 新增积分商品
 * @param params
 */
export const addPointsCoupons = (params: {}) => {
  return Fetch('/pointscoupon/batchAdd', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};