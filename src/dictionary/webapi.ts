import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};
/**
 * 获取Dictionary列表
 * @param filterParams
 */
export function fetchDictionaryList(filterParams = {}) {
  return Fetch<TResult>('/sysdictBoss/pageView', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
/**
 * Get Dictionary Type
 * @param filterParams
 */
export function getDictionaryTypes(filterParams = {}) {
  return Fetch<TResult>('/sysdictBoss/queryTypeList', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

/**
 * delete Dictionary
 * @param filterParams
 */
export function deleteDictionary(filterParams = {}) {
  return Fetch<TResult>('/sysdictBoss/delSysDictionary', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
