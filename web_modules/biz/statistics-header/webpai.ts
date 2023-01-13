import { Fetch } from 'qmkit';

export const fetchStoreList = () => {
  return Fetch<TResult>('/store', {
    method: 'GET'
  });
};
