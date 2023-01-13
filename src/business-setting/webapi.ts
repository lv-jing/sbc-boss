import { Fetch } from 'qmkit';

/**
 * 查询招商页设置
 */
export const getConfig = () => {
  return Fetch('/business/config');
};

/**
 * 保存招商页设置
 * @param param
 */
export const setConfig = (param) => {
  return Fetch('/business/config', {
    method: 'POST',
    body: JSON.stringify(param)
  });
};
/**
 * 编辑招商页设置
 * @param param
 */
export const editConfig = (param) => {
  return Fetch('/business/config', {
    method: 'PUT',
    body: JSON.stringify(param)
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
