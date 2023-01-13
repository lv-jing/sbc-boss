import { Fetch } from 'qmkit';

/**
 * 获取客户列表
 * @param filterParams
 */
export function fetchStoreEvaluateList(filterParams = {}) {
  return Fetch<TResult>('/store/evaluate/page', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}


/**
 * 获取客户列表
 * @param filterParams
 */
export function fetchEvaluateRatio() {
    return Fetch<TResult>('/evaluate/ratio/getEvaluateInfo');
}


/**
 * 修改订单设置
 */
export function editEvaluateRatio(ratio = {}) {
    return Fetch<TResult>('/evaluate/ratio/update', {
        method: 'PUT',
        body: JSON.stringify({
            ...ratio
        })
    });
}

/**
 * 获取180天评价信息
 * @param {{}} param
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function fetchStoreEvaluateNum(param = {}) {
	return Fetch<TResult>('/boss/store/evaluate/storeEvaluateNumByStoreIdAndScoreCycle', {
		method: 'POST',
		body: JSON.stringify({
			...param
		})
	});
}

/**
 * 获取180天评价信息
 * @param {{}} param
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function fetchStoreEvaluateSumInfo(param = {}) {
  return Fetch<TResult>('/store/evaluate/getByStoreId', {
    method: 'POST',
    body: JSON.stringify({
      ...param
    })
  });
}



/**
 * 获取店铺评价历史记录
 * @param {{}} filterParams
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function fetchStoreEvaluateHistoryList(filterParams = {}) {
	return Fetch<TResult>('/boss/store/evaluate/page', {
		method: 'POST',
		body: JSON.stringify({
			...filterParams
		})
	});
}
