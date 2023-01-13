import { IOptions, Store } from 'plume2';
import PointsCouponActor from './actor/points-coupon-actor';
import { Const, history, QMMethod } from 'qmkit';
import { message } from 'antd';
import { fromJS } from 'immutable';
import { addPointsCoupons } from './webapi';
import CouponActor from './actor/coupon-actor';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      window['_store'] = this;
    }
  }

  bindActor() {
    return [new PointsCouponActor(), new CouponActor()];
  }

  /**
   * 初始化
   */
  init = async () => {};

  /**
   * 修改时间区间
   */
  changeDateRange = ({ startTime, endTime }) => {
    this.dispatch('goods: info: date: range', {
      startTime,
      endTime
    });
  };

  /**
   * 批量选择优惠券
   */
  onChosenCoupons = (coupons) => {
    this.dispatch('choose: coupons', fromJS(coupons));
  };

  /**
   * 删除优惠券
   */
  onDelCoupon = (couonId) => {
    this.dispatch('del: coupon', couonId);
  };

  /**
   * 变更商品各个字段信息
   */
  onCouponChange = ({ couponId, field, value }) => {
    this.dispatch('modalActor: change:coupons', { couponId, field, value });
  };

  doAdd = QMMethod.onceFunc(async () => {
    let result: any;
    let pointsCoupons = new Array();
    const { activity, startTime, endTime } = this.state().toJS();
    activity.coupons.map((coupon) => {
      pointsCoupons.push({
        couponId: coupon.couponId,
        totalCount: coupon.convertStock,
        points: coupon.convertPoints
      });
    });
    result = await addPointsCoupons({
      pointsCouponAddRequestList: pointsCoupons,
      beginTime: startTime,
      endTime: endTime
    });
    if (result.res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      // 刷新
      history.push({
        pathname: '/points-goods-list',
        state: { key: '2' }
      });
    } else {
      message.error(result.res.message);
    }
  }, 1000);
}
