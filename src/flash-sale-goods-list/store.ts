import { Store } from 'plume2';
import { message } from 'antd';
import { Const } from 'qmkit';
import * as webApi from './webapi';
import FlashSaleList from './actor/flash-sale-List-actor';

export default class AppStore extends Store {
  bindActor() {
    return [new FlashSaleList()];
  }

  /**
   * 初始化方法
   */
  init = (param) => {
    this.dispatch('list-init', param);
    const { activityDate, activityTime } = param;
    this.getList(0, 10, activityDate, activityTime);
  };

  getList = async (
    pageNum = 0,
    pageSize = 10,
    activityDate = this.state().get('activityDate'),
    activityTime = this.state().get('activityTime')
  ) => {
    const param = {
      pageNum,
      pageSize,
      activityDate: activityDate,
      activityTime: activityTime
    };
    console.log('getList:', param);
    const { res } = (await webApi.getPageList(param)) as any;
    if (res.code == Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('list-dataList', res.context.flashSaleGoodsVOPage);
        this.dispatch('list-load', false);
      });
    } else {
      message.error(message);
    }
  };
}
