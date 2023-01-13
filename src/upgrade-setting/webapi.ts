import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 查询APP升级版本配置信息
 * @returns {Promise<IAsyncResult<any>>}
 */
export const fetchUpgradeInfo = () => {
  return Fetch<TResult>('/mobile-setting/get-app-upgrade-setting');
};

/**
 * 修改APP检测升级配置
 * @param info
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const saveUpgradeSetting = (info) => {
  return Fetch<TResult>('/mobile-setting/modify-app-upgrade-setting', {
    method: 'PUT',
    body: JSON.stringify(info)
  });
};
