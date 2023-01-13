import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 商家列表
 * @param storeId
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const fetchSupplierList = (params) => {
  return Fetch<TResult>('/company/list', {
    method: 'POST',
    body: JSON.stringify({ ...params, storeType: 1 })
  });
};

/**
 * 启用/禁用 账号
 * @param params
 */
export const switchEmployee = (params) => {
  return Fetch<TResult>('/customer/switch', {
    method: 'PUT',
    body: JSON.stringify(params)
  });
};

/**
 * 开店/关店
 * @param params
 */
export const switchStore = (params) => {
  return Fetch<TResult>('/store/close', {
    method: 'PUT',
    body: JSON.stringify(params)
  });
};
