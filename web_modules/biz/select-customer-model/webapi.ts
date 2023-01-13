import { Fetch } from 'qmkit';
type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 获取客户列表
 * @param filterParams
 */
export function fetchCustomerList(filterParams = {}) {
  let url = '/customer/page';
  return Fetch<TResult>(url, {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

/**
 * 获取所有业务员
 * @returns {Promise<IAsyncResult<T>>}
 */
export const fetchAllEmployee = () => {
  return Fetch<TResult>('/customer/employee/allEmployees');
};

/**
 * 获取当前平台所有客户等级
 * @returns {Promise<IAsyncResult<T>>}
 */
export const fetchAllCustomerLevel = () => {
  return Fetch<TResult>('/customer/levellist');
};
