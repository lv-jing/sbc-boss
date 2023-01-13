import { Fetch } from 'qmkit';

/**
 * 新增短信模板
 */
export const SMSTemplateAdd = (params) => {
  return Fetch<TResult>('/smstemplate/add', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 修改短信模板
 */
export const SMSTemplateModify = (params) => {
  return Fetch<TResult>('/smstemplate/modify', {
    method: 'PUT',
    body: JSON.stringify(params)
  });
};

/**
 * 根据id查询短信模板
 */
export const SMSTemplate = (id) => {
  return Fetch<TResult>(`/smstemplate/${id}`);
};

/**
 * 验证码用途列表
 */
export const smsTemplatePurposes = (params) => {
  return Fetch<TResult>('/smstemplate/purposes', {
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
 * 查看通知节点
 */
export const notices = () => {
  return Fetch<TResult>('/smstemplate/notices', {
    method: 'POST'
  });
};
