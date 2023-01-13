/**
 * Created by feitingting on 2017/10/16.
 */

import { Store, IOptions } from 'plume2';
import { message } from 'antd';
import moment from 'moment';

import { Const } from 'qmkit';

import FlowStatisticsActor from './actor/flow-statistics-actor';
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
    const nowDay = moment(new Date())
      .format(Const.DAY_FORMAT)
      .toString();
    this.setDateRange(nowDay, nowDay, 0);
  };

  /**
   * 设置页面的时间范围
   *
   * @param startTime
   * @param endTime
   * @param dateCycle
   */
  setDateRange = (startTime, endTime, dateCycle) => {
    this.transaction(() => {
      this.dispatch('flow:setDateRange', {
        startTime: startTime,
        endTime: endTime,
        dateCycle: dateCycle
      });
      const weekly = this.state().get('weekly');
      const pageSize = this.state().get('pageSize');
      if (weekly) {
        if (this.getWeeklyDisplay(startTime, endTime)) {
          this.getFlowData(true);
        } else {
          this.setCurrentChartWeekly(false);
          this.getFlowData(false);
        }
      } else {
        this.getFlowData(false);
      }
      const sortedInfo = this.state()
        .get('sortedInfo')
        .toJS();
      if (this.state().get('tabKey') == 1) {
        this.getPageData(1, pageSize, sortedInfo.columnKey, sortedInfo.order);
      } else {
        this.getStorePageData(
          1,
          pageSize,
          sortedInfo.columnKey,
          sortedInfo.order
        );
      }
    });
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
    const { res } = await webapi.getPageData(
      dateCycle,
      pageNum,
      pageSize,
      sortName,
      sortType,
      this.state().get('companyId')
    );
    if (res && res.code == Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('flow:getPageData', res.context);
        this.dispatch('flow:setPageSize', pageSize);
        this.dispatch('flow:setSortedInfo', {
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
  getFlowData = async (isWeek) => {
    const { dateCycle } = this.state()
      .get('dateRange')
      .toJS();
    const { res } = await webapi.getFlowData(
      dateCycle,
      isWeek,
      this.state().get('companyId')
    );
    if (res && res.code == Const.SUCCESS_CODE) {
      this.dispatch('flow:getFlowData', res.context);
    } else {
      message.error(res.message);
    }
  };

  /**
   * 修改当前折线图表选择的是天，还是周
   * @param weekly
   */
  setCurrentChartWeekly = (weekly) => {
    this.dispatch('flow:setChartWeekly', weekly);
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
   * 按天和按店铺切换
   */
  changeTab = async (value: number) => {
    this.dispatch('flow:tabKey', value);
    if (value == 1) {
      //按天的报表
      await this.getPageData(
        1,
        this.state().get('pageSize'),
        'date',
        'descend'
      );
    } else {
      await this.getStorePageData(
        1,
        this.state().get('pageSize'),
        'totalPv',
        'descend'
      );
    }
  };

  /**
   * 店铺流量报表
   *
   * @param pageNum
   * @param pageSize
   * @param sortName
   * @param sortType
   * @returns {Promise<void>}
   */
  getStorePageData = async (pageNum, pageSize, sortName, sortType) => {
    const { dateCycle } = this.state()
      .get('dateRange')
      .toJS();
    const { res } = await webapi.getStorePageData(
      dateCycle,
      pageNum,
      pageSize,
      sortName,
      sortType,
      this.state().get('companyId')
    );
    if (res && res.code == Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('flow:getPageData', res.context);
        this.dispatch('flow:setPageSize', pageSize);
        this.dispatch('flow:setSortedInfo', {
          columnKey: sortName,
          order: sortType
        });
      });
    } else {
      message.error(res.message);
    }
  };

  /**
   * 筛选店铺
   * @param {string} id
   */
  setCompanyInfoId = (id: string) => {
    this.dispatch('flow:companyId', id);
    if (id != '1') {
      //筛选指定店铺时，不会出现按店铺,tab切换至按天
      this.dispatch('flow:tabKey', 1);
    }
    //刷新数据
    const { startTime, endTime, dateCycle } = this.state()
      .get('dateRange')
      .toJS();
    this.setDateRange(startTime, endTime, dateCycle);
  };
}
