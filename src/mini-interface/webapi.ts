import { Fetch } from 'qmkit';

/**
 * 查询小程序配置信息
 */
export function fetchWxMiniSet() {
  return Fetch<TResult>('/getMiniProgramSet');
}

/**
 * 保存小程序的基础配置
 */
export function saveMiniProgram(set) {
  return Fetch<TResult>('/updateMiniProgramSet', {
    method: 'PUT',
    body: JSON.stringify(set)
  });
}
