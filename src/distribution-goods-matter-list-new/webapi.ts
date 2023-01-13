import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 获取分销商品素材列表
 * @param filterParams
 */
export function fetchGoodsMatterPage(filterParams = {}) {
  return Fetch<TResult>('/distribution/goods-matter/page/new', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}

/**
 * 批量删除分销商品素材
 * @param filterParams
 */
export function deleteList(ids) {
  return Fetch<TResult>('/distribution/goods-matter/delete-list', {
    method: 'POST',
    body: JSON.stringify({
      ids
    })
  });
}

/**
 * 根据账号/账号糊查询业务员
 * @param filterParams
 */
export function likeByNameOrAccount(params) {
  return Fetch<TResult>('/customer/employees', {
    method: 'POST',
    body: JSON.stringify({
      ...params,
      pageNum: 0,
      pageSize: 5
    })
  });
}

/**
 * 查询全部品牌
 * @returns {Promise<IAsyncResult<T>>}
 */
const getBrandList = () => {
  return Fetch('/goods/allGoodsBrands', {
    method: 'GET'
  });
}

/**
 * 查询全部分类
 * @returns {Promise<IAsyncResult<T>>}
 */
const getCateList = () =>{
  return Fetch('/goods/goodsCatesTree', {
    method: 'GET'
  });
}


/**
 * 根据店铺名称模糊查询店铺，Autocomplete
 * @param storeName
 * @returns {Promise<IAsyncResult<TResult>>}
 */
const queryStoreByName = (storeName: string) => {
    return Fetch<TResult>(`/store/name/?storeName=${storeName}`, {
        method: 'GET'
    });
};

export {
    getCateList,
    getBrandList,
    queryStoreByName
};