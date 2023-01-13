import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 商品属性列表
 * @param params
 * @returns {Promise<IAsyncResult<any>>}
 */
const getPropList = (params) => {
  return Fetch<TResult>(`/goods/goodsProp/${params}`, {
    method: 'GET'
  });
};
/**
 * 设置索引
 * @param params
 * @returns {Promise<IAsyncResult<TResult>>}
 */
const setIndex = (params) => {
  return Fetch<TResult>('/goods/goodsProp/editIndex', {
    method: 'PUT',
    body: JSON.stringify(params)
  });
};
/**
 * 设置排序
 * @param params
 * @returns {Promise<IAsyncResult<TResult>>}
 */
const setSort = (params) => {
  return Fetch<TResult>('/goods/goodsProp/editSort', {
    method: 'PUT',
    body: JSON.stringify(params)
  });
};
/**
 * 删除属性
 * @param params
 * @returns {Promise<IAsyncResult<TResult>>}
 */
const deleteProp = (params) => {
  return Fetch<TResult>(`/goods/goodsProp/${params}`, {
    method: 'DELETE'
  });
};

/**
 * 编辑属性
 * @param params
 * @returns {Promise<IAsyncResult<TResult>>}
 */
const eidtProp = (params) => {
  return Fetch<TResult>('/goods/goodsProp', {
    method: 'PUT',
    body: JSON.stringify(params)
  });
};

/**
 * 新增属性
 * @param params
 * @returns {Promise<IAsyncResult<TResult>>}
 */
const addProp = (params) => {
  return Fetch<TResult>('/goods/goodsProp', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

export { getPropList, setIndex, setSort, deleteProp, eidtProp, addProp };
