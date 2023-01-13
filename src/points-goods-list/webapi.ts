import { Fetch } from 'qmkit';

/**
 * 查询积分商品列表
 */
export function getPage(params) {
  return Fetch<TResult>('/pointsgoods/page', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 单个查询积分商品
 */
export function getById(id) {
  return Fetch<TResult>(`/pointsgoods/${id}`, {
    method: 'GET'
  });
}

/**
 * 添加积分商品
 */
export function add(info) {
  return Fetch<TResult>('/pointsgoods/add', {
    method: 'POST',
    body: JSON.stringify(info)
  });
}

/**
 * 修改积分商品
 */
export function modify(info) {
  return Fetch<TResult>('/pointsgoods/modify', {
    method: 'PUT',
    body: JSON.stringify(info)
  });
}

/**
 * 单个删除积分商品
 */
export function deleteById(id) {
  return Fetch<TResult>(`/pointsgoods/${id}`, {
    method: 'DELETE'
  });
}

/**
 * 启用/停用 积分商品状态
 * @param params
 */
export const modifyStatus = (params) => {
  return Fetch<TResult>('/pointsgoods/modifyStatus', {
    method: 'PUT',
    body: JSON.stringify(params)
  });
};

/**
 * 获取积分商品分类列表
 */
export const getCateList = () => {
  return Fetch('/pointsgoodscate/list', {
    method: 'POST',
    body: JSON.stringify({})
  });
};

/**
 * 添加积分商品分类
 */
export const addCate = (params) => {
  return Fetch('/pointsgoodscate/add', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 修改积分商品分类
 */
export const modifyCate = (formData: object) => {
  return Fetch('/pointsgoodscate/modify', {
    method: 'PUT',
    body: JSON.stringify({
      ...formData
    })
  });
};

/**
 * 拖拽排序积分商品分类
 */
export const dragSort = (param) => {
  return Fetch('/pointsgoodscate/editSort', {
    method: 'PUT',
    body: JSON.stringify(param)
  });
};

/**
 * 删除分类
 */
export const deleteCate = (cateId) => {
  return Fetch(`/pointsgoodscate/${cateId}`, {
    method: 'DELETE'
  });
};

/**
 * 查询积分优惠券列表
 */
export function getCouponPage(params) {
  return Fetch<TResult>('/pointscoupon/page', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 单个查询积分优惠券
 */
export function getCouponById(id) {
  return Fetch<TResult>(`/pointscoupon/${id}`, {
    method: 'GET'
  });
}

/**
 * 添加积分优惠券
 */
export function addCoupon(info) {
  return Fetch<TResult>('/pointscoupon/add', {
    method: 'POST',
    body: JSON.stringify(info)
  });
}

/**
 * 修改积分优惠券
 */
export function modifyCoupon(info) {
  return Fetch<TResult>('/pointscoupon/modify', {
    method: 'PUT',
    body: JSON.stringify(info)
  });
}

/**
 * 单个删除积分优惠券
 */
export function deleteCouponById(id) {
  return Fetch<TResult>(`/pointscoupon/${id}`, {
    method: 'DELETE'
  });
}

/**
 * 启用/停用积分兑换券状态
 * @param params
 */
export const modifyCouponStatus = (params) => {
  return Fetch<TResult>('/pointscoupon/modifyStatus', {
    method: 'PUT',
    body: JSON.stringify(params)
  });
};
