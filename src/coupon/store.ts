import { Store } from 'plume2';

import { Const, history } from 'qmkit';
import { message, Modal } from 'antd';

import * as webApi from './webapi';
import CouponInfoActor from './actor/coupon-info-actor';

export default class AppStore extends Store {
  bindActor() {
    return [new CouponInfoActor()];
  }

  /**
   * 初始化信息
   */
  init = ({ couponType, cid }) => {
    if (cid) {
      this.fetchCouponInfo(cid);
    }
    this.fetchCouponCate();
    if (couponType) {
      this.fieldsValue({ field: 'couponType', value: couponType });
    }
  };

  /**
   * 查询优惠券信息
   */
  fetchCouponInfo = async (couponId) => {
    const { res } = (await webApi.fetchCoupon(couponId)) as any;
    if (res.code === Const.SUCCESS_CODE) {
      const { couponInfo } = res.context;
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
        scopeType,
        startTime
      } = couponInfo;
      const scopeIds = await this.fetchScope(scopeType, couponInfo.scopeIds);
      this.dispatch('coupon: info: data', {
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
      });
    }
  };

  /**
   * 查询优惠券分类
   */
  fetchCouponCate = async () => {
    const res = await webApi.fetchCouponCate();
    const { code, context } = res.res as any;
    if (code === Const.SUCCESS_CODE) {
      this.dispatch('coupon: info: field: value', {
        field: 'couponCates',
        value: context
      });
    }
  };

  /**
   * 存储键值
   */
  fieldsValue = ({ field, value }) => {
    this.dispatch('coupon: info: field: value', {
      field,
      value
    });
  };

  /**
   * 修改时间区间
   */
  changeDateRange = ({ startTime, endTime }) => {
    this.dispatch('coupon: info: date: range', {
      startTime,
      endTime
    });
  };

  /**
   * 修改商品选择范围
   */
  chooseScopeType = async (value) => {
    this.fetchScope(value);
    this.transaction(() => {
      this.dispatch('coupon: info: field: value', {
        field: 'scopeType',
        value
      });
      this.dispatch('coupon: info: field: value', {
        field: 'chooseBrandIds',
        value: []
      });
      this.dispatch('coupon: info: field: value', {
        field: 'chooseCateIds',
        value: []
      });
    });
  };

  /**
   * 新增优惠券
   */
  addCoupon = async () => {
    const params = this.fetchParams();
    const { res } = (await webApi.addCoupon(params)) as any;
    if (res.code === Const.SUCCESS_CODE) {
      message.success('新增优惠券成功!');
      history.push('/coupon-list');
    } else {
      this.changeBtnDisabled();
      return new Promise((resolve) => resolve(res));
    }
  };

  /**
   * 修改优惠券
   */
  editCoupon = async () => {
    let params = this.fetchParams();
    params.couponId = this.state().get('couponId');
    const { res } = (await webApi.editCoupon(params)) as any;
    if (res.code === Const.SUCCESS_CODE) {
      message.success('修改优惠券成功!');
      history.push('/coupon-list');
    } else {
      this.changeBtnDisabled();
      return new Promise((resolve) => resolve(res));
    }
  };

  /**
   * 查询范围值
   */
  fetchScope = async (value, scopeIds?) => {
    // 如果选择按品牌
    if (value === 1) {
      const { res } = await webApi.fetchBrands();
      const { code, context } = res as any;
      if (code === Const.SUCCESS_CODE) {
        //过滤已删除的品牌
        if (scopeIds) {
          scopeIds = scopeIds.filter((id) =>
            context.find((brand) => brand.brandId == id)
          );
        }
        this.dispatch('coupon: info: field: value', {
          field: 'brands',
          value: context
        });
      }
    } else if (value === 2) {
      // 如果选择按分类
      const { res } = await webApi.fetchCates();
      const { code, context } = res as any;
      if (code === Const.SUCCESS_CODE) {
        //过滤已删除的分类,后台返回的是树形结构！！！！
        if (scopeIds) {
          scopeIds = scopeIds.filter((id) =>
            context.find((levelOne) => {
              let flag = levelOne.cateId == id;
              if (!flag) {
                return levelOne.goodsCateList.find((levelTwo) => {
                  let flagTwo = levelTwo.cateId == id;
                  if (!flagTwo) {
                    return levelTwo.goodsCateList.find(
                      (levelThree) => levelThree.cateId == id
                    );
                  }
                  return flagTwo;
                });
              }
              return flag;
            })
          );
        }
        this.dispatch('coupon: info: cates', context);
      }
    }
    return scopeIds;
  };

  /**
   * 获取请求参数
   */
  fetchParams = () => {
    const {
      couponName,
      couponType,
      couponCateIds,
      rangeDayType,
      startTime,
      endTime,
      effectiveDays,
      denomination,
      fullBuyType,
      fullBuyPrice,
      scopeType,
      chooseBrandIds,
      chooseCateIds,
      couponDesc
    } = this.state().toJS();
    let params = {
      couponName,
      couponType,
      cateIds: couponCateIds,
      rangeDayType,
      denomination,
      fullBuyType,
      scopeType,
      couponDesc
    } as any;

    if (rangeDayType === 0) {
      params.startTime = startTime + ' 00:00:00';
      params.endTime = endTime + ' 23:59:59';
    } else if (rangeDayType === 1) {
      params.effectiveDays = effectiveDays;
    }

    if (fullBuyType === 1) {
      params.fullBuyPrice = fullBuyPrice;
    }

    if (scopeType === 0) {
      params.scopeIds = [];
    } else if (scopeType === 1) {
      params.scopeIds = chooseBrandIds;
    } else if (scopeType === 2) {
      params.scopeIds = chooseCateIds;
    }
    return params;
  };

  /**
   * 改变按钮禁用状态
   */
  changeBtnDisabled = () => {
    this.dispatch('coupon: info: btn: disabled');
  };

  dealErrorCode = async (res) => {
    const couponCates = this.state()
      .get('couponCates')
      .toJS();
    const errorIds = res.context;
    let errorsNames = couponCates.filter((cate) =>
      errorIds.find((id) => cate.couponCateId == id)
    );
    let errorsName = '';
    errorsNames.forEach((i) => {
      errorsName = errorsName + i.couponCateName + ',';
    });
    errorsName = errorsName.substring(0, errorsName.length - 1);
    let ids = this.state().get('couponCateIds');
    Modal.info({
      content: `${errorsName}优惠券分类不存在，请重新选择。`,
      okText: '好的'
    });
    ids = ids.filter((cate) => !errorIds.find((i) => i == cate));
    //删除不存在的分类id
    this.dispatch('coupon: info: field: value', {
      field: 'couponCateIds',
      value: ids
    });
    await this.fetchCouponCate();
    return new Promise((resolve) => resolve(ids));
  };
}
