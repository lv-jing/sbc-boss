import { Store } from 'plume2';
import PointsRecordActor from './actor/points-record-actor';
import CustomerActor from './actor/points-list-actor';
import ponitsNumberDetailsActor from './actor/points-num-detail-actor';
import { Const, util } from 'qmkit';
import * as webapi from './webapi';
import { fromJS } from 'immutable';
import { message } from 'antd';


export default class AppStore extends Store {
  bindActor() {
    return [
      new PointsRecordActor(),
      new CustomerActor(),
      new ponitsNumberDetailsActor()
    ];
  }

  init = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    const query = this.state()
      .get('form')
      .toJS();
    const { res } = await webapi.pointRecordList({
      ...query,
      pageNum,
      pageSize
    });

    if (res.code != 'K-000000') return;
    let pointsList = null;
    pointsList = res.context.customerPointsDetailVOPage.content as any;
    this.dispatch('init', {
      pointsList: fromJS(pointsList),
      total: res.context.customerPointsDetailVOPage.totalElements,
      pageNum: pageNum + 1
    });
  };

  onFormFieldChange = (key, value) => {
    this.dispatch('form: field', { key, value });
  };

  /**
   * 切换tab事件
   */
  onTabChange = (tabKey) => {
    if (tabKey == '0') {
      this.onSearch();
    } else {
      this._onSearch();
    }
  };

  /**
   * 积分增减记录TAB搜索
   */
  onSearch = () => {
    this.init({ pageNum: 0, pageSize: 10 });
    this.pointsNumDeatil();
  };

  /**
   * 客户积分列表TAB搜索
   */
  _onSearch = () => {
    this.initCustomer({ pageNum: 0, pageSize: 10 });
    this.pointsNumDeatil();
  };

  onCustomerFormFieldChange = (key, value) => {
    this.dispatch('customer:form:field', { key, value });
  };

  initCustomer = async (
    { pageNum, pageSize } = { pageNum: 0, pageSize: 10 }
  ) => {
    let pointsAvailableBegin =
      this.state().getIn(['_form', 'pointsAvailableBegin']);
    let pointsAvailableEnd =
      this.state().getIn(['_form', 'pointsAvailableEnd']);
    if (pointsAvailableBegin && pointsAvailableEnd && pointsAvailableBegin > pointsAvailableEnd) {
      message.error('最小积分值不能大于最大积分值！');
      return;
    }
    const query = this.state()
      .get('_form')
      .toJS();
    const { res } = await webapi.fetchCustomerList({
      ...query,
      pageNum,
      pageSize
    });

    if (res.code != 'K-000000') return;
    let customertList = null;

    customertList = res.context.detailResponseList as any;
    this.dispatch('customer-point-init', {
      customertList: fromJS(customertList),
      total: res.context.total,
      pageNum: pageNum + 1
    });
  };

  pointsNumDeatil = async () => {
    const { res } = await webapi.pointsNumDetail();
    if (res.code !== Const.SUCCESS_CODE) return;
    this.dispatch('ponits-number-details', fromJS(res.context));
  };

  /**
   * 批量导出
   */
  bulk_export = async () => {
    return new Promise((resolve) => {
      const query = this.state()
        .get('_form')
        .toJS();
      setTimeout(() => {
        // 参数加密
        const base64 = new util.Base64();
        const token = (window as any).token;
        if (token) {
          const result = JSON.stringify({
            token: token,
            ...query
          });

          const encrypted = base64.urlEncode(result);
          // 新窗口下载
          const exportHref =
            Const.HOST + `/customer/points/export/${encrypted}`;
          window.open(exportHref);
        } else {
          message.error('请登录');
        }
        resolve();
      }, 500);
    });
  };
}
