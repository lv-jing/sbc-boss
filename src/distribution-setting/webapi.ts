import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
};

/**
 * 获取分销设置
 */
export const querySetting = () => {
  return Fetch('/distribution-setting');
};

/**
 * 保存分销开关
 * @param params
 */
export const saveOpenFlag = (params) => {
  return Fetch<TResult>('/distribution-setting/save-open-flag', {
    method: 'PUT',
    body: JSON.stringify({
      ...params
    })
  });
};

/**
 * 保存基础设置
 * @param params
 */
export const saveBasic = (params) => {
  return Fetch<TResult>('/distribution-setting/save-basic', {
    method: 'PUT',
    body: JSON.stringify({
      ...params
    })
  });
};

/**
 * 保存分销员招募
 * @param params
 */
export const saveRecruit = (params) => {
  return Fetch<TResult>('/distribution-setting/save-recruit', {
    method: 'PUT',
    body: JSON.stringify({
      ...params
    })
  });
};

/**
 * 保存奖励模式
 * @param params
 */
export const saveReward = (params) => {
  return Fetch<TResult>('/distribution-setting/save-reward', {
    method: 'PUT',
    body: JSON.stringify({
      ...params
    })
  });
};

/**
 * 保存多级分销
 * @param params
 */
export const saveMultistage = (params) => {
  return Fetch<TResult>('/distribution-setting/save-multistage', {
    method: 'PUT',
    body: JSON.stringify({
      ...params
    })
  });
};

/**
 * 删除分销员等级
 * @param params
 */
export const deleteDistributorLevel = (distributorLevelId) => {
  return Fetch<TResult>('/distributor-level', {
    method: 'DELETE',
    body: JSON.stringify({
      distributorLevelId
    })
  });
};

/**
 * 获取图片类目列表
 */
export const getImgCates = () => {
  return Fetch('/system/imageCates');
};

/**
 * 分页获取图片列表
 * @param param
 * @returns {Promise<IAsyncResult<T>>}
 */
export const fetchImages = (params = {}) => {
  return Fetch('/system/images', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};
