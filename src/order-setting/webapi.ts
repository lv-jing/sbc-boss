import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: Array<any>;
};

/**
 * 查询收款单
 * @param params
 * @returns {Promise<IAsyncResult<T>>}
 */
export function queryOrderSettings() {
  return Fetch<TResult>('/tradeSetting/order_configs');
}

/**
 * 修改订单设置
 */
export function editOrderSettings(configs) {
  return Fetch<TResult>('/tradeSetting/order_configs', {
    method: 'PUT',
    body: JSON.stringify({
      tradeSettingRequests: configs
    })
  });
}
