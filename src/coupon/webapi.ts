import { Fetch } from 'qmkit';

/**
 * 查询优惠券分类列表
 */
export const fetchCouponCate = () => {
  return Fetch('/coupon-cate/list');
};

/**
 * 查询全部品牌
 */
export const fetchBrands = () => {
  return Fetch('/goods/allGoodsBrands');
};

/**
 * 查询全部分类
 */
export const fetchCates = () => {
  return Fetch('/goods/goodsCatesTree');
};

/**
 * 新增优惠券
 * @param params
 */
export const addCoupon = (params) => {
  return Fetch('/coupon-info', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 查询优惠券信息
 * @param couponId 优惠券Id
 */
export const fetchCoupon = (couponId) => {
  return Fetch(`/coupon-info/${couponId}`);
};

/**
 * 修改优惠券
 * @param params
 */
export const editCoupon = (params) => {
  return Fetch('/coupon-info', {
    method: 'PUT',
    body: JSON.stringify(params)
  });
};
