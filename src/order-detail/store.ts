import { Store } from 'plume2';
import DetailActor from './actor/detail-actor';
import LoadingActor from './actor/loading-actor';
import TidActor from './actor/tid-actor';
import TabActor from './actor/tab-actor';
import PayRecordActor from './actor/pay-record-actor';
import dictActor from './actor/dict-actor';
import { fromJS, Map } from 'immutable';

import * as webapi from './webapi';
import {
  addPay,
  fetchLogistics,
  fetchOrderDetail,
  payRecord,
  queryDictionary,
  refresh
} from './webapi';
import { message } from 'antd';
import LogisticActor from './actor/logistic-actor';
import { Const, history, RCi18n, ValidConst } from 'qmkit';

export default class AppStore extends Store {
  bindActor() {
    return [
      new DetailActor(),
      new LoadingActor(),
      new TidActor(),
      new TabActor(),
      new PayRecordActor(),
      new LogisticActor(),
      new dictActor()
    ];
  }

  constructor(props) {
    super(props);
    (window as any)._store = this;
  }

  //;;;;;;;;;;;;;action;;;;;;;;;;;;;;;;;;;;;;;
  init = async (tid: string) => {
    this.transaction(() => {
      this.dispatch('loading:start');
      this.dispatch('tid:init', tid);
      this.dispatch('detail-actor:hideDelivery');
    });
    const { res } = (await fetchOrderDetail(tid)) as any;
    let { code, context: orderInfo, message: errorInfo } = res;

    if (code == Const.SUCCESS_CODE) {
      await Promise.all([
        payRecord(orderInfo.id),
        //fetchLogistics(),
        webapi.getPaymentInfo(orderInfo.id),
        queryDictionary({
          type: 'country'
        })
      ]).then((results) => {
        const { res: payRecordResult } = results[0] as any;
        //const { res: logistics } = results[1] as any;
        const { res: payRecordResult2 } = results[1] as any;
        const { res: countryDictRes } = results[2] as any;
        this.transaction(() => {
          this.dispatch('loading:end');
          this.dispatch('detail:init', orderInfo);
          this.dispatch(
            'receive-record-actor:init',
            payRecordResult.context.payOrderResponses
          );
          this.dispatch(
            'receive-record-actor:initPaymentInfo',
            payRecordResult2.context ? payRecordResult2.context : {}
          );
          this.dispatch('detail-actor:setSellerRemarkVisible', true);
          // this.dispatch(
          //   'logistics:init',
          //   logistics.context ? logistics.context : {}
          // );
          // this.dispatch('detail:setNeedAudit', needRes.context.audit);
          this.dispatch(
            'dict:initCountry',
            countryDictRes.context.sysDictionaryVOS
          );
        });
      });
    } else {
      this.dispatch('loading:end');
    }
  };

  //????????????????????????
  refreshGoodsRealtimeStock = async (tid: string) => {
    this.transaction(() => {
      this.dispatch('loading:start');
      this.dispatch('tid:init', tid);
    });
    const { res } = (await fetchOrderDetail(tid)) as any;
    let { code, context: orderInfo } = res;
    if (code == Const.SUCCESS_CODE) {
      this.dispatch('detail:init', orderInfo);
    }
    this.dispatch('loading:end');
  };

  /* ??????????????????*/
  onRefresh = async (params) => {
    this.dispatch('logisticsLoading:start');
    const tid = this.state().get('tid');
    const { res } = (await webapi.refresh(tid)) as any;
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('dict:refresh', res.context.tradeDelivers);
      this.dispatch('logisticsLoading:end');
    } else {
      this.dispatch('logisticsLoading:end');
    }
  };

  /**
   * ???????????????
   */
  onSavePayOrder = async (params) => {
    let copy = Object.assign({}, params);
    const payOrder = this.state()
      .get('payRecord')
      .filter((payOrder) => payOrder.payOrderStatus == 1)
      .first();
    copy.payOrderId = payOrder.payOrderId;
    const { res } = await addPay(copy);
    if (res.code == Const.SUCCESS_CODE) {
      //??????
      message.success(RCi18n({ id: 'Order.OperateSuccessfully' }));
      //??????
      const tid = this.state().get('tid');
      this.setReceiveVisible();
      this.init(tid);
    }
  };

  onTabsChange = (key: string) => {
    this.dispatch('tab:init', key);
  };

  /**
   * ???????????? ??????
   * @returns {Promise<void>}
   */
  onDelivery = async () => {
    const tid = this.state().getIn(['detail', 'id']);
    const { res } = await webapi.deliverVerify(tid);
    if (res.code === Const.SUCCESS_CODE) {
      this.dispatch('tab:init', '2');
    }
  };

  onAudit = async (tid: string, audit: string, reason?: string) => {
    if (audit !== 'CHECKED') {
      if (!reason.trim()) {
        message.error('?????????????????????');
        return;
      }
    }

    const { res } = await webapi.audit(tid, audit, reason);

    this.hideRejectModal();
    if (res.code == Const.SUCCESS_CODE) {
      message.success(RCi18n({ id: 'Order.OperateSuccessfully' }));
      const tid = this.state().get('tid');
      this.init(tid);
    } else {
      message.error(audit == 'CHECKED' ? '????????????' : '????????????');
    }
  };

  /**
   * ??????
   */
  deliver = async () => {
    const tid = this.state().getIn(['detail', 'id']);
    this.dispatch('detail-actor:setIsFetchingLogistics', true);
    await this.fetchLogistics();
    const { res } = await webapi.deliverVerify(tid);
    this.dispatch('detail-actor:setIsFetchingLogistics', false);
    if (res.code === Const.SUCCESS_CODE) {
      const tradeItems = this.state()
        .getIn(['detail', 'tradeItems'])
        .concat(this.state().getIn(['detail', 'gifts']));

      const shippingItemList = tradeItems
        .filter((v) => {
          return v.get('deliveringNum') && v.get('deliveringNum') != 0;
        })
        .map((v) => {
          return {
            skuId: v.get('skuId'),
            itemNum: v.get('deliveringNum')
          };
        })
        .toJS();
      if (
        shippingItemList.length <= 0 ||
        fromJS(shippingItemList).some(
          (val) => !ValidConst.noZeroNumber.test(val.get('itemNum'))
        )
      ) {
        message.error(RCi18n({ id: 'Order.InputQuantity' }));
      } else {
        this.showDeliveryModal();
      }
    }
  };

  changeDeliverNum = (skuId, isGift, num) => {
    this.dispatch('detail-actor:changeDeliverNum', { skuId, isGift, num });
  };

  /**
   * ????????????
   */
  confirm = async () => {
    const tid = this.state().getIn(['detail', 'id']);
    const { res } = await webapi.confirm(tid);
    if (res.code == Const.SUCCESS_CODE) {
      //??????
      message.success(RCi18n({ id: 'Order.OperateSuccessfully' }));
      //??????
      const tid = this.state().get('tid');
      this.init(tid);
    } else if (res.code == 'K-000001') {
      message.error('????????????????????????????????????????????????!');
    }
  };

  /**
   * ????????????modal
   */
  showDeliveryModal = () => {
    this.dispatch('detail-actor:showDelivery', true);
  };

  /**
   * ????????????modal
   */
  hideDeliveryModal = () => {
    this.dispatch('detail-actor:hideDelivery');
  };

  /**
   * ??????
   */
  saveDelivery = async (param) => {
    const tid = this.state().getIn(['detail', 'id']);

    // if (__DEV__) {
    // }
    // const shippingItemList = tradeItems.filter((v) => {
    //   return v.get('deliveringNum') && v.get('deliveringNum') != 0
    // }).map((v) => {
    //   return {
    //     skuId: v.get('skuId'),
    //     skuNo: v.get('skuNo'),
    //     itemNum: v.get('deliveringNum')
    //   }
    // }).toJS()
    //
    //

    let tradeDelivery = Map();
    tradeDelivery = tradeDelivery.set(
      'shippingItemList',
      this.handleShippingItems(this.state().getIn(['detail', 'tradeItems']))
    );
    tradeDelivery = tradeDelivery.set(
      'giftItemList',
      this.handleShippingItems(this.state().getIn(['detail', 'gifts']))
    );
    tradeDelivery = tradeDelivery.set('deliverNo', param.deliverNo);
    tradeDelivery = tradeDelivery.set('deliverId', param.deliverId);
    tradeDelivery = tradeDelivery.set('deliverTime', param.deliverTime);
    this.dispatch('detail-actor:setIsSavingShipment', true);
    const { res } = await webapi.deliver(tid, tradeDelivery);
    this.dispatch('detail-actor:setIsSavingShipment', false);
    if (res.code == Const.SUCCESS_CODE) {
      //??????
      message.success(RCi18n({ id: 'Order.OperateSuccessfully' }));
      //??????
      this.init(tid);
    }
  };

  handleShippingItems = (tradeItems) => {
    return tradeItems
      .filter((v) => {
        return v.get('deliveringNum') && v.get('deliveringNum') != 0;
      })
      .map((v) => {
        return {
          skuId: v.get('skuId'),
          skuNo: v.get('skuNo'),
          itemNum: v.get('deliveringNum')
        };
      })
      .toJS();
  };

  /**
   * ??????????????????
   * @param params
   * @returns {Promise<void>}
   */
  obsoleteDeliver = async (params) => {
    const tid = this.state().getIn(['detail', 'id']);

    const { res } = await webapi.obsoleteDeliver(tid, params);
    if (res.code == Const.SUCCESS_CODE) {
      message.success(RCi18n({ id: 'Order.OperateSuccessfully' }));
      this.init(tid);
    }
  };

  /**
   * ??????
   * @param params
   * @returns {Promise<void>}
   */
  retrial = async (_params) => {
    const tid = this.state().getIn(['detail', 'id']);

    const { res } = await webapi.retrial(tid);
    if (res.code == Const.SUCCESS_CODE) {
      this.init(tid);
      message.success(RCi18n({ id: 'Order.OperateSuccessfully' }));
    }
  };

  /**
   * ??????????????????
   * @param params
   * @returns {Promise<void>}
   */
  destroyOrder = async (params) => {
    const tid = this.state().getIn(['detail', 'id']);
    const { res: verifyRes } = await webapi.verifyAfterProcessing(tid);

    if (verifyRes.code === Const.SUCCESS_CODE && verifyRes.context.length > 0) {
      message.error('????????????????????????????????????????????????');
      return;
    }

    const { res } = await webapi.destroyOrder(params);

    if (res.code === Const.SUCCESS_CODE) {
      message.success(RCi18n({ id: 'Order.OperateSuccessfully' }));
      this.init(tid);
    }
  };

  /**
   * ??????/????????????????????????
   * @param param
   */
  setSellerRemarkVisible = (param: boolean) => {
    this.dispatch('detail-actor:setSellerRemarkVisible', param);
  };

  /**
   * ??????????????????
   * @param param
   */
  setSellerRemark = (param: string) => {
    this.dispatch('detail-actor:remedySellerRemark', param);
  };

  /**
   * ??????????????????
   * @param param
   * @returns {Promise<void>}
   */
  remedySellerRemark = async () => {
    const tid = this.state().getIn(['detail', 'id']);
    const sellerRemark = this.state().get('remedySellerRemark');
    if (sellerRemark.length > 60) {
      message.error('????????????????????????60?????????');
      return;
    }
    const { res } = await webapi.remedySellerRemark(tid, sellerRemark);
    if (res.code === Const.SUCCESS_CODE) {
      message.success(RCi18n({ id: 'Order.OperateSuccessfully' }));
      const tid = this.state().getIn(['detail', 'id']);
      this.init(tid);
    }
  };

  /**
   * ??????????????????
   * @returns {Promise<void>}
   */
  fetchLogistics = async () => {
    //const { res: logistics } = (await webapi.fetchLogistics()) as any;

    this.dispatch('logistics:init', []);
  };

  /**
   * ?????????????????????????????????
   * @returns {Promise<void>}
   */
  verify = async (tid: string) => {
    const buyerId = this.state().getIn(['detail', 'buyer', 'id']);
    const { res } = await webapi.verifyBuyer(buyerId);
    if (res) {
      message.error(RCi18n({ id: 'Order.modifiedErr' }));
      return;
    } else {
      history.push('/order-edit/' + tid);
    }
  };

  /**
   * ????????????????????????
   * @returns {Promise<void>}
   */
  fetchOffLineAccounts = async () => {
    const { res } = await webapi.checkFunctionAuth(
      '/account/receivable',
      'POST'
    );
    if (!res.context) {
      message.error('??????????????????????????????');
      return;
    }

    const result = await webapi.fetchOffLineAccout();
    if (result) {
      this.dispatch('receive-record-actor:setReceiveVisible');
    }
  };

  /**
   * ????????????????????????????????????
   */
  setReceiveVisible = () => {
    this.dispatch('receive-record-actor:setReceiveVisible');
  };

  /**
   * ???????????????
   */
  onConfirm = async (id) => {
    let ids = [];
    ids.push(id);
    const { res } = await webapi.payConfirm(ids);
    if (res.code === Const.SUCCESS_CODE) {
      message.success(RCi18n({ id: 'Order.OperateSuccessfully' }));
      const tid = this.state().getIn(['detail', 'id']);
      this.init(tid);
    }
  };

  /**
   * ??????????????????
   */
  showRejectModal = () => {
    this.dispatch('detail-actor:reject:show');
  };

  /**
   *??????????????????
   */
  hideRejectModal = () => {
    this.dispatch('detail-actor:reject:hide');
  };
}
