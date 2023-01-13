import { Fetch } from 'qmkit';

export function fetchOrderDetail(tid: string) {
  return Fetch(`/points/trade/${tid}`);
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
