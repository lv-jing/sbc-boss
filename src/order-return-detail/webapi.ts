import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

type DeliverParam = {
  logisticCompany: string;
  logisticCompanyCode: string;
  logisticNo: string;
  date: string;
};

export const fetchReturnDetail = (rid) => {
  return Fetch(`/return/${rid}`, {
    method: 'POST'
  });
};

/**
 * 审核
 * @param rid
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const audit = (rid: string) => {
  return Fetch<TResult>(`/return/audit/${rid}`, { method: 'POST' });
};

/**
 * 驳回
 * @param rid
 * @param reason
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const reject = (rid: string, reason: string) => {
  return Fetch<TResult>(`/return/cancel/${rid}?reason=${reason}`, {
    method: 'POST'
  });
};

/**
 * 填写物流信息
 * @param rid
 * @param values
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const deliver = (rid: string, values: DeliverParam) => {
  return Fetch<TResult>(`/return/deliver/${rid}`, {
    method: 'POST',
    body: JSON.stringify({
      company: values.logisticCompany,
      code: values.logisticCompanyCode,
      no: values.logisticNo,
      createTime: values.date
    })
  });
};

/**
 * 收货
 * @param rid
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const receive = (rid: string) => {
  return Fetch<TResult>(`/return/receive/${rid}`, { method: 'POST' });
};

/**
 * 拒绝收货
 * @param rid
 * @param reason
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const rejectReceive = (rid: string, reason: string) => {
  return Fetch<TResult>(`/return/receive/${rid}/reject`, {
    method: 'POST',
    body: JSON.stringify({ reason: reason })
  });
};

/**
 * 查询订单的可退金额
 * @param {string} rid
 * @returns {Promise<IAsyncResult<any>>}
 */
export const getCanRefundPrice = (rid: string) => {
  return Fetch(`/return//refundPrice/${rid}`);
};

/**
 * 校验退款单的状态，是否已经在退款处理中
 * @param {string} rid
 * @returns {Promise<IAsyncResult<any>>}
 */
export const checkRefundStatus = (rid: string) => {
  return Fetch(`/return/verifyRefundStatus/${rid}`);
};

/**
 * 线上退款
 * @param rid
 */
export const refundOnline = (rid: string) => {
  return Fetch<TResult>(`/return/refund/${rid}/online`, {
    method: 'POST'
  });
};

/**
 * 线下退款
 * @param rid
 * @param params
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const refundOffline = (rid: string, params = {}) => {
  return Fetch<TResult>(`/return/refund/${rid}/offline`, {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 拒绝退款
 * @param rid
 * @param reason
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const rejectRefund = (rid: string, reason: string) => {
  return Fetch<TResult>(`/return/refund/${rid}/reject`, {
    method: 'POST',
    body: JSON.stringify({ reason: reason })
  });
};

/**
 * 查询退款单
 * @param rid
 * @returns {Promise<IAsyncResult<T>>}
 */
export function fetchRefundOrderList(rid: string) {
  return Fetch(`/account/refundOrders/${rid}`);
}

/**
 * 作废退款单
 * @param refundId
 * @returns {Promise<IAsyncResult<T>>}
 */
export function destroyRefundOrder(refundId: string) {
  return Fetch(`/account/refundOrders/destory/${refundId}`, {
    method: 'GET'
  });
}

/**
 * 查询退单对应的客户收款账户
 * @param rId
 */
export function queryOfflineCustomerAccountByReturnId(rId: string) {
  return Fetch<TResult>(`/return/customer/account/${rId}`);
}
