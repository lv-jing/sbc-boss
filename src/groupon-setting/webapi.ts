import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context:any
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
export const fetchImages = (params = {}) => {
  return Fetch('/system/resources', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 获取已生效或正在生效的拼团商品SPU列表
 * @param params 
 */
export const getValidSpus=(params)=>{
  return Fetch<TResult>('/groupon/setting/valid/goods', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

/**
 * 保存拼团规则设置
 * @param params 
 */
export const saveRule=(params)=>{
  return Fetch<TResult>('/groupon/setting/save/rule', {
    method: 'PUT',
    body: JSON.stringify(params)
  });
}

/**
 * 保存拼团广告设置
 * @param params 
*/
export const savePoster=(params)=>{
  return Fetch<TResult>('/groupon/setting/save/poster', {
    method: 'PUT',
    body: JSON.stringify(params)
  });
}

/**
 * 保存拼团审核开关
 */
export const saveAudit=(params)=>{
  return Fetch<TResult>('/groupon/setting/save/audit', {
    method: 'PUT',
    body: JSON.stringify({
      auditFlag:params?1:0
    })
  });
}

/**
 * 查询拼团设置
 */
export const queryGrouponSetting=()=>{
  return Fetch<TResult>('/groupon/setting',{
    method:'GET'
  })
}

// export const querySupplierNum=()=>{
//   return Fetch<TResult>('/groupon/setting/query/supplier/num',{
//     method:'GET'
// })
// }


