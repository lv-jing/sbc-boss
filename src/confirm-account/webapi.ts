/**
 * Created by feitingting on 2017/12/6.
 */
import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 获取耽搁商家账户详情
 * @param companyInfoId
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const getSingleAccountDetail = (companyInfoId) => {
  return Fetch<TResult>(`/company/account/detail/${companyInfoId}`, {
    method: 'GET'
  });
};

/**
 *根据商家id获取店铺信息
 * @param companyInfoId
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const getStoreInfo = (storeId) => {
  return Fetch<TResult>(`/store/store-info/${storeId}`);
};

/**
 * 平台打款
 * @param params
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const remitMoney = (params: {}) => {
  return Fetch<TResult>('/company/account/remit', {
    method: 'PUT',
    body: JSON.stringify(params)
  });
};
