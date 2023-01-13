import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 分销商品列表
 * @param params
 */
const goodsList = (params) => {
  const request = {
    method: 'POST',
    body: JSON.stringify({ ...params })
  };
  return Fetch<TResult>('/goods/distribution-sku', request);
};

/**
 * 查询全部品牌
 * @returns {Promise<IAsyncResult<T>>}
 */
const getBrandList = () => {
  return Fetch('/goods/allGoodsBrands', {
    method: 'GET'
  });
};

/**
 * 查询全部分类
 * @returns {Promise<IAsyncResult<T>>}
 */
const getCateList = () => {
  return Fetch('/goods/goodsCatesTree', {
    method: 'GET'
  });
};

/**
 * 分销商品审核通过(单个)
 * @param params
 */
const checkDistributionGoods = (goodsInfoId) => {
  return Fetch<TResult>('/goods/distribution-check', {
    method: 'POST',
    body: JSON.stringify({ goodsInfoId: goodsInfoId })
  });
};

/**
 * 批量审核分销商品
 * @param params
 */
const batchCheckDistributionGoods = (goodsInfoIds) => {
  return Fetch<TResult>('/goods/distribution-batch-check', {
    method: 'POST',
    body: JSON.stringify({ goodsInfoIds: goodsInfoIds })
  });
};

/**
 * 驳回分销商品
 * @param params
 */
const refuseCheckDistributionGoods = (params) => {
  return Fetch<TResult>('/goods/distribution-refuse', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 禁止分销商品
 * @param params
 */
const forbidCheckDistributionGoods = (params) => {
  return Fetch<TResult>('/goods/distribution-forbid', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 根据店铺名称模糊查询店铺，Autocomplete
 * @param storeName
 * @returns {Promise<IAsyncResult<TResult>>}
 */
const queryStoreByName = (storeName: string) => {
  return Fetch<TResult>(`/store/name/?storeName=${storeName}`, {
    method: 'GET'
  });
};

export {
  goodsList,
  getBrandList,
  getCateList,
  checkDistributionGoods,
  batchCheckDistributionGoods,
  refuseCheckDistributionGoods,
  forbidCheckDistributionGoods,
  queryStoreByName
};
