import { Fetch } from 'qmkit';

/**
 * 获取商品详情
 */
export const getGoodsDetail = (goodsId: string) => {
  return Fetch(`/standard/sku/${goodsId}`);
};

/**
 * 修改商品
 */
export const edit = (param: any) => {
  return Fetch('/standard/sku', {
    method: 'PUT',
    body: JSON.stringify(param)
  });
};

/**
 * 获取图片类目列表
 */
export const getImgCates = () => {
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
