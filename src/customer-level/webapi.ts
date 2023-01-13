import { Fetch } from 'qmkit';

export function fetchCustomerLevel(filterParams = {}) {
  return Fetch<TResult>('/customer/customerLevels', {
    method: 'POST',
    body: JSON.stringify({ ...filterParams })
  });
}

type TResult = {
  code: string;
  message: string;
  context: any;
};

export function saveCustomerLevel({
  customerLevelName,
  customerLevelDiscount
}) {
  return Fetch<TResult>('/customer/customerLevel', {
    method: 'POST',
    body: JSON.stringify({
      customerLevelName,
      customerLevelDiscount
    })
  });
}

export function updateCustomerLevel({
  customerLevelId,
  customerLevelName,
  customerLevelDiscount
}) {
  return Fetch<TResult>('/customer/customerLevel', {
    method: 'PUT',
    body: JSON.stringify({
      customerLevelId,
      customerLevelName,
      customerLevelDiscount
    })
  });
}

export function deleteCustomerLevel(customerLevelId) {
  return Fetch<TResult>(`/customer/customerLevel/${customerLevelId}`, {
    method: 'DELETE'
  });
}
