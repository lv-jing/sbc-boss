import { Fetch, cache } from 'qmkit';
type TResult = {
  code: string;
  message: string;
  context: any;
};

//new

// 获取customer list
export function getGoodsCates() {
  return Fetch<TResult>('/goods_cate/cates/total', {
    method: 'GET'
  });
}

// 获取Attributes 列表
export function getAttributes(filterParams = {}) {
  return Fetch<TResult>('/attribute_library/attributes', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
//获取已绑定的Attributes list
export function getSelectedListById(goodsCateId) {
  return Fetch<TResult>(`/attribute_library/attribute/${goodsCateId}`, {
    method: 'GET'
  });
}
// 绑定 Attributes 列表
export function relationAttributes(filterParams = {}) {
  return Fetch<TResult>('/goods_cate/attributes', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
}
//获取已绑定的descriptions
export function getBindDescription(goodsCateId) {
  return Fetch<TResult>(`/goods/description/description/${goodsCateId}`, {
    method: 'GET'
  });
}
//绑定 description 列表
export function bindDescription(params) {
  return Fetch<TResult>(
    '/goods/description/description/goodsCateRelatedDescription',
    {
      method: 'POST',
      body: JSON.stringify({
        ...params,
        storeId: JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA) || '{}')
          .storeId
      })
    }
  );
}
