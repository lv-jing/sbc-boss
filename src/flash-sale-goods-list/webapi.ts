import { Fetch } from 'qmkit';

/**
 * 查询活动列表
 */
export function getPageList(params) {
  return Fetch<TResult>('/flashsaleactivity/detail', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}
