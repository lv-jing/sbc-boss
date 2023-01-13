import { Fetch } from 'qmkit';

/**
 * 获取业务员自己的信息,用于判断是否业务员
 */
export function fetchMyselfInfo() {
  return Fetch<TResult>('/customer/employee/myself');
}

/**
 * 获取客户列表
 * @param filterParams
 */
export function fetchCustomerList(filterParams = {}) {
  return Fetch<TResult>('/enterpriseCustomer/page', {
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
  return Fetch('/customer/employee/allEmployees');
};

/**
 * 获取所有客户等级
 * @returns {Promise<IAsyncResult<T>>}
 */
export const fetchAllCustomerLevel = () => {
  return Fetch<TResult>('/customer/levellist');
};

/**
 * 批量审核
 * @param checkState
 * @param customerIds
 * @returns {Promise<IAsyncResult<T>>}
 */
type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 新增
 * @param customer
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const saveCustomer = (customerForm) => {
  return Fetch<TResult>('/enterpriseCustomer', {
    method: 'POST',
    body: JSON.stringify(customerForm)
  });
};

//禁用启用客户
export const batchAudit = (
  customerStatus: number,
  customerIds: Array<String>,
  forbidReason
) => {
  return Fetch<TResult>('/customer/detailState', {
    method: 'POST',
    body: JSON.stringify({
      customerIds,
      customerStatus,
      forbidReason
    })
  });
};

//审核企业会员，审核/驳回
export const checkEnterpriseCustomer = (
  enterpriseCheckState: number,
  customerId: String,
  enterpriseCheckReason: String
) => {
  return Fetch<TResult>('/enterpriseCustomer/checkEnterpriseCustomer', {
    method: 'POST',
    body: JSON.stringify({
      customerId,
      enterpriseCheckState,
      enterpriseCheckReason
    })
  });
};

//批量删除
export const batchDelete = (customerIds: Array<string>) => {
  return Fetch<TResult>('/customer', {
    method: 'DELETE',
    body: JSON.stringify({
      customerIds
    })
  });
};

/**
 * 判断用户是否拥有crm权限
 */
export const getCrmConfig = () => {
  return Fetch<TResult>('/crm/config/flag');
};

/**
 * 获取企业购配置信息
 */
export const getIepSetting = () => {
  return Fetch<TResult>('/vas/iep/setting');
};

/**
 * 修改企业购配置信息
 */
export const modifyIepSetting = (params) => {
  return Fetch<TResult>('/vas/iep/setting', {
    method: 'PUT',
    body: JSON.stringify(params)
  });
};

/**
 * 获取图片类目列表
 */
export const getImgCates = () => {
  return Fetch('/system/resourceCates');
};

/**
 * 分页获取图片列表
 * @param param
 * @returns {Promise<IAsyncResult<T>>}
 */
export function fetchImages(params = {}) {
  return Fetch('/system/resources', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}
