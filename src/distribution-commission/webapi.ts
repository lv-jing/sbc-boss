import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 获取分销员佣金列表
 * @param filterParams
 */
export function fetchDistributionCommissionList(filterParams = {}) {
  return Fetch<TResult>('/distribution-commission/page', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

/**
 * 联想查询
 * @param params
 */
export const filterDistributionCustomer = (params) => {
  return Fetch<TResult>('/distribution-invite-new/distributionCustomer/list', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
};

/**
 * 获取分销员佣金统计数据
 */
export const getStatistics = () => {
  return Fetch<TResult>('/distribution-commission/statistics', {
    method: 'POST'
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
