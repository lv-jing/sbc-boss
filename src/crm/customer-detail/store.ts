import { IOptions, Store } from 'plume2';

import * as webapi from './webapi';
import customerDetailActor from './actor/customer-detail-actor';
import { Const } from 'qmkit';
export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new customerDetailActor()];
  }

  init = async (customerId) => {
    this.initBaseInfo(customerId);
    const {
      res: {
        context: { customerTagRelVOList }
      }
    } = await webapi.customerTagList(customerId);

    const {
      res: {
        context: { groupNames }
      }
    } = await webapi.customerGroup(customerId);

    const {res:statis} = await webapi.rfmScoreStatistic(customerId);
    const rfmStatistic = (statis.context as any).rfmStatistic;
    if(statis.code==Const.SUCCESS_CODE){
      this.dispatch('init', {
        customerId,
        customerTagRelVOList,
        groupNames,
        rfmStatistic
      });
    }
    this.getTagList();
  };

  initBaseInfo = async (customerId) => {
    const {
      res: { context: baseInfo }
    } = await webapi.fetchCustomer(customerId);
    this.dispatch('init:baseInfo', baseInfo);
  };

  toggleModal = () => {
    this.dispatch('toggle: form: modal');
  };

  toggleTagModal = () => {
    this.dispatch('toggle:tag:modal');
  };

  getTagList = async () => {
    const { res } = (await webapi.tagList({
      pageNum: 0,
      pageSize: 10
    })) as any;
    if (res.code === Const.SUCCESS_CODE) {
      this.dispatch('init:tagList', res.context.customerTagVOList);
    }
  };

  updateTag = async () => {
    const customerId = this.state().get('customerId');
    let customerTagList = this.state().get('customerTagList');
    const { res } = await webapi.addCustomerTag({
      tagIds: customerTagList,
      customerId
    });
    if (res.code === Const.SUCCESS_CODE) {
      this.init(customerId);
    }
  };

  // onSaveTag = (ids) => {
  //   let tagIds = [];
  //   ids.map((id) => {
  //     tagIds.push(id);
  //   });
  //   this.dispatch('init:state', { field: 'tagIds', value: ids });
  // };

  getCustomerTagList = async () => {
    const customerId = this.state().get('customerId');
    const {
      res: {
        context: { customerTagRelVOList }
      }
    } = await webapi.customerTagList(customerId);
    this.dispatch('init:customertagList', customerTagRelVOList);
  };

  onFormChange = ({ field, value }) => {
    this.dispatch('init:state', { field, value });
  };
}
