import { Fetch } from 'qmkit';

/**
 * 查询列表
 * @param {{}} params
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function fetchSensitiveWordsList(params = {}) {
  return Fetch<TResult>('/sensitiveWords/sensitiveWordsList', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
}

/**
 * 单个查询
 * @param sensitiveId
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function fetchSensitiveWordsById(sensitiveId) {
	return Fetch<TResult>(`/sensitiveWords/sensitiveWordsById/${sensitiveId}`, {
		method: 'GET',
	});
}
/**
 * 单个删除
 * @param sensitiveWords
 * @returns {Promise<IAsyncResult<T>>}
 */
export function deleteSensitiveWords(id) {
  return Fetch<TResult>(`/sensitiveWords/delete/${id}`, {
    method: 'DELETE',
  });
}

/**
 * 添加
 * @param sensitiveWords
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function addSensitiveWords(sensitiveWords) {
  return Fetch<TResult>('/sensitiveWords/add', {
    method: 'POST',
    body: JSON.stringify(sensitiveWords)
  });
}

/**
 * 编辑
 * @param sensitiveWords
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function editSensitiveWords(sensitiveWords) {
  return Fetch<TResult>('/sensitiveWords/edit', {
    method: 'POST',
    body: JSON.stringify(sensitiveWords)
  });
}

export function deleteSensitiveWordsByIds(sensitiveWords) {
	return Fetch<TResult>('/sensitiveWords/batchDelete', {
		method: 'POST',
		body: JSON.stringify(sensitiveWords)
	});
}