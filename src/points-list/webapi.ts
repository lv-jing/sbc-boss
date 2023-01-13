import { Fetch } from 'qmkit';

/**
 * 获取增减记录
 */
export function pointRecordList(params) {
  return Fetch<TResult>('/customer/points/pageDetail', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
}


/**
 * 获取积分统计数据
 */
export function pointsNumDetail() {
  return Fetch<TResult>('/customer/points/queryIssueStatistics', {
    method: 'POST',
    body: JSON.stringify({})
  });
}


/**
 * 获取客户列表
 * @param filterParams
 */
export function fetchCustomerList(filterParams = {}) {
  return Fetch<TResult>('/customer/points/page', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}