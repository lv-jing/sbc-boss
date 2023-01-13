import { Fetch } from 'qmkit';

/**
 * 获取分页列表
 */
export const getPageList = (filterParams = {}) => {
  return Fetch('/groupon/activity/page', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
};

/**
 * 根据店铺名称模糊查询店铺，Autocomplete
 * @param storeName
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const queryStoreByName = (storeName: string) => {
  return Fetch<TResult>(`/store/name/?storeName=${storeName}`, {
    method: 'GET'
  });
};

/**
 * 批量审核
 */
export const batchCheck = (ids) => {
  return Fetch('/groupon/activity/batch-check', {
    method: 'POST',
    body: JSON.stringify({ grouponActivityIdList: ids })
  });
};
/**
 * 批量设置精选
 */
export const batchSetSticky = (ids, sticky) => {
  return Fetch('/groupon/activity/batch-sticky', {
    method: 'POST',
    body: JSON.stringify({ grouponActivityIdList: ids, sticky: sticky })
  });
};

/**
 * 驳回
 * @param id
 * @param auditReason
 * @returns {Promise<IAsyncResult<any>>}
 */
export const refuse = (id, auditReason) => {
  return Fetch('/groupon/activity/refuse', {
    method: 'POST',
    body: JSON.stringify({ grouponActivityId: id, auditReason: auditReason })
  });
};

/**
 * 获取所有拼团分类
 * @returns {Promise<IAsyncResult<T>>}
 */
export const getGrouponCateList = () => {
  return Fetch<TResult>('/groupon/cate/list');
};
