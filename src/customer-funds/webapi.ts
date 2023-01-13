import { Fetch } from 'qmkit';

/**
 * 获取会员资金统计（会员余额总额、冻结余额总额、可提现余额总额）
 * @returns {Promise<IAsyncResult<any>>}
 */
export const getFundsStatistics = () => {
  return Fetch('/funds/statistics', {
    method: 'POST'
  });
};

/**
 * 获取会员资金分页列表
 */
export const getFundsList = (filterParams = {}) => {
  return Fetch('/funds/page', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
};
