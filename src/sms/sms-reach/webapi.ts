import { Fetch } from 'qmkit';

/**
 * 会员等级列表
 */
export const customerLevelList = () => {
  return Fetch<TResult>('/customer/levellist');
};

/**
 * 分页查询任务列表
 */
export const smsSendPage = (params) => {
  return Fetch<TResult>('/sms-send/page', {
    method: 'POST',
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
 * 列表查询短信模板
 */
export const smsTemplateList = (params) => {
  return Fetch<TResult>('/smstemplate/list', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 列表查询短信签名
 */
export const smsSignList = (params) => {
  return Fetch<TResult>('/smssign/list', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 短信模板删除
 */
export const smsTemplateDelete = (id) => {
  return Fetch<TResult>(`/smstemplate/${id}`, {
    method: 'DELETE'
  });
};

/**
 * 短信签名删除
 */
export const smsSignDelete = (id) => {
  return Fetch<TResult>(`/smssign/${id}`, {
    method: 'DELETE'
  });
};

/**
 * 列表查询短信签名
 */
export const smsSettingList = (params) => {
  return Fetch<TResult>('/smssetting/list', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 根据id获取短信配置
 */
export const smsSetting = (id) => {
  return Fetch<TResult>(`/smssetting/${id}`);
};

/**
 * 修改短信配置
 */
export const smsSettingModify = (params) => {
  return Fetch<TResult>('/smssetting/modify', {
    method: 'PUT',
    body: JSON.stringify(params)
  });
};

/**
 * 会员分群列表查询
 */
export const rfmGroupList = () => {
  return Fetch<TResult>('/customer/group/list');
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
 * 全部会员
 */
export const customerPage = (params) => {
  return Fetch<TResult>('/customer/page', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 全部会员
 */
export const customerQuery = (params) => {
  return Fetch<TResult>('/ares/customerQuery/customer-total', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 会员列表查询
 */
export const customerList = (params) => {
  return Fetch<TResult>('/customer/page', {
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

/**
 * 修改短信发送任务
 */
export const smsSendUpdate = (params) => {
  return Fetch<TResult>('/sms-send/modify', {
    method: 'PUT',
    body: JSON.stringify(params)
  });
};

/**
 * 删除短信发送任务
 */
export const smsSendDelete = (id) => {
  return Fetch<TResult>(`/sms-send/${id}`, {
    method: 'DELETE'
  });
};

/**
 * 短信发送任务详情
 */
export const smsSendDetail = (id) => {
  return Fetch<TResult>(`/sms-send/${id}`);
};

/**
 * 提交备案
 */
export const smsTemplateUpload = (id) => {
  return Fetch<TResult>(`/smstemplate/upload/${id}`, {
    method: 'PUT'
  });
};

/**
 * 同步历史模板
 */
export const smsTemplateSyncHistory = (params) => {
  return Fetch<TResult>('/smstemplate/syn-platform-history-sms-template', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 同步模板
 */
export const smsTemplateSync = () => {
  return Fetch<TResult>('/smstemplate/synchronize-platform-sms-template', {
    method: 'POST'
  });
};

/**
 * 同步历史签名
 */
export const smsSignSyncHistory = (params) => {
  return Fetch<TResult>('/smssign/sync-platform-history-smsSign-by-names', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 同步签名
 */
export const smsSignSync = () => {
  return Fetch<TResult>('/smssign/synchronize-platform-smsSign', {
    method: 'POST'
  });
};

/**
 * 修改开关标识
 */
export const changeOpenFlag = (params) => {
  return Fetch<TResult>('/smstemplate/open-flag', {
    method: 'PUT',
    body: JSON.stringify(params)
  });
};
