import { Fetch } from 'qmkit';

export const fetchDistributionRecordList = (filter = {}) => {
  return Fetch<TResult>('/distribution/record/page', {
    method: 'POST',
    body: JSON.stringify(filter)
  });
};

export const filterDistributionCustomer = (params) => {
  return Fetch<TResult>('/distribution-invite-new/distributionCustomer/list', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
};

export const filterGoodsInfoData = (params) => {
  return Fetch<TResult>('/distribution/record/listGoodsInfo', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
};

export const filterCompanyData = (params) => {
  return Fetch<TResult>('/distribution/record/listCompany', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
};

export const filterStoreData = (params) => {
  return Fetch<TResult>('/distribution/record/listStore', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
};

export const filterCustomerData = (params) => {
  return Fetch<TResult>('/distribution/record/listCustomer', {
    method: 'POST',
    body: JSON.stringify({
      ...params
    })
  });
};
