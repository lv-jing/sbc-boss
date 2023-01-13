import { Fetch } from 'qmkit';
import { IMap } from 'typings/globalType';

/**
 * 获取类目列表
 */
export const getCateList = () => {
  return Fetch('/goods/goodsCates');
};

/**
 * 添加
 */
export const addCate = (formData: IMap) => {
  return Fetch('/goods/goodsCate', {
    method: 'POST',
    body: JSON.stringify({
      goodsCate: formData.toJS()
    })
  });
};
/**
 * 删除
 */
export const deleteCate = (cateId: string) => {
  return Fetch(`/goods/goodsCate/${cateId}`, {
    method: 'DELETE'
  });
};

/**
 * 修改
 */
export const editCate = (formData: IMap) => {
  return Fetch('/goods/goodsCate', {
    method: 'PUT',
    body: JSON.stringify({
      goodsCate: formData.toJS()
    })
  });
};

/**
 * 检测商品分类是否有子类
 */
export const chkChild = (param: IMap) => {
  return Fetch('/goods/goodsCate/child', {
    method: 'POST',
    body: JSON.stringify(param)
  });
};

/**
 * 检测商品分类是否有商品
 */
export const chkGoods = (param: IMap) => {
  return Fetch('/goods/goodsCate/goods', {
    method: 'POST',
    body: JSON.stringify(param)
  });
};

/**
 * 拖拽排序
 */
export const dragSort = (param) => {
  return Fetch('/goods/goods-cate/sort', {
    method: 'PUT',
    body: JSON.stringify(param)
  });
};
