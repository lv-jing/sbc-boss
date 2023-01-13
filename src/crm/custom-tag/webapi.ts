import { Fetch } from 'qmkit';

/**
 * 获取标签列表
 */
export function tagList(params) {
  return Fetch<TResult>('/customertag/page', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
}

/**
 * 删除优惠券
 */
export function deleteTag(id) {
  return Fetch<TResult>(`/customertag/${id}`, { method: 'DELETE' });
}

/**
 * 编辑标签
 */
export function eidtTag(params) {
  return Fetch<TResult>('/customertag/modify', {
    method: 'PUT',
    body: JSON.stringify({
      ...params
    })
  });
}

/**
 * 新增标签
 */
export function addTag(params) {
  return Fetch<TResult>('/customertag/add', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
}
