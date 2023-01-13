import { Fetch } from 'qmkit';

/**
 * 获取客户列表
 * @param filterParams
 */
export function fetchDistributionCustomerList(filterParams = {}) {
  return Fetch<TResult>('/distribution-customer/page', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

/**
 * 新增
 * @param customer
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const saveDistributionCustomer = (distributionCustomer) => {
  return Fetch<TResult>('/distribution-customer', {
    method: 'POST',
    body: JSON.stringify(distributionCustomer)
  });
};

//禁用启用客户
export const batchAudit = (
  forbiddenFlag: number,
  distributionIds: Array<String>,
  forbiddenReason
) => {
  return Fetch<TResult>('/distribution-customer/forbidden-flag', {
    method: 'POST',
    body: JSON.stringify({
      distributionIds,
      forbiddenFlag,
      forbiddenReason
    })
  });
};

/**
 * 验证用户是否有该接口权限
 */
export const checkFunctionAuth = (urlPath: string, requestType: string) => {
  return Fetch<TResult>('/check-function-auth', {
    method: 'POST',
    body: JSON.stringify({
      urlPath,
      requestType
    })
  });
};

/**
 * 获取分销员等级列表
 * @returns {Promise<IAsyncResult<any>>}
 */
export const getDistributorLevelBaseInfo = () => {
  return Fetch('/distributor-level/list-base-info', {
    method: 'POST'
  });
};
