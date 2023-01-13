import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';
import UUID from 'uuid-js';

export default class FormActor extends Actor {
  defaultState() {
    return {
      // 是否开启社交分销
      openFlag: false,
      // 基础设置
      basic: {
        // 分销员名称
        distributorName: '',
        // 是否开启分销小店 0：关闭，1：开启
        shopOpenFlag: false,
        // 小店名称
        shopName: '',
        // 店铺分享图片
        shopShareImg: [],
        // 是否开启分销商品审核 0：关闭，1：开启
        goodsAuditFlag: false,
        // 分销业绩规则说明
        performanceDesc: ''
      },
      // 分销员招募设置
      recruit: {
        // 是否开启申请入口 0：关闭，1：开启
        applyFlag: false,
        // 申请条件 0：购买商品，1：邀请注册
        applyType: 0,
        //购买商品时招募入口海报页
        buyRecruitEnterImg: [],
        //邀请注册时招募入口海报页
        inviteRecruitEnterImg: [],
        //邀请注册时招募落地页
        inviteRecruitImg: [],
        // 购买商品时时招募落地页
        recruitImg: [],
        // 招募邀新转发图片
        recruitShareImg: [],
        // 招募规则说明
        recruitDesc: '',
        // 邀请人数
        inviteCount: 0,
        // 限制条件 0：不限，1：仅限有效邀新
        limitType: 0,
        // 礼包商品ids
        goodsInfoIds: [],
        // 商品弹框可见性
        goodsModalVisible: false,
        // 选择的具体商品信息
        goodsRows: []
      },
      // 奖励模式设置
      reward: {
        // 是否开启分销佣金 0：关闭，1：开启
        commissionFlag: false,
        // 是否开启邀新奖励 0：关闭，1：开启
        inviteFlag: 0,
        // 招募海报
        inviteImg: [],
        // 邀新转发图片
        inviteShareImg: [],
        // 邀新奖励规则说明
        inviteDesc: '',
        //邀新注册入口海报
        inviteEnterImg: [],
        // 限制条件 0：不限，1：仅限有效邀新 ..
        rewardLimitType: 0,
        // 是否开启奖励现金 0：关闭，1：开启
        rewardCashFlag: false,
        // 每位奖励金额
        rewardCash: 0,
        // 奖励上限类型 0：不限， 1：限人数
        rewardCashType: 0,
        // 奖励现金上限(人数)
        rewardCashCount: 0,
        // 是否开启奖励优惠券 0：关闭，1：开启
        rewardCouponFlag: false,
        // 奖励优惠券上限(组数)
        rewardCouponCount: 0,
        // 选择的优惠券
        coupons: []
      },
      // 多级分销设置
      multistage: {
        // 佣金提成脱钩
        commissionUnhookType: 0,
        // 分销员等级规则
        distributorLevelDesc: '',
        // 分销员等级列表
        distributorLevels: []
      },
      // 其它交互相关信息
      loading: true
    };
  }

  constructor() {
    super();
  }

  /**
   * 初始化
   */
  @Action('setting:init')
  init(state: IMap, { openFlag, basic, recruit, reward, multistage }) {
    return state
      .set('openFlag', openFlag)
      .set('basic', basic)
      .set('recruit', recruit)
      .set('reward', reward)
      .set('multistage', multistage)
      .set('loading', false);
  }

  /**
   * 删除选择的sku
   */
  @Action('setting:delete:sku')
  deleteSelectSku(state, skuId) {
    let goodsRows = state.getIn(['recruit', 'goodsRows']);
    let goodsInfoIds = state.getIn(['recruit', 'goodsInfoIds']);
    goodsInfoIds = goodsInfoIds.splice(
      goodsInfoIds.findIndex((item) => item == skuId),
      1
    );
    goodsRows = goodsRows.delete(
      goodsRows.findIndex((row) => row.get('goodsInfoId') == skuId)
    );
    return state.update('recruit', (recruit) =>
      recruit.set('goodsRows', goodsRows).set('goodsInfoIds', goodsInfoIds)
    );
  }

  /**
   * 键值设置
   */
  @Action('setting:fields:value')
  fieldsValue(state, { field, value }) {
    return state.setIn(field, fromJS(value));
  }

  /**
   * 选择优惠券
   */
  @Action('setting:choose:coupons')
  onChosenCoupons(state, coupons) {
    coupons = coupons.map((coupon) => {
      if (!coupon.get('totalCount')) coupon = coupon.set('totalCount', 1);
      return coupon;
    });
    return state.setIn(['reward', 'coupons'], coupons);
  }

  /**
   * 删除优惠券
   */
  @Action('setting:del:coupon')
  onDelCoupon(state, couponId) {
    return state.updateIn(['reward', 'coupons'], (coupons) =>
      coupons.filter((coupon) => coupon.get('couponId') != couponId)
    );
  }

  /**
   * 修改优惠券总张数
   * @param index 修改的优惠券的索引位置
   * @param totalCount 优惠券总张数
   */
  @Action('setting:coupon:count')
  changeCouponTotalCount(state, { index, totalCount }) {
    return state.setIn(['reward', 'coupons', index, 'totalCount'], totalCount);
  }

  /**
   * 修改分销员等级值
   */
  @Action('change:distributor:level:value')
  changeDistributorLevelValue(state, { index, key, value }) {
    return state.setIn(
      ['multistage', 'distributorLevels', index - 1, key],
      value
    );
  }

  /**
   * 新增分销员等级
   */
  @Action('add:distributor:level')
  addDistributorLevel(state) {
    let sort = state.getIn(['multistage', 'distributorLevels']).size;
    return state.updateIn(['multistage', 'distributorLevels'], (levels) =>
      levels.push(
        fromJS({
          sort: sort + 1,
          mockId: UUID.create().toString()
        })
      )
    );
  }

  /**
   * 删除分销员等级
   */
  @Action('remove:distributor:level')
  removeDistributorLevel(state) {
    return state.updateIn(['multistage', 'distributorLevels'], (levels) =>
      levels.pop()
    );
  }
}
