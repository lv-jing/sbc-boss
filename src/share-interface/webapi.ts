import { Fetch } from 'qmkit';

/**
 * 查询微信分享配置
 */
export function queryWechatShareSet() {
  return Fetch<TResult>('/third/share/wechat/detail');
}

/**
 * 保存微信分享配置
 */
export function saveWxShareInfo(set) {
  return Fetch<TResult>('/third/share/wechat/save', {
    method: 'PUT',
    body: JSON.stringify(set)
  });
}
