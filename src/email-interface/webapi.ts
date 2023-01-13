import { Fetch } from 'qmkit';

/**
 * 查询腾讯企业邮箱配置
 */
export function fetchTxEmailConfig() {
  return Fetch<TResult>('/boss/emailConfig');
}

/**
 * 保存腾讯企业邮箱配置
 */
export function saveTxEmailConfig(config) {
  return Fetch<TResult>('/boss/emailConfig', {
    method: 'PUT',
    body: JSON.stringify(config)
  });
}
