import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 企业购商品列表
 * @param params
 */
const goodsList = (params) => {
  const request = {
    method: 'POST',
    body: JSON.stringify({ ...params })
  };
  return Fetch<TResult>('/enterprise/goodsInfo/page', request);
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
 * 获取企业购配置信息
 */
const getIepSetting = () => {
  return Fetch<TResult>('/vas/iep/setting');
};

/**
 * 企业购商品审核通过(单个)
 * @param params
 */
const checkEnterPriseGoods = (goodsInfoId) => {
  return Fetch<TResult>('/enterprise/goodsInfo/audit', {
    method: 'POST',
    body: JSON.stringify({
      goodsInfoId: goodsInfoId,
      enterpriseAuditState: 2
    })
  });
};

/**
 * 批量审核企业购商品
 * @param params
 */
const batchCheckEnterpriseGoods = (goodsInfoIds) => {
  return Fetch<TResult>('/enterprise/goodsInfo/batchAudit', {
    method: 'POST',
    body: JSON.stringify({
      goodsInfoIds: goodsInfoIds,
      enterpriseGoodsAuditFlag: 2
    })
  });
};

/**
 * 驳回企业购商品
 * @param params
 */
const refuseCheckEnterpriseGoods = (params) => {
  return Fetch<TResult>('/enterprise/goodsInfo/audit', {
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
  checkEnterPriseGoods,
  batchCheckEnterpriseGoods,
  refuseCheckEnterpriseGoods,
  queryStoreByName,
  getIepSetting
};
