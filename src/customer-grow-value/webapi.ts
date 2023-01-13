import { Fetch } from 'qmkit';

/**
 * 获取成长值列表
 */

export function growValueList(params) {
  return Fetch<TResult>('/customer/queryToGrowthValue', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
}


/**
 * 查询用户基本信息
 */
export const queryCustomerInfo = (cid: string) => {
  return Fetch<TResult>(`/customer/${cid}`);
};
