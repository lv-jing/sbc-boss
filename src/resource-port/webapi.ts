import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

export const fetchAllResource = () => {
  return Fetch<TResult>('/system/resourceServers');
};

export const fetchResource = (id) => {
  return Fetch<TResult>(`/system/resourceServer/${id}`);
};

export const editResource = (params = {}) => {
  return Fetch<TResult>('/system/resourceServer', {
    method: 'PUT',
    body: JSON.stringify(params)
  });
};
