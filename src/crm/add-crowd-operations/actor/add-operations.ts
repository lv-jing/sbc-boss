import { Actor, Action } from 'plume2';
import { fromJS } from 'immutable';

export default class AddOperations extends Actor {
  defaultState() {
    return {
      ifModify: 1,
      ifEdit: false,
      sendModalVisible: false,
      // 优惠券活动信息
      activity: {
        // 选择的优惠券
        coupons: [],
        // 无效的优惠券
        invalidCoupons: []
      },
      operationForm: {
        appPushFlag: 0,
        couponDiscount: 0,
        couponFlag: 0,
        customerLimit: null,
        customerLimitFlag: 0,
        endDate: '',
        giftPackageTotal: '',
        planCouponList: [],
        planName: '',
        pointFlag: 0,
        points: null,
        receiveType: 2,
        receiveValue: null,
        smsFlag: 0,
        startDate: null,
        triggerConditions: [],
        triggerFlag: 0
      },
      customerGroupList: [],
      coupons: [],
      invalidCoupons: [],
      salePassedTemplateList: [],
      passedSignList: [],
      planSms: null,
      planAppPush: {
        name: null,
        noticeContext: null,
        noticeTitle: null,
        coverUrl: null
      },
      customerTotal: 0,
      smsNum: 1,
      appPushModalVisible: false
    };
  }

  @Action('set:state')
  setState(state, { field, value }) {
    return state.set(field, fromJS(value));
  }

  @Action('set:state:inner')
  setStateInner(state, { router, value }) {
    return state.setIn(router, fromJS(value));
  }
  /**
   *  编辑时的初始化
   */
  @Action('edit: init')
  editInit(state, activity) {
    return state.set('activity', activity);
  }

  /**
   * 修改表单信息
   */
  @Action('change: form: field')
  changeFormField(state, params) {
    return state.update('activity', (activity) => activity.merge(params));
  }

  /**
   * 选择优惠券
   */
  @Action('choose: coupons')
  onChosenCoupons(state, coupons) {
    coupons = coupons.map((coupon) => {
      if (!coupon.get('totalCount')) coupon = coupon.set('totalCount', 1);
      return coupon;
    });
    return state.setIn(['activity', 'coupons'], coupons);
  }

  /**
   * 删除优惠券
   */
  @Action('del: coupon')
  onDelCoupon(state, couponId) {
    return state.updateIn(['activity', 'coupons'], (coupons) =>
      coupons.filter((coupon) => coupon.get('couponId') != couponId)
    );
  }

  /**
   * 设置无效的优惠券
   */
  @Action('set: invalid: coupons')
  setInvalidCoupons(state, invalidCoupons) {
    return state.setIn(['activity', 'invalidCoupons'], invalidCoupons);
  }

  /**
   * 修改优惠券总张数
   * @param index 修改的优惠券的索引位置
   * @param totalCount 优惠券总张数
   */
  @Action('change: coupon: total: count')
  changeCouponTotalCount(state, { index, totalCount }) {
    return state.setIn(
      ['activity', 'coupons', index, 'totalCount'],
      totalCount
    );
  }
}
