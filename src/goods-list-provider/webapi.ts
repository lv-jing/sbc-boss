import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 商品列表
 * @param params
 */
const goodsList = (params) => {
  const request = {
    method: 'POST',
    body: JSON.stringify({ ...params, goodsSource: 0 })
  };
  return Fetch<TResult>('/goods/spus', request);
};

/**
 * spu禁售
 */
const forbidSale = (params) => {
  const request = {
    method: 'PUT',
    body: JSON.stringify(params)
  };
  return Fetch('/goods/forbid', request);
};

/**
 * 查询全部品牌
 * @returns {Promise<IAsyncResult<T>>}
 */
const getBrandList = () => {
  return Fetch('/goods/allGoodsBrands', {
    method: 'GET'
  });
};

/**
 * 查询全部分类
 * @returns {Promise<IAsyncResult<T>>}
 */
const getCateList = () => {
  return Fetch('/goods/goodsCatesTree', {
    method: 'GET'
  });
};

/**
 * 将商品加入到商品库中
 * @param params
 * @returns {Promise<IAsyncResult<any>>}
 */
const copyToGoodsLibrary = (params) => {
  const request = {
    method: 'POST',
    body: JSON.stringify(params)
  };
  return Fetch('/goods/standard', request);
};

export { goodsList, forbidSale, getBrandList, getCateList, copyToGoodsLibrary };
