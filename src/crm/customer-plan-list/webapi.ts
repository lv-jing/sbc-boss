import { Fetch } from 'qmkit';

/**
 * 查询列表
 */
export function getPage(params) {
  return Fetch<TResult>('/customerplan/page', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 单个查询
 */
export function getById(id) {
  return Fetch<TResult>(`/customerplan/${id}`, {
    method: 'GET'
  });
}

/**
 * 添加
 */
export function add(info) {
  return Fetch<TResult>('/customerplan/add', {
    method: 'POST',
    body: JSON.stringify(info)
  });
}

/**
 * 修改
 */
export function modify(info) {
  return Fetch<TResult>('/customerplan/modify', {
    method: 'PUT',
    body: JSON.stringify(info)
  });
}

/**
 * 单个删除
 */
export function deleteById(id) {
  return Fetch<TResult>(`/customerplan/${id}`, {
    method: 'DELETE'
  });
}

/**
 * 批量删除
 */
export function deleteByIdList(idList) {
  return Fetch<TResult>('/customerplan/delete-by-id-list', {
    method: 'DELETE',
    body: JSON.stringify({ idList: idList })
  });
}

/**
 * 暂停运营计划
 */
export function pause(id) {
  return Fetch<TResult>(`/customerplan/pause/${id}`, {
    method: 'PUT'
  });
}

/**
 * 启动运营计划
 */
export function start(id) {
  return Fetch<TResult>(`/customerplan/start/${id}`, {
    method: 'PUT'
  });
}

/**
 * 根据条件获取分群信息列表
 */
export function queryGroupInfoList(params) {
  return Fetch<TResult>('/customer/group/queryGroupInfoList', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}
