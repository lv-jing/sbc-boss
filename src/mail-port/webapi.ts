import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

export const fetchAllSms = () => {
  return Fetch<TResult>('/smsSuppliers');
};

export const fetchSms = (id) => {
  return Fetch<TResult>(`/smsSupplier/${id}`);
};

export const editSms = (params = {}) => {
  return Fetch<TResult>('/smsSupplier', {
    method: 'PUT',
    body: JSON.stringify({
      ...params
    })
  });
};
