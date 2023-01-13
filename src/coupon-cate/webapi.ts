import { Fetch } from 'qmkit';

/**
 * 获取优惠券分类列表
 */
export const getCateList = () => {
  return Fetch('/coupon-cate/list');
};

/**
 * 添加优惠券分类
 */
export const addCate = (couponCateName) => {
  return Fetch(`/coupon-cate/?couponCateName=${couponCateName}`, {
    method: 'POST'
  });
};

/**
 * 修改优惠券分类
 */
export const editCate = (formData) => {
  return Fetch(
    `/coupon-cate/?couponCateId=${formData.couponCateId}&couponCateName=${
      formData.couponCateName
    }`,
    {
      method: 'PUT'
    }
  );
};

/**
 * 删除优惠券分类
 */
export const deleteCate = (couponCateId) => {
  return Fetch(`/coupon-cate/${couponCateId}`, {
    method: 'DELETE'
  });
};

/**
 * 更改是否平台可用
 */
export const isOnlyPlatform = (couponCateId) => {
  return Fetch(`/coupon-cate/platform?couponCateId=${couponCateId}`, {
    method: 'PUT'
  });
};

/**
 * 拖拽排序
 */
export const dragSort = (param) => {
  return Fetch('/coupon-cate/sort', {
    method: 'PUT',
    body: JSON.stringify(param)
  });
};
