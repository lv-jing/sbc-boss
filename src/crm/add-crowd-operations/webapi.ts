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
// export const customerGroupList = () => {
//   return Fetch<TResult>('/customer/group/list');
// };

/**
 * 根据条件获取分群信息列表
 */
export function customerGroupList(params) {
  return Fetch<TResult>('/customer/group/queryGroupInfoList', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

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
 * 获取优惠券详情
 */
export const getActivityDetail = (activityId) => {
  return Fetch<TResult>(`/coupon-activity/${activityId}`);
};

/**
 * 新增优惠券活动
 */
export const addCouponActivity = (params) => {
  return Fetch<TResult>('/coupon-activity/add', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 修改优惠券活动
 */
export const modifyCouponActivity = (params) => {
  return Fetch<TResult>('/coupon-activity/modify', {
    method: 'PUT',
    body: JSON.stringify(params)
  });
};

/**
 * 会员分群人数查询
 */
export const customerTotal = (groupIdList) => {
  return Fetch<TResult>('/customer/group/customer-total', {
    method: 'POST',
    body: JSON.stringify(groupIdList)
  });
};

/**
 *
 */
export const customerPlanAdd = (params) => {
  return Fetch<TResult>('/customerplan/add', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};
/**
 *
 */
export const customerPlanModify = (params) => {
  return Fetch<TResult>('/customerplan/modify', {
    method: 'PUT',
    body: JSON.stringify(params)
  });
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
 * 分页查询短信签名
 */
export const customerPlan = (id) => {
  return Fetch<TResult>(`/customerplan/${id}`);
};

/**
 * 分页查询短信签名
 */
export const customerPlanActivity = (activityId) => {
  return Fetch<TResult>(`/customerplan/activity/${activityId}`);
};
