import { IOptions, Store } from 'plume2';
import AddOperations from './actor/add-operations';
import { fromJS } from 'immutable';
import moment from 'moment';
import { Const, history } from 'qmkit';
import { message, Modal } from 'antd';
import * as webapi from './webapi';
const info = Modal.info;
export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new AddOperations()];
  }

  init = async (params) => {
    const { id, ifModify } = params;
    if (id) {
      this.setData({
        id,
        ifModify: +ifModify,
        ifEdit: true
      });
      let res = null;
      if (/^activityId.*/.test(id)) {
        let activityId = id.split('-')[1];
        res = (await webapi.customerPlanActivity(activityId)).res as any;
      } else {
        res = (await webapi.customerPlan(id)).res as any;
      }
      if (res.code === Const.SUCCESS_CODE) {
        const {
          couponInfoList,
          customerPlanCouponList,
          customerPlanVO: {
            appPushFlag,
            couponFlag,
            customerLimit,
            customerLimitFlag,
            giftPackageTotal,
            planName,
            pointFlag,
            points,
            receiveValue,
            smsFlag,
            triggerConditions,
            triggerFlag,
            startDate,
            endDate,
            couponDiscount
          },
          planAppPush,
          planSms
        } = res.context;
        this.setData({
          operationForm: {
            appPushFlag,
            couponFlag,
            customerLimit,
            customerLimitFlag: +customerLimitFlag,
            giftPackageTotal,
            planName,
            pointFlag,
            points,
            receiveValue,
            smsFlag,
            triggerConditions: triggerConditions[0],
            triggerFlag: +triggerFlag,
            startDate,
            endDate,
            couponDiscount
          },
          planSms
        });
        this.getCustomerTotal([receiveValue]);
        this.initCouponList(couponInfoList, customerPlanCouponList);
        this.initAppPush(planAppPush);
      }
    }
    this.getCustomerGroupList();
    this.getPassedSignList();
    this.getSalePassedTemplateList();
  };

  /**
   * ????????????????????????
   */
  initCouponList = async (couponInfoList, customerPlanCouponList) => {
    let coupons = customerPlanCouponList.map((item) => {
      let coupon = {} as any;
      const couponInfo = couponInfoList.find(
        (info) => info.couponId == item.couponId
      );
      // 2.2.1.?????????????????????
      coupon = couponInfo;
      coupon.totalCount = item.giftCount;
      // 2.2.2.??????
      coupon.denominationStr =
        couponInfo.fullBuyType == 0
          ? `???0???${couponInfo.denomination}`
          : `???${couponInfo.fullBuyPrice}???${couponInfo.denomination}`;
      // 2.2.3.?????????
      if (couponInfo.rangeDayType == 0) {
        // ???????????????
        let startTime = moment(couponInfo.startTime)
          .format(Const.DAY_FORMAT)
          .toString();
        let endTime = moment(couponInfo.endTime)
          .format(Const.DAY_FORMAT)
          .toString();
        coupon.validity = `${startTime}???${endTime}`;
      } else {
        // ???N?????????
        coupon.validity = `????????????${couponInfo.effectiveDays}????????????`;
      }
      return coupon;
    });
    this.setInnerData(['activity', 'coupons'], coupons);
  };

  setInnerData = (router, value) => {
    this.dispatch('set:state:inner', { router, value });
  };

  getCustomerGroupList = async ({ groupName } = { groupName: '' }) => {
    let param = { groupName: groupName, limit: 100 };
    const { res } = (await webapi.customerGroupList(param)) as any;
    if (res.code === Const.SUCCESS_CODE) {
      this.dispatch('set:state', {
        field: 'customerGroupList',
        value: res.context
      });
    }
  };

  getSalePassedTemplateList = async () => {
    const { res } = (await webapi.smsTemplatePage({
      templateType: 2,
      reviewStatus: 1,
      pageNum: 0,
      pageSize: 100
    })) as any;
    if (res.code === Const.SUCCESS_CODE) {
      this.dispatch('set:state', {
        field: 'salePassedTemplateList',
        value: res.context.smsTemplateVOPage.content
      });
    }
  };

  getPassedSignList = async () => {
    const { res } = (await webapi.smsSignPage({
      reviewStatus: 1,
      pageNum: 0,
      pageSize: 100
    })) as any;
    if (res.code === Const.SUCCESS_CODE) {
      this.dispatch('set:state', {
        field: 'passedSignList',
        value: res.context.smsSignVOPage.content
      });
    }
  };

  smsSend = async (values) => {
    const { signId, templateCode, signName, templateContent } = values;
    this.setData({
      planSms: {
        signId,
        templateCode,
        signName: signName.replace(/???(.*)???/g, '$1'),
        templateContent
      },
      sendModalVisible: false
    });
  };

  initAppPush = (planAppPush) => {
    let imageUrl = [];
    if (planAppPush && planAppPush.coverUrl) {
      imageUrl = [
        {
          uid: 1,
          name: planAppPush.coverUrl,
          size: 1,
          status: 'done',
          url: planAppPush.coverUrl
        }
      ];
    }
    this.setData({
      planAppPush,
      imageUrl
    });
  };

  saveAppPush = (values) => {
    let imageUrl = this.state().get('imageUrl');
    let coverUrl = null;
    if (imageUrl) {
      imageUrl = imageUrl.toJS();
      console.log('imagurl', imageUrl);
      if (imageUrl.length > 0 && imageUrl[0].url) {
        coverUrl = imageUrl[0].url;
      }
    }

    this.setData({
      planAppPush: { ...values, coverUrl },
      appPushModalVisible: false
    });
  };

  /**
   * ??????????????????
   */
  changeFormField = (params) => {
    this.dispatch('change: form: field', fromJS(params));
  };

  /**
   * ????????????????????????
   * @param index ?????????????????????????????????
   * @param totalCount ??????????????????
   */
  changeCouponTotalCount = (index, totalCount) => {
    this.dispatch('change: coupon: total: count', { index, totalCount });
  };

  /**
   * ?????????????????????
   */
  onChosenCoupons = (coupons) => {
    this.dispatch('choose: coupons', fromJS(coupons));
  };

  /**
   * ???????????????
   */
  onDelCoupon = (couonId) => {
    this.dispatch('del: coupon', couonId);
  };

  /**
   * ??????/???????????????
   */
  saveOperation = async (values) => {
    const {
      appPushFlag,
      couponFlag,
      customerLimit,
      customerLimitFlag = false,
      giftPackageTotal,
      planName,
      pointFlag,
      points,
      receiveValue,
      smsFlag,
      triggerConditions,
      triggerFlag,
      timeRange
    } = values;
    let activity = this.state()
      .get('activity')
      .toJS();
    let couponList = activity.coupons;
    let couponDiscount = 0;
    if (couponFlag && (couponList === null || couponList.length === 0)) {
      message.error('??????????????????');
      return;
    }
    const planCouponList = couponList.map((item) => {
      couponDiscount += item.denomination * item.totalCount;
      return {
        couponId: item.couponId,
        giftCount: item.totalCount
      };
    });
    let [start, end] = timeRange;
    let startDate = start.format('YYYY-MM-DD');
    let endDate = end.format('YYYY-MM-DD');
    const planAppPush = this.state().get('planAppPush');
    const planSms = this.state().get('planSms');
    if (smsFlag && (planSms === null || planSms === undefined)) {
      message.error('???????????????');
      return;
    }

    if (
      appPushFlag &&
      (planAppPush === null ||
        planAppPush === undefined ||
        planAppPush.get('name') === null ||
        planAppPush.get('noticeText') === null)
    ) {
      message.error('?????????App Push');
      return;
    }

    if (customerLimit && customerLimit > giftPackageTotal) {
      message.error('????????????????????????????????????????????????');
      return;
    }
    if (!couponFlag && !pointFlag) {
      message.error('???????????????????????????');
      return;
    }

    // 2.???????????????
    let params = {} as any;
    params = {
      smsFlag: +smsFlag,
      appPushFlag: +appPushFlag,
      pointFlag: +pointFlag,
      couponFlag: +couponFlag,
      triggerFlag: +triggerFlag,
      customerLimitFlag: +customerLimitFlag,
      triggerConditions: triggerConditions ? [triggerConditions + ''] : null,
      customerLimit,
      giftPackageTotal,
      planName,
      points,
      receiveValue,
      startDate,
      endDate,
      couponDiscount,
      planCouponList,
      planAppPush: planAppPush ? planAppPush.toJS() : null,
      planSms: planSms ? planSms.toJS() : null,
      receiveType: 2
    };
    // 3.??????
    let res = null;
    const ifEdit = this.state().get('ifEdit');
    if (ifEdit) {
      params.id = this.state().get('id');
      res = await webapi.customerPlanModify(params);
    } else {
      res = await webapi.customerPlanAdd(params);
    }
    res = res.res;
    if (res.code == Const.SUCCESS_CODE) {
      message.success(ifEdit ? '????????????' : '????????????');
      history.push({
        pathname: '/customer-plan-list'
      });
    } else if (res.code == 'K-080106') {
      this.dispatch('set: invalid: coupons', fromJS(res.errorData));
      info({
        content: `${res.errorData.length}???????????????????????????????????????????????????????????????????????????????????????????????????`,
        okText: '??????'
      });
    } else if (res.code == 'K-080104') {
      this.dispatch('set: invalid: coupons', fromJS(res.errorData));
      info({
        content: `${res.errorData.length}?????????????????????????????????????????????`,
        okText: '??????'
      });
    } else {
      message.error(res.message);
    }
  };

  setData = (params) => {
    const keys = Object.keys(params);
    for (let key of keys) {
      this.dispatch('set:state', { field: key, value: params[key] });
    }
  };

  getCustomerTotal = async (customerGroup) => {
    const { res } = (await webapi.customerTotal(customerGroup)) as any;
    if (res.code === Const.SUCCESS_CODE) {
      this.setData({ customerTotal: res.context });
    }
  };
}
