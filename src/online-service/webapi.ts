import { Fetch } from 'qmkit';

/**
 * 查询客服设置
 * @param storeId
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function getOnlineServerSwitch(storeId) {
  return Fetch<TResult>(`/customerService/qq/switch/${storeId}`);
}

/**
 * 查询客服列表
 * @param storeId
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function getOnlineServerList(storeId) {
  return Fetch<TResult>(`/customerService/qq/detail/${storeId}`);
}

/**
 * 保存客服列表
 * @param storeId
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function onSaveOnlineServer(
  qqOnlineServerRop,
  qqOnlineServerItemRopList
) {
  return Fetch<TResult>('/customerService/qq/saveDetail', {
    method: 'POST',
    body: JSON.stringify({
      qqOnlineServerRop: qqOnlineServerRop,
      qqOnlineServerItemRopList: qqOnlineServerItemRopList
    })
  });
}

export function saveAliYun(params) {
  return Fetch<TResult>('/customerService/aliyun/modify',{
    method: 'POST',
    body: JSON.stringify({ ...params })
  })
}
