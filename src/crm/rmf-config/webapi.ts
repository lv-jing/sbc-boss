import { Fetch } from 'qmkit';

/**
 * 获取cmf配置信息
 */
export const getCMFConfigInfo = () => {
  return Fetch('/rfmsetting/detail');
};

/**
 * 保存cmf配置信息
 */
export const saveCMFConfigInfo = (param) => {
  return Fetch('/rfmsetting/allocation', {
    method: 'POST',
    body: JSON.stringify(param)
  });
};
