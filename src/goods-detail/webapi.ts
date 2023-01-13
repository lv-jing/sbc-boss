import { Fetch } from 'qmkit';

/**
 * 获取商品详情
 */
export const getGoodsDetail = (goodsId: string) => {
  return Fetch(`/goods/spu/${goodsId}`);
};

/**
 * 获取类目列表
 */
export const getCateList = (storeId: string) => {
  return Fetch(`/contract/goods/cate/list/${storeId}`);
};

/**
 * 获取店铺分类列表
 */
export const getStoreCateList = (storeId: string) => {
  return Fetch(`/storeCate/${storeId}`);
};

/**
 * 获取品牌列表
 */
export const getBrandList = (storeId: string) => {
  return Fetch(`/contract/goods/brand/list/${storeId}`);
};

/**
 * 获取客户等级列表
 */
export const getUserLevelList = (storeId: string) => {
  return Fetch(`/store/levels/${storeId}`, {
    method: 'GET'
  });
};

/**
 * 获取客户列表
 */
export const getUserList = (storeId: any) => {
  return Fetch(`/store/allCustomers/${storeId}`, {
    method: 'POST'
  });
};

/**
 * 获取店铺信息
 */
export const getStoreInfo = (storeId: any) => {
  return Fetch(`/store/store-info/${storeId}`);
};

/**
 * 审核通过
 * @param {string} storeId
 * @param {string} goodsId
 */
export const auditPass = (_storeId: string, goodsId: string) => {
  return Fetch('/goods/check', {
    method: 'PUT',
    body: JSON.stringify({
      goodsIds: [goodsId],
      auditStatus: 1
    })
  });
};

/**
 * 审核拒绝
 * @param {string} storeId
 * @param {string} goodsId
 * @param {string} reason
 */
export const auditReject = (
  _storeId: string,
  goodsId: string,
  reason: string
) => {
  return Fetch('/goods/check', {
    method: 'PUT',
    body: JSON.stringify({
      goodsIds: [goodsId],
      auditStatus: 2,
      auditReason: reason
    })
  });
};

/**
 * 禁售
 * @param {string} storeId
 * @param {string} goodsId
 * @param {string} reason
 */
export const auditForbid = (
  _storeId: string,
  goodsId: string,
  reason: string
) => {
  return Fetch('/goods/forbid', {
    method: 'PUT',
    body: JSON.stringify({
      goodsIds: [goodsId],
      auditStatus: 3,
      auditReason: reason
    })
  });
};

/**
 * 获取对应类目下所有的属性信息
 */
export const getPropsByCateId = (cateId) => {
  return Fetch(`/goods/goodsProp/${cateId}`);
};

/**
 * 获取平台客户列表
 * @param filterParams
 */
export function fetchBossCustomerList(customerIds) {
  return Fetch<TResult>('/customer/page', {
    method: 'POST',
    body: JSON.stringify({
      pageNum: 0,
      pageSize: 10000,
      customerIds: customerIds
    })
  });
}
