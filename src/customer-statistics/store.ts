/**
 * Created by feitingting on 2017/10/16.
 */

import { IOptions, Store } from 'plume2';
import { message } from 'antd';
import moment from 'moment';
import { fromJS } from 'immutable';

import { Const } from 'qmkit';

import FlowStatisticsActor from './actor/customer-statistics-actor';
import * as webapi from './webapi';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new FlowStatisticsActor()];
  }

  /**
   * 初始化方法
   *
   * @returns {Promise<void>}
   */
  init = async () => {
    //客户分布概况（等级+地区）
    this.getViewData(0, 1);
    const today = moment()
      .format(Const.DAY_FORMAT)
      .toString();
    //设置时间段
    this.setDateRange(today, today, 0);
    //平台的，只有地区分布
    //获取店铺列表
    const { res } = await webapi.fetchStoreList();
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('customer:shopList', fromJS(res.context));
    }
  };

  /**
   * 获取客户概况的图表数据
   *
   * @param dayChoice
   * @param chartType
   * @returns {Promise<void>}
   */
  getViewData = async (dayChoice, chartType) => {
    const companyId = this.state().get('companyId');
    if (chartType === 0) {
      //等级分布
      webapi.getCustomerLevelData(dayChoice, null, companyId).then((result) => {
        const res = result.res;
        if (res && res.code == Const.SUCCESS_CODE) {
          this.dispatch('customer:getViewData', res.context);
        } else {
          message.error(res.message);
        }
      });
    } else {
      //地区分布
      const result = await webapi.getCustomerAreaData(
        dayChoice,
        null,
        companyId
      ); //获取地区数据
      const areaResult = result.res;
      if (areaResult && areaResult.code == Const.SUCCESS_CODE) {
        let totalCount = 0;
        //获取总数
        const totalCountResult = await webapi.getTotal(
          dayChoice,
          null,
          companyId
        ); //为了获取客户总数，total
        const totalCountRes = totalCountResult.res;
        if (totalCountRes && totalCountRes.code == Const.SUCCESS_CODE) {
          totalCount = totalCountRes.context as any;
        } else {
          message.error(totalCountRes.message);
        }
        let content = areaResult.context;
        (content as any).total = totalCount;
        this.dispatch('customer:getViewData', content);
      }
    }
    this.transaction(() => {
      this.dispatch('customer:dayChoice', dayChoice);
      this.dispatch('customer:chartType', chartType);
    });
  };

  /**
   * 设置页面的时间范围
   *
   * @param startTime
   * @param endTime
   */
  setDateRange = (startTime, endTime, dateCycle) => {
    this.transaction(() => {
      this.dispatch('customer:setDateRange', {
        startTime: startTime,
        endTime: endTime,
        dateCycle: dateCycle
      });
      const firstPageSize = this.state().get('firstPageSize');
      const secondPageSize = this.state().get('secondPageSize');
      const queryType = this.state().get('queryType');

      //获取折线图数据
      const weekly = this.state().get('weekly');
      if (weekly) {
        if (this.getWeeklyDisplay(startTime, endTime)) {
          this.getChartData(true);
        } else {
          this.setCurrentChartWeekly(false);
          this.getChartData(false);
        }
      } else {
        this.getChartData(false);
      }

      //获取分页数据
      const firstSortedInfo = this.state()
        .get('firstSortedInfo')
        .toJS();
      this.getPageData(
        1,
        firstPageSize,
        firstSortedInfo.columnKey,
        firstSortedInfo.order
      );

      //获取多表格数据
      const secondSortedInfo = this.state()
        .get('secondSortedInfo')
        .toJS();
      this.getMultiPageData(
        queryType,
        null,
        1,
        secondPageSize,
        secondSortedInfo.columnKey,
        secondSortedInfo.order
      );
    });
  };

  /**
   * 客户订货报表
   *
   * @param pageNum
   * @param pageSize
   * @param sortName
   * @param sortType
   * @returns {Promise<void>}
   */
  getMultiPageData = async (
    queryType,
    queryText,
    pageNum,
    pageSize,
    sortName,
    sortType
  ) => {
    const { dateCycle } = this.state()
      .get('dateRange')
      .toJS();
    const queryTypeStore = this.state().get('queryType');
    const pageSizeStore = this.state().get('pageSize');
    const companyId = this.state().get('companyId');
    const { res } = await webapi.getCustomerMultiPageData(
      queryType,
      dateCycle,
      queryText,
      pageNum,
      pageSize,
      sortName,
      sortType,
      companyId
    );
    if (res && res.code == Const.SUCCESS_CODE) {
      this.transaction(() => {
        if (queryTypeStore !== queryType) {
          this.dispatch('customer:setQueryType', queryType);
        }
        if (pageSizeStore !== pageSize) {
          this.dispatch('customer:setSecondPageSize', pageSize);
        }
        this.dispatch('customer:setSecondSortedInfo', {
          columnKey: sortName,
          order: sortType
        });
        this.dispatch('customer:getMultiPageData', res.context);
      });
    } else {
      message.error(res.message);
    }
  };

  /**
   * 获取分页table数据
   *
   * @param pageNum
   * @param pageSize
   * @param sortName
   * @param sortType
   * @returns {Promise<void>}
   */
  getPageData = async (pageNum, pageSize, sortName, sortType) => {
    const { dateCycle } = this.state()
      .get('dateRange')
      .toJS();
    const companyId = this.state().get('companyId');
    const { res } = await webapi.getCustomerPageData(
      dateCycle,
      pageNum,
      pageSize,
      sortName,
      sortType,
      companyId
    );
    if (res && res.code == Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('customer:getPageData', res.context);
        this.dispatch('customer:setFirstPageSize', pageSize);
        this.dispatch('customer:setFirstSortedInfo', {
          columnKey: sortName,
          order: sortType
        });
      });
    } else {
      message.error(res.message);
    }
  };

  /**
   * 获取流量概况和折线图的数据
   *
   * @param isWeek
   * @returns {Promise<void>}
   */
  getChartData = async (isWeek) => {
    const { dateCycle } = this.state()
      .get('dateRange')
      .toJS();
    const companyId = this.state().get('companyId');
    const { res } = await webapi.getCustomerChartData(
      dateCycle,
      isWeek,
      companyId
    );
    if (res && res.code == Const.SUCCESS_CODE) {
      this.dispatch('customer:getChartData', res.context);
    } else {
      message.error(res.message);
    }
  };

  /**
   * 修改当前折线图表选择的是天，还是周
   * @param weekly
   */
  setCurrentChartWeekly = (weekly) => {
    this.dispatch('customer:setChartWeekly', weekly);
  };

  /**
   * 获取周是否可以显示
   * @param startTime
   * @param endTime
   * @returns {boolean}
   */
  getWeeklyDisplay = (startTime, endTime) => {
    const startStamp = new Date(startTime).getTime();
    const endStamp = new Date(endTime).getTime();
    const range = endStamp - startStamp;
    if (range >= 0) {
      if (range > 8 * 24 * 60 * 60 * 1000) {
        return true;
      } else {
        return false;
      }
    }
  };

  /**
   * 店铺筛选
   * @param {string} id
   */
  setCompanyInfoId = (id: any) => {
    //多报表类型默认显示按客户查看
    this.transaction(() => {
      this.dispatch('customer:companyId', id);
      this.dispatch('customer:setQueryType', 0);
    });
    //数据刷新
    const { startTime, endTime, dateCycle } = this.state()
      .get('dateRange')
      .toJS();
    //客户概况刷新
    if (this.state().get('companyId')) {
      //默认显示等级分布
      this.dispatch('customer:chartType', 0);
      this.getViewData(
        this.state().get('dayChoice'),
        this.state().get('chartType')
      );
    } else {
      //默认显示地区分布
      this.dispatch('customer:chartType', 1);
      //无companyId时候，只调用地区
      this.getViewData(this.state().get('dayChoice'), 1);
    }
    //趋势图和列表刷新
    this.setDateRange(startTime, endTime, dateCycle);
  };
}
