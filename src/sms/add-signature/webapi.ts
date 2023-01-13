import { Fetch } from 'qmkit';
/**
 * 新增短信签名
 */
export const smsSignAdd = (params) => {
  return Fetch<TResult>('/smssign/add', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 修改短信签名
 */
export const smsSignModify = (params) => {
  return Fetch<TResult>('/smssign/modify', {
    method: 'PUT',
    body: JSON.stringify(params)
  });
};

/**
 * 根据id查询短信签名
 */
export const smsSign = (id) => {
  return Fetch<TResult>(`/smssign/${id}`);
};
