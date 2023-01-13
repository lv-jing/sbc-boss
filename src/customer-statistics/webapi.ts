import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: string;
};

/**
 * 获取客户增长报表的table数据
 *
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function getCustomerPageData(
  dateCycle,
  pageNum,
  pageSize,
  sortName,
  sortType,
  companyId
) {
  pageNum = pageNum ? pageNum : 1;
  pageSize = pageSize ? pageSize : 10;

  let sorterOrder = 'DESC';
  if (sortType == 'ascend') {
    sorterOrder = 'ASC';
  }

  let requestJson = {
    companyId: companyId,
    pageNum: pageNum,
    pageSize: pageSize,
    sortField: sortName,
    sortType: sorterOrder
  };

  if (isNaN(dateCycle)) {
    requestJson['month'] = dateCycle;
  } else {
    requestJson['dateCycle'] = dateCycle;
  }

  return Fetch<TResult>('/customer_grow/page', {
    method: 'POST',
    body: JSON.stringify(requestJson)
  });
}

/**
 * 获取客户增长报表的table数据
 *
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function getCustomerMultiPageData(
  queryType,
  dateCycle,
  queryText,
  pageNum,
  pageSize,
  sortName,
  sortType,
  companyId
) {
  queryType = queryType ? queryType : 0;
  pageNum = pageNum ? pageNum : 1;
  pageSize = pageSize ? pageSize : 10;

  let sorterOrder = 'DESC';
  if (sortType == 'ascend') {
    sorterOrder = 'ASC';
  }

  let requestJson = {
    companyId: companyId,
    queryType: queryType,
    queryText: queryText,
    pageNum: pageNum,
    pageSize: pageSize,
    sortField: sortName,
    sortType: sorterOrder
  };

  if (isNaN(dateCycle)) {
    requestJson['month'] = dateCycle;
  } else {
    requestJson['dateCycle'] = dateCycle;
  }

  return Fetch<TResult>('/customer_report/order', {
    method: 'POST',
    body: JSON.stringify(requestJson)
  });
}

/**
 * 获取客户增长趋势的chart图
 *
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function getCustomerChartData(dateCycle, isWeek, companyId) {
  let requestJson = {
    companyInfoId: companyId,
    weekly: isWeek
  };

  if (isNaN(dateCycle)) {
    requestJson['month'] = dateCycle;
  } else {
    requestJson['queryDateCycle'] = dateCycle;
  }

  return Fetch<TResult>('/customer_grow/trend', {
    method: 'POST',
    body: JSON.stringify(requestJson)
  });
}

/**
 * 级别分布视图接口
 *
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function getCustomerLevelData(dateCycle, month, companyId) {
  return Fetch<TResult>('/view/customer/distribute/level', {
    method: 'POST',
    body: JSON.stringify({
      dateCycle: dateCycle,
      companyId: companyId,
      month: month
    })
  });
}

/**
 * 地区分布视图接口
 *
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function getCustomerAreaData(dateCycle, month, companyId) {
  return Fetch<TResult>('/view/customer/distribute/area', {
    method: 'POST',
    body: JSON.stringify({
      dateCycle: dateCycle,
      companyId: companyId,
      month: month
    })
  });
}

/**
 * 获取所有客户等级
 * @returns {Promise<IAsyncResult<T>>}
 */
export const fetchAllCustomerLevel = () => {
  return Fetch('/customer/levellist');
};

/**
 * 获取店铺列表
 * @param {{}} params
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export const fetchStoreList = () => {
  return Fetch<TResult>('/store');
};

/**
 * 地区分布获取总数
 *
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function getTotal(dateCycle, month, companyId) {
  return Fetch<TResult>('/view/customer/distribute/', {
    method: 'POST',
    body: JSON.stringify({
      dateCycle: dateCycle,
      companyId: companyId,
      month: month
    })
  });
}
