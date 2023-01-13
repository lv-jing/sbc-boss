import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 会员分群分页查询
 */
export const rfmGroupPage = (params) => {
  return Fetch<TResult>('/crm/rfmGroupStatistics/page', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 会员分群列表查询
 */
export const rfmGroupList = () => {
  return Fetch<TResult>('/crm/rfmGroupStatistics/list', {
    method: 'POST',
    body: JSON.stringify({})
  });
};

/**
 * 自定义人群查询
 */
export const crmCustomerGroup = (params) => {
  return Fetch<TResult>('/crm/customgroup/page', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 新增自定义人群
 */
export const addCrmCumtomGroup = (params) => {
  return Fetch<TResult>('/crm/customgroup/add', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 修改自定义人群
 */
export const modifyCouponActivity = (params) => {
  return Fetch<TResult>('/crm/customgroup/modify', {
    method: 'PUT',
    body: JSON.stringify(params)
  });
};

/**
 * 通过ID查询自定义分群信息
 * @param customerId
 * @returns {Promise<Response>}
 */
export const fetchCustomGroupById = (id: string) => {
  return Fetch(`/crm/customgroup/${id}`);
};

/**
 * 删除自定义分群信息
 * @param id
 * @returns {Promise<IAsyncResult<T>>}
 */
export function deleteCustomGroup(id) {
  return Fetch<TResult>(`/crm/customgroup/${id}`, {
    method: 'DELETE'
  });
}

/**
 * 标签查询
 */
export const customerTagList = (params) => {
  return Fetch<TResult>('/customertag/list', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 会员等级列表
 */
export const customerLevelList = () => {
  return Fetch<TResult>('/customer/levellist');
};

/**
 * 分页查询短信模板
 */
export const smsTemplatePage = (params) => {
  return Fetch<TResult>('/smstemplate/page', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 分页查询短信签名
 */
export const smsSignPage = (params) => {
  return Fetch<TResult>('/smssign/page', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 新增短信发送任务
 */
export const smsSendAdd = (params) => {
  return Fetch<TResult>('/sms-send/add', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};
