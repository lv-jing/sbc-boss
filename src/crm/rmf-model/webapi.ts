import { Fetch } from 'qmkit';



/**
 * 
 * @param param
 * @returns {Promise<IAsyncResult<T>>}
 */
export const fetchRfmModal = () => {
  return Fetch('/crm/rfmstatistic/rfmscore/list', {
    method: 'POST',
    body: JSON.stringify({})
  });
};

export const fetchRfmBar = () => {
  return Fetch('/crm/rfmGroupStatistics/list', {
    method: 'POST',
    body: JSON.stringify({})
  });
};
