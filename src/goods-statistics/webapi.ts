/**
 * Created by feitingting on 2017/10/19.
 */
import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 获取商品概况
 * @param params
 * @returns {Promise<IAsyncResult<T>>}
 */
export const getGoodsTotal = (params = {}) => {
  return Fetch<TResult>('/goodsReport/total', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 获取商品报表
 * @param params
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const getskuList = (params = {}) => {
  return Fetch<TResult>('/goodsReport/skuList', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 获取分类报表
 * @param params
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const getcateList = (params = {}) => {
  return Fetch<TResult>('/goodsReport/cateList', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 获取品牌报表
 * @param params
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const getbrandList = (params = {}) => {
  return Fetch<TResult>('/goodsReport/brandList', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 查询全部品牌分类
 * @returns {Promise<IAsyncResult<T>>}
 */
export const getAllBrands = () => {
  return Fetch<TResult>('/goods/allGoodsBrands', {
    method: 'GET'
  });
};

/**
 * 查询全部分类
 * @returns {Promise<IAsyncResult<T>>}
 */
export const getAllCates = () => {
  return Fetch<TResult>('/goods/goodsCates', {
    method: 'GET'
  });
};

/**
 * 查询店铺分类
 * @param id
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const getStoreCates = (id) => {
  return Fetch<TResult>(`/storeCate/${id}`);
};

/**
 * 查询店铺签约品牌
 * @param id
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const getStoreBrands = (id) => {
  return Fetch<TResult>(`/contract/goods/brand/list/${id}`);
};
