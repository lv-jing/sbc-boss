import { Fetch } from 'qmkit';

/**
 * 新增友盟push接口配置
 */
export const UmengpushconfigAdd = (params) => {
  return Fetch<TResult>('/umengpushconfig/add', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 根据id查询友盟push接口配置  开发说不用传参数
 */
export const getConfig = () => {
  return Fetch<TResult>('/umengpushconfig/getConfig');
};

/**
 * 创建推送任务
 */
export const pushSendAdd = (params) => {
  return Fetch<TResult>('/pushsend/add', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 删除推送任务
 */
export const pushSendDelete = (id) => {
  return Fetch<TResult>(`/pushsend/${id}`, {
    method: 'DELETE'
  });
};

/**
 * 修改推送任务
 */
export const pushSendModify = (params) => {
  return Fetch<TResult>('/pushsend/modify', {
    method: 'PUT',
    body: JSON.stringify(params)
  });
};

/**
 * 根据id查询友盟消息推送
 */
export const pushSendDetail = (id) => {
  return Fetch<TResult>(`/pushsend/${id}`);
};

/**
 * 分页查询友盟消息推送
 */
export const pushListPage = (params) => {
  return Fetch<TResult>('/pushsend/page', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 分页查询友盟通知节点推送
 */
export const noticeListPage = (params) => {
  return Fetch<TResult>('/pushsendnode/page', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 修改通知节点
 */
export const modifyPushNode = (params) => {
  return Fetch<TResult>('/pushsendnode/modify', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 根据id查询通知节点
 */
export const pushNodeDetail = (id) => {
  return Fetch<TResult>(`/pushsendnode/${id}`);
};

/**
 * 通知节点开关操作
 */
export const changeSwitch = (id, flag) => {
  return Fetch<TResult>(`/pushsendnode/enabled/${id}/${flag}`, {
    method: 'PUT'
  });
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
+ * crm标记
+ */
export const crmFlag = () => {
  return Fetch<TResult>('/crm/config/flag');
};
