import { Actor, Action } from 'plume2';
import { fromJS } from 'immutable';
import moment from 'moment';
import { Const } from 'qmkit';

export default class CouponInfoActor extends Actor {
  defaultState() {
    return {
      // 优惠券Id
      couponId: '',
      // 优惠券名称
      couponName: '',
      // 优惠券类型 0通用券 1运费券 2店铺券
      couponType: '',
      // 选中的优惠券分类
      couponCateIds: [],
      // 起止时间类型 0：按起止时间，1：按N天有效
      rangeDayType: 0,
      // 优惠券开始时间
      startTime: '',
      // 优惠券结束时间
      endTime: '',
      // 有效天数
      effectiveDays: '',
      // 优惠券分类
      couponCates: [],
      // 优惠券面值
      denomination: null,
      // 购满类型 0：无门槛，1：满N元可使用
      fullBuyType: 1,
      // 购满多少钱
      fullBuyPrice: null,
      // 营销类型(0,1,2,3) 0全部商品，1品牌，2平台类目/店铺分类，3自定义货品（店铺可用）
      scopeType: 0,
      // 分类
      cates: [],
      // 品牌
      brands: [],
      // 选择的品牌
      chooseBrandIds: [],
      // 选择的分类
      chooseCateIds: [],
      // 优惠券说明
      couponDesc: '',
      // 按钮禁用
      btnDisabled: false,
      // 聚合给选择分类使用
      reducedCateIds: []
    };
  }

  /**
   * 键值设置
   * @param state
   * @param param1
   */
  @Action('coupon: info: field: value')
  fieldsValue(state, { field, value }) {
    return state.set(field, fromJS(value));
  }

  /**
   * 修改时间区间
   * @param state
   * @param param1
   */
  @Action('coupon: info: date: range')
  changeDateRange(state, { startTime, endTime }) {
    return state.set('startTime', startTime).set('endTime', endTime);
  }

  /**
   * 存储优惠券信息
   * @param state
   * @param params
   */
  @Action('coupon: info: data')
  fetchCouponInfo(state, params) {
    const {
      cateIds,
      couponDesc,
      couponId,
      couponName,
      couponType,
      denomination,
      effectiveDays,
      endTime,
      fullBuyPrice,
      fullBuyType,
      rangeDayType,
      scopeIds,
      scopeType,
      startTime
    } = params;
    state = state
      .set('couponCateIds', fromJS(cateIds))
      .set('couponName', couponName)
      .set('couponId', couponId)
      .set('couponType', couponType)
      .set('denomination', denomination)
      .set('effectiveDays', effectiveDays)
      .set('endTime', endTime ? moment(endTime).format(Const.DAY_FORMAT) : '')
      .set('fullBuyPrice', fullBuyPrice)
      .set('fullBuyType', fullBuyType)
      .set('rangeDayType', rangeDayType)
      .set('scopeType', scopeType)
      .set(
        'startTime',
        startTime ? moment(startTime).format(Const.DAY_FORMAT) : ''
      )
      .set('couponDesc', couponDesc);
    if (scopeType === 1) {
      state = state.set('chooseBrandIds', fromJS(scopeIds));
    } else if (scopeType === 2) {
      state = state.set('chooseCateIds', fromJS(scopeIds));
    }
    return state;
  }

  /**
   * 改变按钮禁用状态
   * @param state
   * @returns {any}
   */
  @Action('coupon: info: btn: disabled')
  changeBtnDisabled(state) {
    return state.set('btnDisabled', !state.get('btnDisabled'));
  }

  /**
   * 聚合存储分类Ids
   *
   * @param {*} state
   * @param {*} cates
   * @returns
   * @memberof CouponInfoActor
   */
  @Action('coupon: info: cates')
  fetchCates(state, cates) {
    const second = fromJS(cates)
      .flatMap((f) => f.get('goodsCateList'))
      .map((m) => {
        const cId = m.get('cateId');
        return fromJS({
          cateParentId: m.get('cateParentId'),
          cateId: cId,
          cateIds: m
            .get('goodsCateList')
            .map((b) => b.get('cateId'))
            .push(cId)
        });
      });
    let first = fromJS([]);
    second.forEach((m) => {
      const cId = m.get('cateParentId');
      let firstCate = first.find((f) => f.get('cateId') === cId);
      if (!firstCate) {
        first = first.push(
          fromJS({
            cateId: m.get('cateParentId'),
            cateIds: m.get('cateIds').push(cId)
          })
        );
      } else {
        const index = first.findIndex(
          (f) => f.get('cateId') == firstCate.get('cateId')
        );
        firstCate = firstCate.set(
          'cateIds',
          firstCate
            .get('cateIds')
            .push(m.get('cateId'))
            .concat(m.get('cateIds'))
            .toSet()
            .toList()
        );
        first = first.set(index, firstCate);
      }
    });
    second.concat(first).map((m) =>
      fromJS({
        cateId: m.get('cateId'),
        cateIds: m.get('cateIds')
      })
    );
    return state
      .set(
        'reducedCateIds',
        second.concat(first).map((m) =>
          fromJS({
            cateId: m.get('cateId'),
            cateIds: m.get('cateIds')
          })
        )
      )
      .set('cates', fromJS(cates));
  }
}
