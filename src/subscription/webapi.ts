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
 * get Subscription List
 * @param filterParams
 */
export function getSubscriptionList(filterParams = {}) {
  return Fetch<TResult>('/sub/findPage', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function cancelSubscription(filterParams = {}) {
  return Fetch<TResult>('/sub/cancelSubscription', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

export function pauseSubscription(subscriptionId: string) {
  return Fetch<TResult>('/sub/pauseSubscription', {
    method: 'POST',
    body: JSON.stringify({
      subscribeId: subscriptionId,
      subscribeStatus: '1'
    })
  });
}

export function restartSubscription(subscriptionId: string) {
  return Fetch<TResult>('/sub/reStartSubscription', {
    method: 'POST',
    body: JSON.stringify({
      subscribeId: subscriptionId,
      subscribeStatus: '0'
    })
  });
}
