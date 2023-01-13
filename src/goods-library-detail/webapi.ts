import { Fetch } from 'qmkit';

/**
 * 获取商品详情
 */
export const getGoodsDetail = (goodsId: string) => {
  return Fetch(`/standard/spu/${goodsId}`);
};

/**
 * 获取类目列表
 */
export const getCateList = () => {
  return Fetch('/goods/goodsCatesTree');
};

/**
 * 获取品牌列表
 */
export const getBrandList = () => {
  return Fetch('/goods/allGoodsBrands');
};

/**
 * 保存商品基本信息
 */
export const save = (param: any) => {
  return Fetch('/standard/spu', {
    method: 'POST',
    body: JSON.stringify(param)
  });
};

/**
 * 修改商品基本信息
 */
export const edit = (param: any) => {
  return Fetch('/standard/spu', {
    method: 'PUT',
    body: JSON.stringify(param)
  });
};

/**
 * 分页获取图片列表
 * @param param
 * @returns {Promise<IAsyncResult<T>>}
 */
export function fetchResource(params = {}) {
  return Fetch('/system/resources', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 获取对应类目下所有的属性信息
 */
export const getCateIdsPropDetail = (cateId: string) => {
  return Fetch(`/goods/goodsProp/${cateId}`);
};

/**
 * 获取素材类目列表
 */
export const getResourceCates = () => {
  return Fetch('/system/resourceCates');
};
