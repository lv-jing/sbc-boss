import { Fetch } from 'qmkit';

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
export const fetchImages = (params = {}) => {
  return Fetch('/system/resources', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 查询关于我们
 */
export const fetchAboutUs = () => {
  return Fetch('/mobile-setting/get-about-us');
};

export const saveAboutUs = (context) => {
  return Fetch('/mobile-setting/modify-about-us', {
    method: 'POST',
    body: JSON.stringify({ context })
  });
};
