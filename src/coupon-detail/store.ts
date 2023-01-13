import { Store } from 'plume2';
import CouponDetailActor from './actor/coupon-info-actor';
import * as webapi from './webapi';
import { Const } from 'qmkit';
// import actionType from "../login-interface/action-type";
import { message } from 'antd';
import { fromJS } from 'immutable';

export default class AppStore extends Store {
  bindActor() {
    return [new CouponDetailActor()];
  }

  /**
   * 初始化信息
   */

  init = async (couponId?: string) => {
    /**获取优惠券详细信息*/
    const { res } = await webapi.fetchCouponInfo(couponId);
    if (res.code == Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('coupon: detail: field: value', {
          field: 'couponCates',
          value: fromJS(
            res.context.couponInfo.cateNames.length == 0
              ? ['其他']
              : res.context.couponInfo.cateNames
          )
        });

        // 设置优惠券信息
        this.dispatch('coupon: detail: field: value', {
          field: 'coupon',
          value: fromJS(res.context.couponInfo)
        });
        // 设置商品品牌信息
        this.dispatch('coupon: detail: field: value', {
          field: 'skuBrands',
          value: fromJS(res.context.couponInfo.scopeNames)
        });
        // 设置商品分类信息
        this.dispatch('coupon: detail: field: value', {
          field: 'skuCates',
          value: fromJS(res.context.couponInfo.scopeNames)
        });
        // 设置商品列表
        this.dispatch('coupon: detail: field: value', {
          field: 'skus',
          value: fromJS(
            null == res.context.goodsList
              ? []
              : res.context.goodsList.goodsInfoPage.content
          ) // 设置商品列表
        });
        // 设置商品列表
        // this.dispatch('coupon: detail: field: value', {
        //     field: 'skus',
        //     value: [
        //         {
        //             skuId: '0',
        //             skuNo: 'P1234567',
        //             skuName: '博牌旅行包男士手提包韩版行李袋休闲女单肩健身包 蓝色',
        //             guige: '银色 128G',
        //             price: '1200000'
        //         },
        //         {
        //             skuId: '1',
        //             skuNo: 'P1234567',
        //             skuName: 'Apple iPhone 6 32GB 金色 移动联通电信4G手机',
        //             guige: '银色 128G',
        //             price: '120'
        //         },
        //         {
        //             skuId: '2',
        //             skuNo: 'P1234567',
        //             skuName: '实木相框多款相框家居摆件',
        //             guige: '银色 128G',
        //             price: '120'
        //         },
        //         {
        //             skuId: '3',
        //             skuNo: 'P1234567',
        //             skuName: '英伦风墨黑斜纹手提包',
        //             guige: '银色 128G',
        //             price: '120'
        //         }
        //     ]
        // });
      });
    } else {
      message.error(res.message);
    }
  };
}
