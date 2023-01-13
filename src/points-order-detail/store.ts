import { Store } from 'plume2';
import DetailActor from './actor/detail-actor';
import LoadingActor from './actor/loading-actor';
import TidActor from './actor/tid-actor';
import TabActor from './actor/tab-actor';
import PayRecordActor from './actor/pay-record-actor';
import { message } from 'antd';
import { payRecord, fetchOrderDetail } from './webapi';
import LogisticActor from './actor/logistic-actor';
import { Const } from 'qmkit';

export default class AppStore extends Store {
  bindActor() {
    return [
      new DetailActor(),
      new LoadingActor(),
      new TidActor(),
      new TabActor(),
      new PayRecordActor(),
      new LogisticActor()
    ];
  }

  constructor(props) {
    super(props);
    //debug
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
      const payRecordResult = (await payRecord(tid)) as any;
      // 增加商品中将要发货字段
      if (orderInfo.tradeItems) {
        orderInfo.tradeItems.forEach((v, k) => {
          v.deliveringNum = 0;
          v.key = k;
        });
      }

      this.transaction(() => {
        this.dispatch('loading:end');
        this.dispatch('detail:init', orderInfo);
        this.dispatch(
          'receive-record-actor:init',
          payRecordResult.res.payOrderResponses
        );
        this.dispatch('detail-actor:setSellerRemarkVisible', true);
      });
    } else {
      message.error(errorInfo);
    }
  };

  onTabsChange = (key: string) => {
    this.dispatch('tab:init', key);
  };
}
