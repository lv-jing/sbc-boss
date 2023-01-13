/**
 * Created by feitingting on 2017/6/29.
 */
import { Fetch } from 'qmkit';
export const fetchAllExpressPort = () => {
  return Fetch('/deliveryInfo');
};

type TResult = {
  code: string;
  message: string;
};

/**
 * 新增
 * @param configId
 * @param customerKey
 * @param deliveryKey
 * @param status
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const savePort = (
  configId: number,
  customerKey: string,
  deliveryKey: string,
  status: number
) => {
  return Fetch<TResult>('/deliveryInfo', {
    method: 'POST',
    body: JSON.stringify({
      configId: configId,
      deliveryKey: deliveryKey,
      customerKey: customerKey,
      status: status
    })
  });
};

/**
 * 修改
 * @param configId
 * @param customerKey
 * @param deliveryKey
 * @param status
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const editPort = (
  configId: number,
  customerKey: string,
  deliveryKey: string,
  status: number
) => {
  return Fetch<TResult>('/deliveryInfo', {
    method: 'PUT',
    body: JSON.stringify({
      configId: configId,
      deliveryKey: deliveryKey,
      customerKey: customerKey,
      status: status
    })
  });
};
