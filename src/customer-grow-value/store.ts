import { IOptions, Store } from 'plume2';
import GrowValueActor from './actor/grow-value-actor';
import * as webapi from './webapi';
import { fromJS } from 'immutable';
import history from '../../web_modules/qmkit/history';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new GrowValueActor()];
  }

  init = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    const query = this.state()
      .get('form')
      .toJS();
    const customerId = this.state().get('customerId');
    const { res }: any = await webapi.growValueList({
      ...query,
      customerId: customerId,
      pageNum,
      pageSize
    });

    let growValueList = null;
    if (res.content as any) {
      growValueList = res.content as any;
      this.dispatch('init', {
        growValueList: fromJS(growValueList),
        total: res.totalElements,
        pageNum: pageNum + 1
      });
    }
  };

  queryCustomerInfo = async (customerId) => {
    const { res } = await webapi.queryCustomerInfo(customerId);
    this.dispatch('init:customerInfo', fromJS(res));
  };

  /**
   * route 客户列表
   */
  _toCustomerList = () => {
    history.push({
      pathname: '/customer-list'
    });
  };

  onFormFieldChange = (key, value) => {
    this.dispatch('form: field', { key, value });
  };

  onSearch = () => {
    this.init({ pageNum: 0, pageSize: 10 });
  };

  setCustomerId = (customerId) => {
    this.dispatch('init: customerId', customerId);
  };

  checkIsEnterpriseCustomer = async (flag) => {
    this.dispatch('init:isEnterpriseCustomer', flag);
  };
}
