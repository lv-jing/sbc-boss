import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 获取拼团分类列表
 */
export const getCateList = () => {
  return Fetch<TResult>('/groupon/cate/list');
};

/**
 * 添加拼团分类
 */
export const addCate = (params) => {
  return Fetch<TResult>('/groupon/cate/add', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 修改拼团分类
 */
export const editCate = (params) => {
  return Fetch<TResult>('/groupon/cate/modify', {
    method: 'PUT',
    body: JSON.stringify(params)
  });
};

/**
 * 删除拼团分类
 */
export const deleteCate = (params) => {
  return Fetch<TResult>('/groupon/cate/delete', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 拖拽排序
 */
export const dragSort = (param) => {
  return Fetch<TResult>('/groupon/cate/sort', {
    method: 'POST',
    body: JSON.stringify(param)
  });
};
