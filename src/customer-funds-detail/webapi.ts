import { Fetch } from 'qmkit';

/**
 * 根据会员ID查询会员资金信息
 * @param {string} customerFundsId 会员资金ID
 * @returns {Promise<IAsyncResult<any>>}
 */
export const getFundsStatistics = (customerId: string) => {
  return Fetch(`/funds/statistics/${customerId}`, {
    method: 'POST'
  });
};

/**
 * 获取余额明细分页列表
 */
export const getFundsDetailList = (filterParams = {}) => {
  return Fetch('/funds-detail/page', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
};
