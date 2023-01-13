import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 通过客户ID查询客户详细信息
 * @param customerId
 * @returns {Promise<Response>}
 */
export const fetchCustomer = (customerId: string) => {
  return Fetch<TResult>(`/customer/crm/${customerId}`);
};

export const customerGroup = (customerId: string) => {
  return Fetch<TResult>(`/customer/group/${customerId}`);
};

export const rfmScoreStatistic = (customerId: string) => {
  return Fetch<TResult>(
    `/crm/rfmstatistic/rfmscore/customerInfo?customerId=${customerId}`
  );
};
/**
 * 标签查询
 */
export const tagList = (params) => {
  return Fetch<TResult>('/customertag/list', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 标签查询
 */
export const customerTagList = (customerId) => {
  return Fetch<TResult>('/customer/tag-rel/list', {
    method: 'POST',
    body: JSON.stringify({ customerId })
  });
};

/**
 * 新增用户关联标签
 */
export const addCustomerTag = (params) => {
  return Fetch<TResult>('/customer/tag-rel/add', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 删除用户关联标签
 */
export const deleteCustomerTag = (id) => {
  return Fetch<TResult>(`/customer/tag-rel/${id}`, {
    method: 'DELETE'
  });
};
