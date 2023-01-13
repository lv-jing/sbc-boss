import { IOptions, Store } from 'plume2';
import PointsDetailActor from './actor/points-detail-actor';
import CustomerInfoActor from './actor/customer-info-actor';
import { fromJS } from 'immutable';

import * as webapi from './webapi';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }
  bindActor() {
    return [new PointsDetailActor(),new CustomerInfoActor()];
  }

  init = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    let customerId = this.state().get('customerId');
    const { res } = await webapi.pointDetailList({
      customerId,
      pageNum,
      pageSize
    });
    if (res.code != 'K-000000') return;
     let  pointsDetailList = res.context.customerPointsDetailVOPage.content as any;
    this.dispatch('init', {
      pointsDetailList: fromJS(pointsDetailList),
      total: res.context.customerPointsDetailVOPage.totalElements,
      pageNum: pageNum + 1
    });
  };

  setCustomerId = (customerId: string) => {
    this.dispatch('point-detail:customerId', customerId);
  };

  queryInfo = async () => {
    let customerId = this.state().get('customerId');
    const { res } = await webapi.userInfo(customerId) as any
    let userInfo = res;
    let data = {
      pointsUsed:userInfo.pointsUsed,
      pointsAvailable:userInfo.pointsAvailable,
      customerName:userInfo.customerDetail.customerName,
      customerAccount:userInfo.customerAccount,
      headImg:userInfo.headImg
    }
    this.dispatch('pointsDetail:userInfo', fromJS(data));
  };
}
