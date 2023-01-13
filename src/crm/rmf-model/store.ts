import { IOptions, Store } from 'plume2';
import RmfActor from './actor/rmf-actor';
import { fetchRfmModal, fetchRfmBar } from './webapi'
import { Const } from 'qmkit';
import { fromJS } from 'immutable';
import { message } from 'antd';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new RmfActor()];
  }

  init = async () => {
    await this.getRfmModal();
    await this.getRfmBar();
  }

  getRfmModal = async () => {
    const { res } = await fetchRfmModal() as any;
    const { code, context } = res;
    if (code == Const.SUCCESS_CODE) {
      this.dispatch('rfm: rfmModal', fromJS(context));
    } else {
      message.error(res.message);
    }
  }

  getRfmBar = async () => {
    const { res } = await fetchRfmBar() as any;
    const { code, context } = res;
    if (code == Const.SUCCESS_CODE) {
      const { rfmGroupStatisticsListResponse } = context;
      let x = [];
      let y = [];
      rfmGroupStatisticsListResponse
      .sort((a, b) => {
        if (a.groupId > b.groupId) return -1;
      })
      .map(item => {
        const { customerNum, groupName } = item;
        x.push(customerNum);
        y.push(groupName);
      });
      this.dispatch('rfm: rfmBar', fromJS({ x, y }));
    } else {
      message.error(res.message);
    }
  }
}
