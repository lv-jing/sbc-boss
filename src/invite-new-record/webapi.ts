import { Fetch } from 'qmkit';
type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 过滤受邀人信息
 * @param params
 */
export const filterCustomer = (params) => {
  return Fetch<TResult>('/distribution-invite-new/newInvited/list', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
};

/**
 * 过滤分销员信息
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
 * 查询邀新记录
 * @param params
 */
export const fetchInviteNewRecordList = (params) => {
  return Fetch<TResult>('/distribution-invite-new/page', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
};
