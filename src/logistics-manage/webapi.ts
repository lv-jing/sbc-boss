/**
 * Created by feitingting on 2017/6/20.
 */
import { Fetch } from 'qmkit';
type TResult = {
  code: string;
  message: string;
  context: any;
};

export const fetchAllExpress = () => {
  //return Fetch('/smsSuppliers')
  return Fetch<TResult>('/boss/expressCompany');
};

export const deleteCompany = (id) => {
  return Fetch<TResult>(`/boss/expressCompany/${id}`, {
    method: 'DELETE'
  });
};

export const setCompany = (ids: number[]) => {
  return Fetch<TResult>('/expressCompany', {
    method: 'POST',
    body: JSON.stringify({
      expressCompanyIds: ids
    })
  });
};

export const addCompany = (name: string, code: string) => {
  return Fetch<TResult>('/boss/expressCompany', {
    method: 'POST',
    body: JSON.stringify({
      expressName: name,
      expressCode: code
    })
  });
};
