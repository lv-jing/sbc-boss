import { Fetch } from 'qmkit';
import { IMap } from 'typings/globalType';

/**
 * 获取类目列表
 */
export const getCateList = () => {
  return Fetch('/system/imageCates');
};

/**
 * 添加
 */
export const addCate = (formData: IMap) => {
  return Fetch('/system/imageCate', {
    method: 'POST',
    body: JSON.stringify(formData.toJS())
  });
};

/**
 * 删除
 */
export const deleteCate = (cateId: string) => {
  return Fetch(`/system/imageCate/${cateId}`, {
    method: 'DELETE'
  });
};

/**
 * 修改
 */
export const editCate = (formData: IMap) => {
  return Fetch('/system/imageCate', {
    method: 'PUT',
    body: JSON.stringify(formData.toJS())
  });
};

/**
 * 检测图片分类是否有子类
 */
export const getChild = (param: IMap) => {
  return Fetch('/system/imageCate/child', {
    method: 'POST',
    body: JSON.stringify(param)
  });
};

/**
 * 检测图片分类是否有子类图片
 */
export const getImage = (param: IMap) => {
  return Fetch('/system/imageCate/image', {
    method: 'POST',
    body: JSON.stringify(param)
  });
};
