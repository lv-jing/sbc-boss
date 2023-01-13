import { Fetch } from 'qmkit';

/**
 * 返回结果
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
 * 通过客户ID查询客户详细信息
 * @param customerId
 * @returns {Promise<Response>}
 */
export const fetchCustomer = (customerId: string) => {
  return Fetch(`/customer/${customerId}`);
};

/**
 * 保存收货地址
 * @param address
 */
export const addCustomerAddress = (address) => {
  const request = {
    method: 'POST',
    body: JSON.stringify(address)
  };
  return Fetch<TResult>('/customer/address', request);
};

/**
 * 修改收货地址
 * @param address
 */
export const updateCustomerAddress = (address) => {
  const request = {
    method: 'PUT',
    body: JSON.stringify(address)
  };
  return Fetch<TResult>('/customer/address', request);
};

/**
 * 通过客户ID查询客户的收货地址信息
 * @param customerId
 * @returns {Promise<Response>}
 */
export const fetchCustomerAddressList = (customerId: string) => {
  return Fetch<TResult>(`/customer/addressList/${customerId}`);
};

/**
 * 删除收货地址
 * @param addressId
 */
export const deleteCustomerAddress = (addressId) => {
  return Fetch<TResult>(`/customer/address/${addressId}`, {
    method: 'DELETE'
  });
};

/** *************客户的银行账户信息************* **/
/**
 * 通过客户ID查询客户的银行账户信息
 * @param customerId
 * @returns {Promise<Response>}
 */
export const fetchCustomerAccountList = (customerId: string) => {
  return Fetch(`/customer/accountList/${customerId}`);
};

/**
 * 删除银行账户信息
 * @param addressId
 */
export const deleteCustomerAccount = (accountId) => {
  return Fetch<TResult>(`/customer/account/${accountId}`, {
    method: 'DELETE'
  });
};

/**
 * 修改客户银行账号
 * @param account
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const updateCustomerAccount = (account) => {
  const request = {
    method: 'PUT',
    body: JSON.stringify(account)
  };
  return Fetch<TResult>('/customer/account', request);
};

/**
 * 保存客户银行账号
 * @param address
 */
export const addCustomerAccount = (account) => {
  const request = {
    method: 'POST',
    body: JSON.stringify(account)
  };
  return Fetch<TResult>('/customer/account', request);
};

/**
 * 通过客户ID查询客户的增专资质信息
 * @param customerId
 * @returns {Promise<Response>}
 */
export const fetchCustomerInvoice = (customerId: string) => {
  return Fetch(`/customer/invoice/${customerId}`);
};

/**
 * 新增
 * @param customer
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const saveCustomer = (customerForm) => {
  return Fetch<TResult>('/customer', {
    method: 'POST',
    body: JSON.stringify(customerForm)
  });
};

/**
 * 修改
 * @param customer
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const updateCustomer = (customer) => {
  return Fetch<TResult>('/customer', {
    method: 'PUT',
    body: JSON.stringify(customer)
  });
};

/** ****************************客户增票资质****************************** */
/**
 * 修改客户增票资质
 * @param account
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const updateCustomerInvoice = (invoice) => {
  const request = {
    method: 'PUT',
    body: JSON.stringify(invoice)
  };
  return Fetch<TResult>('/customer/invoice', request);
};

/**
 * 保存客户增票资质
 * @param address
 */
export const addCustomerInvoice = (invoice) => {
  const request = {
    method: 'POST',
    body: JSON.stringify(invoice)
  };
  return Fetch<TResult>('/customer/invoice', request);
};
