import { Fetch } from 'qmkit';

/**
 * 查询微信授权登录配置
 */
export function fetchWxloginSet() {
  return Fetch<TResult>('/third/login/wechat/set/detail');
}

/**
 * 保存微信授权登录配置
 */
export function saveWxloginSet(set) {
  return Fetch<TResult>('/third/login/wechat/set', {
    method: 'PUT',
    body: JSON.stringify(set)
  });
}
