import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
};

export const fetchSetting = () => {
  return Fetch('/baseConfig');
};

/**
 * 修改基本信息
 * @param params
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const editSetting = (params = {}) => {
  return Fetch<TResult>('/baseConfig', {
    method: 'PUT',
    body: JSON.stringify({
      ...params
    })
  });
};

/**
 * 新增基本信息
 * @param params
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const saveSetting = (params = {}) => {
  return Fetch<TResult>('/baseConfig', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
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
