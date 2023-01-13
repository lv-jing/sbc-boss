import { Fetch } from 'qmkit';
import { IMap } from 'typings/globalType';

export function fetchOrderDetail(tid: string) {
  return Fetch(`/tradeBoss/${tid}`);
}

type TParams = {
  //线下账户
  offLineAccountId: string;
  //支付单id
  payOrderId: string;
  createTime: string;
  //备注
  comment: string;
};

export function addPay(params: TParams) {
  return Fetch<{ code: string; message: string }>('/account/receivable', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
}

/**
 * 查询订单下的所有收款记录
 * @param orderNo 订单号
 */
export const payRecord = (orderNo: string) => {
  const request = {
    method: 'POST',
    body: JSON.stringify({ orderNo })
  };
  return Fetch('/account/payOrders', request);
};

/**
 *查询所有有效的线下账户
 */
type TAccount = {
  accountId: number;
  bankName: string;
  bankNo: string;
};

/**
 * 验证用户是否有该接口权限
 */
export const checkFunctionAuth = (urlPath: string, requestType: string) => {
  return Fetch<TResult>('/check-function-auth', {
    method: 'POST',
    body: JSON.stringify({
      urlPath,
      requestType
    })
  });
};

export function fetchOffLineAccout() {
  return Fetch<[TAccount]>('/account/offlineAccounts');
}

/**
 * 审核
 * @param tid
 * @param audit
 * @returns {Promise<IAsyncResult<TResult>>}
 */
type TResult = {
  code: string;
  message: string;
  context: any;
};

export const audit = (tid: string, audit: string, reason: string) => {
  return Fetch<TResult>(`/trade/audit/${tid}`, {
    method: 'POST',
    body: JSON.stringify({
      auditState: audit,
      reason: reason
    })
  });
};

export const deliver = (tid: string, formData: IMap) => {
  const request = {
    method: 'PUT',
    body: JSON.stringify(formData)
  };
  return Fetch<TResult>(`/trade/deliver/${tid}`, request);
};

export const confirm = (tid: string) => {
  return Fetch<TResult>(`/trade/confirm/${tid}`);
};

/**
 * 发货单作废
 * @param tid
 * @param tdId
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const obsoleteDeliver = (tid: string, tdId: string) => {
  return Fetch<TResult>(`/trade/deliver/${tid}/void/${tdId}`);
};

/**
 * 验证订单是否存在售后申请
 * @param tid
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const deliverVerify = (tid: string) => {
  return Fetch<TResult>(`/trade/deliver/verify/${tid}`);
};

/**
 * 回审
 */
export const retrial = (tid: string) => {
  return Fetch<TResult>(`/trade/retrial/${tid}`);
};

export function fetchLogistics() {
  return Fetch<TResult>('/store/expressCompany/findExpressCompanys');
}

/**
 * 作废收款记录
 * @param payOrderId
 * @returns {Promise<IAsyncResult<T>>}
 */
export function destroyOrder(payOrderId: string) {
  return Fetch<TResult>(`/account/payOrder/destory/${payOrderId}`, {
    method: 'PUT'
  });
}

/**
 * 修改卖家备注
 */
export const remedySellerRemark = (tid: string, sellerRemark: string) => {
  const request = {
    method: 'POST',
    body: JSON.stringify({ sellerRemark })
  };
  return Fetch<TResult>(`/trade/remark/${tid}`, request);
};

/**
 * 验证
 * @param tid
 * @returns {Promise<IAsyncResult<T>>}
 */
export const verifyAfterProcessing = (tid: string) => {
  return Fetch<TResult>(`/return/find-all/${tid}`);
};

/**
 * 验证购买人
 * @param buyerId
 * @returns {Promise<IAsyncResult<T>>}
 */
export const verifyBuyer = (buyerId: string) => {
  return Fetch(`/customer/customerDelFlag/${buyerId}`);
};

/**
 * 批量确认
 * @param payOrderIds
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function payConfirm(payOrderIds: string[]) {
  return Fetch<TResult>('/account/confirm', {
    method: 'POST',
    body: JSON.stringify({
      payOrderIds: payOrderIds
    })
  });
}

/**
 * get dict
 * @param filterParams
 */
export function queryDictionary(filterParams = {}) {
  return Fetch<TResult>('/sysdictBoss/querySysDictionary', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function refresh(settleId) {
  return Fetch<TResult>(`/tradeBoss/logistics/refresh/${settleId}`, {
    method: 'GET'
  });
}

export function getPaymentInfo(tid: string) {
  return Fetch(`/tradeBoss/payment/record/${tid}`);
}

export function queryCityById(filterParams = {}) {
  if (!filterParams.id) {
    return Promise.resolve({ res: { context: null } });
  }
  return Fetch<TResult>('/system-city/query-system-city-by-id', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function getComments(filterParams = {}) {
  return Fetch<TResult>('/tradeBoss/detailComments/page', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function getCommentById(id) {
  return Fetch<TResult>('/trade/detailComments/findById', {
    method: 'POST',
    body: JSON.stringify({
      id: id
    })
  });
}

export function addComment(filterParams = {}) {
  return Fetch<TResult>('/trade/detailComments/add', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function updateComment(filterParams = {}) {
  return Fetch<TResult>('/trade/detailComments/modify', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function deleteCommentById(id) {
  return Fetch<TResult>('/trade/detailComments/deleteById', {
    method: 'POST',
    body: JSON.stringify({
      id: id
    })
  });
}
