import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * get Dict
 * @param filterParams
 */
export function querySysDictionary(filterParams = {}) {
  return Fetch<TResult>('/sysdictBoss/querySysDictionary', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

/**
 * get Details
 * @param filterParams
 */
export function getSubscriptionDetail(id: String) {
  return Fetch<TResult>('/sub/getSubscriptionDetail/' + id, {
    method: 'POST'
  });
}

export function cancelNextSubscription(filterParams = {}) {
  return Fetch<TResult>('/sub/cancelNextSubscription', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

// 根据ID查找宠物信息
export function petsById(filterParams = {}) {
  return Fetch<TResult>('/pets/petsById', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
// 根据ID查找Address信息
export function addressById(id: String) {
  return Fetch<TResult>('/customer/addressList/id/' + id, {
    method: 'GET'
  });
}
// 根据ID查找字典信息
export function querySysDictionaryById(filterParams = {}) {
  return Fetch<TResult>('/sysdict/querySysDictionaryById', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
//
// 根据订阅单号查找日志信息
export function getBySubscribeId(filterParams = {}) {
  return Fetch<TResult>('/sub/getBySubscribeId', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function orderNow(filterParams = {}) {
  return Fetch<TResult>('/sub/createOrderNow', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

// 根据参数查询促销的金额与订单运费
export function getPromotionPrice(filterParams = {}) {
  return Fetch<TResult>('/sub/getPromotionPrice', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function queryCityById(filterParams = {}) {
  return Fetch<TResult>('/system-city/query-system-city-by-id', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function getFeedbackBySubscriptionId(subscriptionId) {
  return Fetch<TResult>('/subscription/feedback/getBySubscriptionId', {
    method: 'POST',
    body: JSON.stringify({
      subscriptionId
    })
  });
}

export function saveFeedback(params = {}) {
  return Fetch<TResult>('/subscription/feedback/save', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}
