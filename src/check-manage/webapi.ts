import { Fetch } from 'qmkit';

export const listAll = () => {
  return Fetch('/boss/config/audit/list');
};

/**
 * 开启商品审核开关
 * @returns {Promise<IAsyncResult>}
 */
export const openGoodsAudit = () => {
  return Fetch('/boss/config/audit/goods/open', {
    method: 'POST'
  });
};

/**
 * 关闭商品审核开关
 * @returns {Promise<IAsyncResult>}
 */
export const closeGoodsAudit = () => {
  return Fetch('/boss/config/audit/goods/close', {
    method: 'POST'
  });
};

/**
 * 开启自营商品审核开关
 * @returns {Promise<IAsyncResult>}
 */
export const openSelfGoodsAudit = () => {
  return Fetch('/boss/config/audit/goods/self/open', {
    method: 'POST'
  });
};

/**
 * 关闭自营商品审核开关
 * @returns {Promise<IAsyncResult>}
 */
export const closeSelfGoodsAudit = () => {
  return Fetch('/boss/config/audit/goods/self/close', {
    method: 'POST'
  });
};

/**
 * 开启订单审核开关
 * @returns {Promise<IAsyncResult>}
 */
export const openOrderAudit = () => {
  return Fetch('/boss/config/audit/order/open', {
    method: 'POST'
  });
};

/**
 * 关闭订单审核开关
 * @returns {Promise<IAsyncResult>}
 */
export const closeOrderAudit = () => {
  return Fetch('/boss/config/audit/order/close', {
    method: 'POST'
  });
};

/**
 * 开启客户审核开关时，客户审核开关一起开启
 * @returns {Promise<IAsyncResult>}
 */
export const openCustomerAudit = () => {
  return Fetch('/boss/config/audit/customer/open', {
    method: 'POST'
  });
};

/**
 * 关闭订单审核开关
 * @returns {Promise<IAsyncResult>}
 */
export const closeCustomerAudit = () => {
  return Fetch('/boss/config/audit/customer/close', {
    method: 'POST'
  });
};

/**
 * 保存增专资质状态
 *
 * @param status status
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const saveInvoiceStatus = (status: number) => {
  return Fetch(`/customer/invoiceConfig?status=${status}`, {
    method: 'POST'
  });
};

/**
 * 开启客户信息完善开关
 * @returns {Promise<IAsyncResult>}
 */
export const openCustomerInfoAudit = () => {
  return Fetch('/boss/config/audit/customer-info/open', {
    method: 'POST'
  });
};

/**
 * 关闭客户信息完善开关时，客户审核开关一起关闭
 * @returns {Promise<IAsyncResult>}
 */
export const closeCustomerInfoAudit = () => {
  return Fetch('/boss/config/audit/customer-info/close', {
    method: 'POST'
  });
};

/**
 * 开启用户设置（开放访问）
 */
export const openUserAudit = () => {
  return Fetch('/boss/config/audit/usersetting/open', {
    method: 'POST'
  });
};

/**
 *  关闭用户设置（开放访问）
 */
export const closeUserAudit = () => {
  return Fetch('/boss/config/audit/usersetting/close', {
    method: 'POST'
  });
};

/**
 * pc端商品列表大小图默认展示设置
 */
export const setImgDisplayForPc = (status: number) => {
  return Fetch(`/boss/config/audit/imgdisplayforpc/${status}`, {
    method: 'POST'
  });
};

/**
 * PC商城商品列表展示维度SKU或者SPU设置
 */
export const setSpecDisplayForPc = (status: number) => {
  return Fetch(`/boss/config/audit/specdisplayforpc/${status}`, {
    method: 'POST'
  });
};

/**
 * 移动端商品列表大小图默认展示设置
 */
export const setImgDisplayForMobile = (status: number) => {
  return Fetch(`/boss/config/audit/imgdisplayformobile/${status}`, {
    method: 'POST'
  });
};

/**
 * 移动端商城商品列表展示维度SKU或者SPU设置
 */
export const setSpecDisplayForMobile = (status: number) => {
  return Fetch(`/boss/config/audit/specdisplayformobile/${status}`, {
    method: 'POST'
  });
};

/**
 * 查询商品配置（目前包括商品评价开关）
 * @param params
 * @returns {Promise<IAsyncResult<T>>}
 */
export const queryGoodsSettings = () => {
  return Fetch<TResult>('/boss/config/audit/list-goods-configs');
};

/**
 * 修改商品评价开关
 */
export const editGoodsEvaluate = (status) => {
  return Fetch<TResult>(`/boss/config/audit/goods-evaluate/${status}`, {
    method: 'POST'
  });
};

/**
 * 修改小程序分享配置
 * @param params
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const editSetting = (params = {}) => {
  return Fetch<TResult>('/boss/config/audit/modify-share-little-program', {
    method: 'POST',
    body: JSON.stringify({ ...params })
  });
};
