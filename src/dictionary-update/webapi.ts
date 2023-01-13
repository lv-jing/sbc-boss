import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * Get Dictionary details
 * @param filterParams
 */
export function getDictionaryDetails(filterParams = {}) {
  return Fetch<TResult>('/sysdictBoss/querySysDictionaryById', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
/**
 * add Dictionary
 * @param filterParams
 */
export function addDictionary(filterParams = {}) {
  let loginInfo = JSON.parse(sessionStorage.getItem('s2b-supplier@login'));
  let storeIdObject = { storeId: loginInfo.storeId };
  let param = { ...storeIdObject, ...filterParams };
  return Fetch<TResult>('/sysdictBoss/addSysDictionary', {
    method: 'POST',
    body: JSON.stringify({
      ...param
    })
  });
}

/**
 * update Dictionary
 * @param filterParams
 */
export function updateDictionary(filterParams = {}) {
  let loginInfo = JSON.parse(sessionStorage.getItem('s2b-supplier@login'));
  let storeIdObject = { storeId: loginInfo.storeId };
  let param = { ...storeIdObject, ...filterParams };
  return Fetch<TResult>('/sysdictBoss/updateSysDictionary', {
    method: 'POST',
    body: JSON.stringify({
      ...param
    })
  });
}

export function querySysDictionary(filterParams = {}) {
  return Fetch<TResult>('/sysdictBoss/querySysDictionary', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
