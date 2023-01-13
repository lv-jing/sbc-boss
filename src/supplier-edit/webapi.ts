import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
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
 * 保存商家基本信息
 * @param info
 */
export const saveStoreInfo = (info) => {
  return Fetch<TResult>('/store/store-info', {
    method: 'PUT',
    body: JSON.stringify(info)
  });
};

/**
 * 查询商家工商信息
 * @param id
 */
export const findOne = (id) => {
  return Fetch(`/company/${id}`);
};

/**
 * 保存商家工商信息
 * @param info
 */
export const saveCompanyInfo = (info) => {
  return Fetch<TResult>('/company', {
    method: 'PUT',
    body: JSON.stringify(info)
  });
};

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
 * 获取所有品牌
 */
export const getAllBrands = (params: {}) => {
  return Fetch<TResult>(
    `/goods/allGoodsBrands?likeBrandName=${(params as any).likeBrandName}`,
    {
      method: 'GET'
    }
  );
};

/**
 * 获取全部分类
 */
export const fetchAllCates = () => {
  return Fetch<TResult>('/goods/goodsCatesTree');
};

/**
 * 删除商家的某个品牌
 */
export const deleteBrand = (params: {}) => {
  return Fetch<TResult>('/constract/renewal', {
    method: 'POST',
    body: JSON.stringify(params)
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

export const updateBrands = (params: {}) => {
  return Fetch<TResult>('/contract/renewal', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 检查是否存在
 * @param param0
 */
export const checkExsit = ({ storeId, cateId }) => {
  return Fetch<TResult>(`/contract/cate/del/verify/${cateId}/${storeId}`);
};

/**
 * 保存签约分类
 * @param params
 */
export const saveSignCate = (params) => {
  return Fetch<TResult>('/contract/renewal', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 查询店铺结算日
 * @param storeId
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function fetchAccountDay(storeId: number) {
  return Fetch<TResult>(`/store/${storeId}`);
}

/**
 * 查询结算银行账户
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function fetchAccountList(companyInfoId: number) {
  return Fetch<TResult>(`/account/list/${companyInfoId}`);
}

/**
 * 修改结算日期
 * @param storeId
 * @param accountDays
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function saveAccountDays(storeId, accountDays) {
  return Fetch<TResult>('/store/days', {
    method: 'PUT',
    body: JSON.stringify({ storeId: storeId, days: accountDays })
  });
}

/**
 * 更改日期和类型
 * @param params
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const renewStore = (params: {}) => {
  return Fetch<TResult>('/store/contract/date', {
    method: 'PUT',
    body: JSON.stringify(params)
  });
};
