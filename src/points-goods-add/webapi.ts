import { Fetch } from 'qmkit';


/**
 * 新增积分商品
 * @param params
 */
export const addPointsGoods = (params: {}) => {
  return Fetch('/pointsgoods/batchAdd', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};

/**
 * 获取积分商品分类列表
 */
export const getCateList = () => {
  return Fetch('/pointsgoodscate/list',{
    method: 'POST',
    body: JSON.stringify({})
  });
};