import { Fetch } from 'qmkit';

/**
 * 获取会员提现管理各种状态统计状态
 * @returns {Promise<IAsyncResult<any>>}
 */
export const gather = () => {
  return Fetch('/draw/cash/gather', {
    method: 'POST'
  });
};

/**
 * 获取会员提现分页列表
 * @param filterParams
 */
export const getDrawCashList = (filterParams = {}) => {
  return Fetch('/draw/cash/page', {
    method: 'POST',
    body: JSON.stringify({
      ...filterParams
    })
  });
};

/**
 * 审核提现单状态，审核/驳回
 * @param drawCashId
 * @param checkState
 * @param rejectReason
 */
export const updateCheckState = (
  drawCashId: String,
  checkState: number,
  rejectReason: String
) => {
  return Fetch<TResult>('/draw/cash/audit', {
    method: 'POST',
    body: JSON.stringify({
      drawCashId,
      checkState,
      rejectReason
    })
  });
};

/**
 * 审核提现单状态，审核/驳回
 * @param drawCashId
 */
export const tryAgain = (drawCashId: String) => {
  return Fetch<TResult>('/draw/cash/try/again', {
    method: 'POST',
    body: JSON.stringify({
      drawCashId
    })
  });
};

/**
 * 单个审核单通过
 * @param drawCashId
 * @param auditStatus
 */
export const updataDrawCashAuditPassStatusById = (
  drawCashId: String,
  auditStatus: number
) => {
  return Fetch<TResult>('/draw/cash/audit', {
    method: 'POST',
    body: JSON.stringify({
      drawCashId,
      auditStatus
    })
  });
};

/**
 * 单个审核单不通过
 * @param drawCashId
 * @param auditStatus
 * @param rejectReason
 */
export const updataDrawCashAuditRejectStatusById = (
  drawCashId: String,
  auditStatus: number,
  rejectReason: String
) => {
  return Fetch<TResult>('/draw/cash/audit', {
    method: 'POST',
    body: JSON.stringify({
      drawCashId,
      auditStatus,
      rejectReason
    })
  });
};

/**
 * 多个审核单通过
 * @param drawCashIdList
 * @param auditStatus
 */
export const updataDrawCashBatchAuditPassStatusById = (
  drawCashIdList: Array<String>,
  auditStatus: number
) => {
  return Fetch<TResult>('/draw/cash/batch/audit', {
    method: 'POST',
    body: JSON.stringify({
      drawCashIdList,
      auditStatus
    })
  });
};
