/**
 * Created by feitingting on 2017/10/16.
 */
import { Actor, Action, IMap } from 'plume2';
import { fromJS, Map } from 'immutable';

export default class CustomerStatisticsActor extends Actor {
  defaultState() {
    return {
      viewData: {},
      pageData: {},
      dateRange: {},
      chartData: [],
      multiPageData: {},
      customerLevels: {},
      firstPageSize: 10,
      secondPageSize: 10,
      queryType: 0,
      weekly: false,
      firstSortedInfo: Map({ columnKey: 'baseDate', order: 'descend' }),
      secondSortedInfo: Map({ columnKey: 'amount', order: 'descend' }),
      allShops: [],
      //平台为null
      companyId: null,
      dayChoice: 0,
      currentDayChoice: 0,
      chartType: 1
    };
  }

  @Action('customer:getViewData')
  getViewData(state: IMap, data) {
    return state.set('viewData', fromJS(data));
  }

  @Action('customer:setDateRange')
  setDateRange(state: IMap, data) {
    return state.set('dateRange', fromJS(data));
  }

  @Action('customer:getPageData')
  getPageData(state: IMap, data) {
    return state.set('pageData', fromJS(data));
  }

  @Action('customer:getMultiPageData')
  getMultiPageData(state: IMap, data) {
    return state.set('multiPageData', fromJS(data));
  }

  @Action('customer:getChartData')
  getChartData(state: IMap, data) {
    return state.set('chartData', fromJS(data));
  }

  @Action('customer:levelInit')
  levelInit(state: IMap, data) {
    return state.set('customerLevels', fromJS(data));
  }

  @Action('customer:setFirstPageSize')
  setFirstPageSize(state: IMap, data) {
    return state.set('firstPageSize', fromJS(data));
  }

  @Action('customer:setSecondPageSize')
  setSecondPageSize(state: IMap, data) {
    return state.set('secondPageSize', fromJS(data));
  }

  @Action('customer:setQueryType')
  setQueryType(state: IMap, data) {
    return state.set('queryType', fromJS(data));
  }

  @Action('customer:setChartWeekly')
  setChartWeekly(state: IMap, data) {
    return state.set('weekly', fromJS(data));
  }

  @Action('customer:setFirstSortedInfo')
  setFirstPageSortedInfo(state: IMap, data) {
    let sortedInfo = data;
    if (!sortedInfo.columnKey) {
      sortedInfo = { columnKey: 'baseDate', order: 'descend' };
    }
    return state.set('firstSortedInfo', fromJS(sortedInfo));
  }

  @Action('customer:setSecondSortedInfo')
  setSecondSortedInfo(state: IMap, data) {
    let sortedInfo = data;
    if (!sortedInfo.columnKey) {
      sortedInfo = { columnKey: 'amount', order: 'descend' };
    }
    return state.set('secondSortedInfo', fromJS(sortedInfo));
  }

  @Action('customer:shopList')
  shopList(state, shoplist: any) {
    let shopArray = new Array();
    shoplist.toJS().map((v) => {
      shopArray.push(v);
    });
    return state.set('allShops', shopArray);
  }

  /**
   * 筛选店铺
   * @param state
   * @param id
   */
  @Action('customer:companyId')
  companyId(state, id: any) {
    return state.set('companyId', id);
  }

  @Action('customer:dayChoice')
  dayChoice(state, value) {
    return state.set('dayChoice', value);
  }

  @Action('customer:chartType')
  chartType(state, value) {
    return state.set('chartType', value);
  }
}
