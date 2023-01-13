import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
};

/**
 * 修改app分享配置
 */
export function modifyAppShareSetting(params) {
  return Fetch<TResult>('/mobile-setting/modify-app-share-setting', {
    method: 'PUT',
    body: JSON.stringify(params)
  });
}

/**
 * 查询app分享配置
 */
export function getAppShareSetting() {
  return Fetch<TResult>('/mobile-setting/get-app-share-setting');
}
