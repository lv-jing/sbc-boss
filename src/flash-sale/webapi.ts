import { Fetch } from 'qmkit';

/**
 * 查询进行中活动列表
 */
export function getSoonList(params) {
  return Fetch<TResult>('/flashsaleactivity/soonlist', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 查询进行中活动列表
 */
export function getSaleList(params) {
  return Fetch<TResult>('/flashsaleactivity/salelist', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 查询已结束活动列表
 */
export function getEndList(params) {
  return Fetch<TResult>('/flashsaleactivity/endlist', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 获取秒杀设置列表
 */
export const getSettingList = () => {
  return Fetch('/flashsalesetting/list', {
    method: 'POST',
    body: JSON.stringify({})
  });
};

/**
 * 获取某一场次秒杀设置列表
 */
export const getSettingListById = (params) => {
  return Fetch('/flashsalesetting/list', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 获取参与商家数量
 */
export const getStoreCount = () => {
  return Fetch('/flashsalesetting/storeCount',{
    method: 'POST'
  });
};

/**
 * 修改秒杀设置
 */
export function modifyList(list) {
  return Fetch<TResult>('/flashsalesetting/modifyList', {
    method: 'PUT',
    body: JSON.stringify({
      flashSaleSettingVOS: list
    })
  });
}

/**
 * 获取秒杀商品分类列表
 */
export const getCateList = () => {
  return Fetch('/flashsalecate/list', {
    method: 'POST',
    body: JSON.stringify({})
  });
};

/**
 * 添加秒杀商品分类
 */
export const addCate = (params) => {
  return Fetch('/flashsalecate/add', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 修改秒杀商品分类
 */
export const modifyCate = (formData: object) => {
  return Fetch('/flashsalecate/modify', {
    method: 'PUT',
    body: JSON.stringify({
      ...formData
    })
  });
};

/**
 * 拖拽排序
 */
export const dragSort = (param) => {
  return Fetch('/flashsalecate/editSort', {
    method: 'PUT',
    body: JSON.stringify(param)
  });
};

/**
 * 删除分类
 */
export const deleteCate = (cateId) => {
  return Fetch(`/flashsalecate/${cateId}`, {
    method: 'DELETE'
  });
};
