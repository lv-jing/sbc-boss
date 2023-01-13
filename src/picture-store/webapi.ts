import { Fetch } from 'qmkit';
import { IMap } from 'typings/globalType';

/**
 * 获取类目列表
 */
export const getCateList = () => {
  return Fetch('/system/resourceCates');
};

/**
 * 分页获取图片列表
 * @param param
 * @returns {Promise<IAsyncResult<T>>}
 */
export function fetchImages(params = {}) {
  return Fetch('/system/resources', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 删除
 */
export const deleteImage = (params: { imageIds: string[] }) => {
  return Fetch('/system/resource', {
    method: 'DELETE',
    body: JSON.stringify({
      resourceIds: params
    })
  });
};

/**
 * 添加分类
 */
export const addCate = (formData: IMap) => {
  return Fetch('/system/resourceCate', {
    method: 'POST',
    body: JSON.stringify(formData.toJS())
  });
};

/**
 * 移动图片
 */
export const moveImage = (formData) => {
  return Fetch('/system/resource/resourceCate', {
    method: 'PUT',
    body: JSON.stringify(formData)
  });
};

/**
 * 修改
 */
export const updateImage = (params: {}) => {
  return Fetch('/system/resource', {
    method: 'PUT',
    body: JSON.stringify(params)
  });
};
