/**
 * Created by feitingting on 2017/12/4.
 */
import { Fetch } from 'qmkit';

export const getAccountList = (params: {}) => {
  return Fetch<TResult>('/company/account', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};
