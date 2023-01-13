import { IOptions, Store } from 'plume2';

import { fromJS } from 'immutable';
import { Const, QMMethod, VASConst } from 'qmkit';
import { message } from 'antd';
import moment from 'moment';
import * as webapi from './webapi';
import CouponDetailActor from './actor/coupon-activity-list-actor';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new CouponDetailActor()];
  }

  init = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    const query = this.state()
      .get('form')
      .toJS();
    const queryTab = this.state().get('queryTab');
    if (query.joinLevel == -3) {
      query.joinLevel = null;
    }
    if (query.couponActivityType == -1) {
      query.couponActivityType = null;
    }
    const { res } = await webapi.activityList({
      ...query,
      queryTab,
      pageNum,
      pageSize
    });
    if (res.code != Const.SUCCESS_CODE) {
      message.error(res.message);
    }
    let activityList = res.context.content;
    const now = moment();
    activityList = activityList.map((item) => {
      //设置活动状态
      let pauseFlag;
      const flag = item.pauseFlag;
      if (item.startTime != null && item.endTime != null) {
        // 常规赠券活动有开始时间结束时间
        const startTime = moment(item.startTime);
        const endTime = moment(item.endTime);
        if (endTime.isBefore(now)) {
          pauseFlag = 4;
        } else if (startTime.isAfter(now)) {
          pauseFlag = 3;
        } else if (now.isBetween(startTime, endTime)) {
          if (flag == 1) {
            pauseFlag = 2;
          } else {
            pauseFlag = 1;
          }
        }
      } else if (item.couponActivityType == 4) {
        // 权益赠券活动
        if (flag == 1) {
          pauseFlag = 2;
        } else {
          pauseFlag = 1;
        }
      }
      item.pauseFlag = pauseFlag;
      return item;
    });
    // 查询平台客户等级
    let levelList = [];
    const levRes = await webapi.getUserLevelList();
    if (levRes.res.code != Const.SUCCESS_CODE) {
      message.error(levRes.res.message);
      return;
    }
    levelList = levRes.res.context.customerLevelVOList;
    this.dispatch('init: Level', fromJS(levelList));
    this.dispatch('init', {
      activityList: fromJS(activityList),
      total: res.context.totalElements,
      pageNum: pageNum + 1
    });
  };

  onTabChange = (key) => {
    this.dispatch('tab: change', key);
    this.init();
  };

  search = () => {
    this.init({ pageNum: 0, pageSize: 10 });
  };

  onFormFieldChange = (key, value) => {
    this.dispatch('form: field', { key, value });
  };

  /**
   * 删除活动
   */
  deleteActivity = async (id) => {
    const { res } = await webapi.deleteActivity(id);
    if (res.code != Const.SUCCESS_CODE) {
      message.error(res.message);
      return;
    }
    message.success('删除成功');
    //刷新页面
    this.init();
  };

  /**
   * 暂停活动
   */
  pauseActivity = async (id) => {
    const { res } = await webapi.pauseActivity(id);
    if (res.code != Const.SUCCESS_CODE) {
      message.error(res.message);
      return;
    }
    message.success('操作成功');
    this.dispatch('activity: pause', id);
  };

  /**
   * 开始活动
   */
  startActivity = async (id) => {
    const { res } = await webapi.startActivity(id);
    if (res.code != Const.SUCCESS_CODE) {
      message.error(res.message);
      return;
    }
    message.success('操作成功');
    this.dispatch('activity: start', id);
  };

  /**
   * 查询是否开启企业购业务
   */
  checkIEP = async () => {
    const res = await QMMethod.fetchVASStatus(VASConst.IEP);
    this.dispatch('checkIEPEnable: check', res);
  };
}
