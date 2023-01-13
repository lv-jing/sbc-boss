import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 新增分销商品素材
 * @param params
 */
export function add(params) {
  return Fetch<TResult>('/distribution/goods-matter', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
}

/**
 * 更新分销商品素材
 * @param params
 */
export function modify(params) {
  return Fetch<TResult>('/distribution/goods-matter', {
    method: 'PUT',
    body: JSON.stringify({
      ...params
    })
  });
}

/**
 * 根据账号/账号糊查询业务员
 * @param filterParams
 */
export function queryGoodsMatter(id) {
  return Fetch<TResult>(`/distribution/goods-matter/${id}`, {
    method: 'GET'
});
}

/**
 * 获取素材类目列表
 */
export const getMatterCates = () => {
  return Fetch('/system/resourceCates');
};

/**
 * 分页获取素材列表
 * @param param
 * @returns {Promise<IAsyncResult<T>>}
 */
export function fetchResource(params = {}) {
  return Fetch('/system/resources', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}
