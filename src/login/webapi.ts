import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 登录系统
 * @param ids
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function login(account: string, password: string) {
  return Fetch<TResult>('/employee/login', {
    method: 'POST',
    body: JSON.stringify({ account: account, password: password })
  });
}

/**
 * 查询用户的菜单信息
 * @returns {Promise<IAsyncResult<T>>}
 */
export const fetchMenus = () => {
  return Fetch('/roleMenuFunc/menus');
};

/**
 * 查询用户的功能信息
 * @returns {Promise<IAsyncResult<T>>}
 */
export const fetchFunctions = () => {
  return Fetch('/roleMenuFunc/functions');
};

/**
 * 获取平台站点信息 查询ICO
 * @type {Promise<AsyncResult<T>>}
 */
export const getSiteInfo = () => {
  return Fetch('/baseConfig');
};

export const fetchMiniProgramQrcode = () => {
  return Fetch('/getS2bBossQrcode', { method: 'POST' });
};
