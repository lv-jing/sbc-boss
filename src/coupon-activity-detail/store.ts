import { Store } from 'plume2';

import { Const } from 'qmkit';
import { message } from 'antd';
import { fromJS } from 'immutable';
import moment from 'moment';

import * as webapi from './webapi';
import CouponActivityDetailActor from './actor/coupon-activity.actor';

export default class AppStore extends Store {
  constructor(props) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new CouponActivityDetailActor()];
  }

  init = async (id) => {
    const { res } = await webapi.activityDetail(id);
    if (res.code != Const.SUCCESS_CODE) {
      message.error(res.message);
    }
    //拼装页面需要展示的参数 couponInfoList
    let {
      couponInfoList,
      couponActivityConfigList,
      couponActivity,
      customerDetailVOS
    } = res.context;
    couponInfoList = couponInfoList.map((item) => {
      if (item.rangeDayType == 0) {
        item.time =
          moment(item.startTime)
            .format(Const.TIME_FORMAT)
            .toString() +
          '至' +
          moment(item.endTime)
            .format(Const.TIME_FORMAT)
            .toString();
      } else {
        item.time = `领取当天${item.effectiveDays}日内有效`;
      }
      if (item.fullBuyType == 0) {
        item.price = `满0元减${item.denomination}`;
      } else {
        item.price = `满${item.fullBuyPrice}元减${item.denomination}`;
      }
      const config = couponActivityConfigList.find(
        (config) => config.couponId == item.couponId
      );
      item.totalCount = config.totalCount;
      return item;
    });
    res.context.couponInfoList = couponInfoList;
    if (couponActivity.joinLevel == -2 && customerDetailVOS) {
      // 指定活动用户范围
      customerDetailVOS = customerDetailVOS.map((item) => {
        let customer = {} as any;
        customer.customerId = item.customerId;
        // 用户名
        customer.customerName = item.customerAccount;
        // 账号
        customer.customerAccount = item.customerAccount;
        return customer;
      });
      res.context.customerDetailVOS = customerDetailVOS;
    }
    this.dispatch('init', fromJS(res.context));
  };

  onTabChange = (key) => {
    this.dispatch('tab: change', key);
  };
}
