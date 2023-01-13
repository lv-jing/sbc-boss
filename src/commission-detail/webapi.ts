import { Fetch } from 'qmkit';
type TResult = {
  code: string;
  context: any;
  message: string;
};

/**
 * 获取佣金明细列表
 */
export const getFundsDetailList = (filterParams = {}) => {
  return Fetch('/funds-detail/page', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
};

/**
 * 根据会员ID查询分销员信息
 * @param customerId
 */
export const getGeneralCommissionDetail = (customerId) => {
  return Fetch<TResult>(`/distribution-customer/customer-id/${customerId}`, {
    method: 'GET'
  });
};
