import { Fetch } from 'qmkit';

/**
 * 获取商品详情
 */
export const getGoodsDetail = (goodsId: string) => {
  return Fetch(`/goods/sku/${goodsId}`);
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
