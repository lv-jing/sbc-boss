import { Fetch } from 'qmkit';

/**
 * 分页查看站内信任务
 */
export const taskListPage = (params) => {
  return Fetch<TResult>('/messageSend/page', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 分页查看站内信通知节点
 */
export const noticeListPage = (params) => {
  return Fetch<TResult>('/messageNode/page', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 通知节点开关
 */
export const changeSwitch = (id) => {
  return Fetch<TResult>(`/messageNode/status/${id}`, {
    method: 'get'
  });
};

/**
 * 修改通知节点
 */
export const modifyPushNode = (params) => {
  return Fetch<TResult>('/messageNode/save', {
    method: 'PUT',
    body: JSON.stringify(params)
  });
};

/**
 * 根据id查询通知节点
 */
export const pushNodeDetail = (id) => {
  return Fetch<TResult>(`/messageNode/${id}`);
};

/**
 * 站内信删除功能
 */
export const taskDelete = (id) => {
  return Fetch<TResult>(`/messageSend/delete/${id}`, {
    method: 'DELETE'
  });
};

/**
 * 添加站内信任务
 */
export const pushSendAdd = (params) => {
  return Fetch<TResult>('/messageSend/add', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 修改站内信任务
 */
export const pushSendModify = (params) => {
  return Fetch<TResult>('/messageSend/modify', {
    method: 'PUT',
    body: JSON.stringify(params)
  });
};

/**
 * 查看站内信任务详情
 */
export const pushSendDetail = (id) => {
  return Fetch<TResult>(`/messageSend/${id}`);
};

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
 * 会员分群列表查询
 */
export const rfmGroupList = () => {
  return Fetch<TResult>('/customer/group/list');
};

/**
 * 会员分群列表查询
 */
export const rfmGroupSearch = (params) => {
  return Fetch<TResult>('/customer/group/queryGroupInfoList', {
    method: 'POST',
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
 * 删除短信发送任务
 */
export const smsSendDelete = (id) => {
  return Fetch<TResult>(`/sms-send/${id}`, {
    method: 'DELETE'
  });
};

/**
 * crm标记
 */
export const crmFlag = () => {
  return Fetch<TResult>('/crm/config/flag');
};
