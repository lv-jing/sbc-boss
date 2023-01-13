import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

export const fetchAllPicture = () => {
  return Fetch<TResult>('/system/imageServers');
};

export const fetchPicture = (id) => {
  return Fetch<TResult>(`/system/imageServer/${id}`);
};

export const editPicture = (params = {}) => {
  return Fetch<TResult>('/system/imageServer', {
    method: 'PUT',
    body: JSON.stringify(params)
  });
};
