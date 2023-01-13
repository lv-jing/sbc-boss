import { Fetch } from 'qmkit';

/**
 * 待办事项
 * @returns {Promise<IAsyncResult<T>>}
 */
export const todoItems = () => {
  return Fetch('/todo');
};

/**
 * 员工信息
 * @returns {Promise<IAsyncResult<T>>}
 */
export const employee = () => {
  return Fetch('/customer/employee/info');
};

/**
 * 待处理事项业务权限
 */
export const todoAuth = () => {
  return Fetch<Array<string>>('/functions', {
    method: 'POST',
    body: JSON.stringify([
      'f_supplier_list_1',
      'fOrderList001',
      'fOrderDetail002',
      'fOrderList003',
      'f_goods_check_1',
      'rolf003',
      'rolf004',
      'rolf001',
      'f_customer_3',
      'f_customer_1',
      'f_basicSetting_0',
      'f_sys_auth',
      'changeInvoice',
      'f_finance_manage_settle'
    ])
  });
};

/**
 * 统计面板权限
 */
export const statisticsAuth = () => {
  return Fetch<Array<string>>('/functions', {
    method: 'POST',
    body: JSON.stringify([
      'f_flow_watch_2',
      'f_trade_watch_2',
      'f_goods_watch_2',
      'f_customer_watch_2',
      'f_employee_watch_2'
    ])
  });
};

/**
 * 商品概况数据
 * @returns {Promise<IAsyncResult<T>>}
 */
export const skuOView = () => {
  return Fetch('/goodsReport/total', {
    method: 'POST',
    body: JSON.stringify({
      selectType: 0
    })
  });
};

/**
 * 商品销售排行Top10
 * @returns {Promise<IAsyncResult<T>>}
 */
export const skuRanking = () => {
  return Fetch('/goodsReport/skuList', {
    method: 'POST',
    body: JSON.stringify({
      selectType: 0,
      sortType: 1,
      sortCol: 2,
      pageNum: 1
    })
  });
};

/**
 * 交易概况
 * @returns {Promise<IAsyncResult<T>>}
 */
export const tradeOView = () => {
  return Fetch('/tradeReport/overview', {
    method: 'POST',
    body: JSON.stringify({
      selectType: 0
    })
  });
};

/**
 * 交易报表 近10日
 * @returns {Promise<IAsyncResult<T>>}
 */
export const tradeReport = () => {
  return Fetch('/tradeReport/page', {
    method: 'POST',
    body: JSON.stringify({
      selectType: 3
    })
  });
};

/**
 * 流量报表 近10日
 * @returns {Promise<IAsyncResult<T>>}
 */
export const flowReport = () => {
  return Fetch('/flow/page', {
    method: 'POST',
    body: JSON.stringify({
      selectType: 3
    })
  });
};

/**
 * 交易趋势 近10日
 * @returns {Promise<IAsyncResult<T>>}
 */
export const tradeTrend = () => {
  return Fetch('/tradeReport/list', {
    method: 'POST',
    body: JSON.stringify({
      selectType: 3
    })
  });
};

/**
 * 流量趋势 近10日
 * @returns {Promise<IAsyncResult<T>>}
 */
export const flowTrend = () => {
  return Fetch('/flow/list', {
    method: 'POST',
    body: JSON.stringify({
      selectType: 3
    })
  });
};

/**
 * 客户增长报表
 * @returns {Promise<IAsyncResult<T>>}
 */
export const customerGrowReport = () => {
  return Fetch('/customer_grow/page', {
    method: 'POST',
    body: JSON.stringify({
      dateCycle: 4,
      pageNum: 1,
      pageSize: 10
    })
  });
};

/**
 * 客户增长趋势图
 * @returns {Promise<IAsyncResult<T>>}
 */
export const customerGrowTrend = () => {
  return Fetch('/customer_grow/trend', {
    method: 'POST',
    body: JSON.stringify({
      queryDateCycle: 4,
      weekly: false
    })
  });
};

/**
 * 客户订货排行TOP10
 * @returns {Promise<IAsyncResult<T>>}
 */
export const customerTop10 = () => {
  return Fetch('/customer_report/order', {
    method: 'POST',
    body: JSON.stringify({
      pageNum: 1,
      queryType: 0,
      pageSize: 10,
      dateCycle: 0
    })
  });
};

/**
 * 今日客户概况
 * @returns {Promise<IAsyncResult<T>>}
 */
export const customerOView = () => {
  return Fetch('/customer_grow/page', {
    method: 'POST',
    body: JSON.stringify({
      dateCycle: 0,
      pageNum: 1,
      pageSize: 1
    })
  });
};

/**
 * 业务员业绩排行TOP10
 * @returns {Promise<IAsyncResult<T>>}
 */
export const employeeTop10 = () => {
  return Fetch('/view/employee/performance', {
    method: 'POST',
    body: JSON.stringify({
      companyId: '0',
      dataCycle: 'today',
      sort: 'ORDER_AMT_DESC',
      pageNo: '1',
      pageSize: '10'
    })
  });
};

/**
 * 流量概况
 * @returns {Promise<IAsyncResult<T>>}
 */
export const flowOview = () => {
  return Fetch('/flow/page', {
    method: 'POST',
    body: JSON.stringify({
      selectType: 0
    })
  });
};

/**
 * 店铺流量排行Top10
 */
export function getStorePageData() {
  let requestJson = {
    selectType: 3,
    pageNum: 1,
    pageSize: 10,
    sortName: 'totalPv',
    sortOrder: 'DESC'
  };
  return Fetch<TResult>('/flow/store', {
    method: 'POST',
    //companyID为真时，传该字段，否则不传
    body: JSON.stringify({ ...requestJson })
  });
}

/**
 * 店铺交易排行Top10
 */
export const getTradeStorePage = () => {
  const params = {
    selectType: 3,
    isWeek: false,
    pageNum: 1,
    pageSize: 10,
    sortName: 'orderAmt',
    sortOrder: 'DESC'
  };
  return Fetch<TResult>('/tradeReport/store', {
    method: 'POST',
    body: JSON.stringify(params)
  });
};
