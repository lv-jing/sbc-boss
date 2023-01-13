import { Fetch } from 'qmkit';
type TResult = {
  code: string;
  message: string;
  context: any;
};
/**
 * 查询商家工商信息
 * @param id
 */
export const findOne = (id) => {
  return Fetch(`/company/${id}`);
};

/**
 * 查询店铺基本信息
 * @param storeId
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function fetchStoreInfo(storeId: number) {
  return Fetch<TResult>(`/store/store-info/${storeId}`);
}

/**
 * 获取商家签约分类
 */
export const getCateList = (id) => {
  return Fetch<TResult>(`/contract/cate/list/${id}`, {
    method: 'GET'
  });
};

/**
 * 获取品牌分类
 */
export const getBrandList = (id) => {
  return Fetch<TResult>(`/contract/brand/list/${id}`, {
    method: 'GET'
  });
};

/**
 * 审核（驳回）商家
 * @param params
 */
export const rejectSupplier = (params = {}) => {
  return Fetch<TResult>('/store/reject', {
    method: 'PUT',
    body: JSON.stringify({ ...params })
  });
};

/**
 * 获取商品品牌详细信息
 * @param id
 */
export const fetchBrandInfo = (id: number) => {
  return Fetch<TResult>(`/goods/goodsBrand/${id}`, {
    method: 'GET'
  });
};

export const getSameBrands = (id: number) => {
  return Fetch<TResult>(`/contract/brand/list/verify/${id}`, {
    method: 'GET'
  });
};

/**
 *
 * @param companyInfoId
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function fetchAccountDay(companyInfoId : number) {
  let params = {
    companyInfoId
  };
  return Fetch<TResult>(`/store/getPaymentInfo`,{
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 查询结算银行账户
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function fetchAccountList(companyInfoId: number) {
  return Fetch<TResult>(`/account/list/${companyInfoId}`);
}

/**
 * 直接关联品牌
 * @param storeId
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function brandRelevance(storeId: number) {
  return Fetch<TResult>(`/contract/brand/relevance/${storeId}`, {
    method: 'GET'
  });
}
/**
 * 获取Dictionary
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function getDictionaryByType(dictionaryType: String) {
  let params = {
    type: dictionaryType
  };
  return Fetch<TResult>('/sysdictBoss/querySysDictionary', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}
