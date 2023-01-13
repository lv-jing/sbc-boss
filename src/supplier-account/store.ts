/**
 * Created by feitingting on 2017/12/4.
 */

import { IOptions, Store } from 'plume2';
import { fromJS } from 'immutable';
import AccountActor from './actor/account-actor';
import * as webapi from './webapi';
import { Const } from 'qmkit';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new AccountActor()];
  }

  /**
   * 收款账户列表
   * @returns {Promise<void>}
   */
  init = async () => {
    const { res } = await webapi.getAccountList({
      auditState: 1,
      pageNum: this.state().get('pageNum'),
      sortColumn: 'applyEnterTime',
      sortRole: 'desc'
    });
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('account:list', fromJS(res.context.content));
      //总数
      this.dispatch('account:total', res.context.totalElements);
    }
  };

  /**
   * 查询条件
   */
  changeSearchInfo = ({ field, value }) => {
    this.dispatch('account:list:search', { field, value });
    //即刻触发搜索过滤
    if (field == 'remitAffirm') {
      //即刻查询，从第一页开始
      this.dispatch('account:pageNum', 0);
      this.filter(1);
    }
  };

  /**
   * 根据条件查询
   */
  filter = async (flag: number) => {
    //flag为0，点击搜索按钮从第一页开始查询，flag为1，保留筛选结果做分页查询
    const searchInfo = this.state().get('searchInfo');
    //过滤条件查询都从第一页开始
    const { res } = await webapi.getAccountList({
      //审核通过的
      auditState: 1,
      pageNum: flag == 0 ? 0 : this.state().get('pageNum'),
      storeName: searchInfo.get('storeName') ? searchInfo.get('storeName') : '',
      applyEnterTimeStart:
        searchInfo.get('applyEnterTime') &&
        searchInfo.get('applyEnterTime').length > 0
          ? searchInfo
              .get('applyEnterTime')[0]
              .format('YYYY-MM-DD')
              .toString()
          : '',
      applyEnterTimeEnd:
        searchInfo.get('applyEnterTime') &&
        searchInfo.get('applyEnterTime').length > 0
          ? searchInfo
              .get('applyEnterTime')[1]
              .format('YYYY-MM-DD')
              .toString()
          : '',
      remitAffirm: searchInfo.get('remitAffirm'),
      sortColumn: 'applyEnterTime',
      sortRole: 'desc'
    });
    if (flag == 0) {
      this.dispatch('account:pageNum', 0);
    }
    if (res.code == Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('account:list', fromJS(res.context.content));
        this.dispatch('account:total', res.context.totalElements);
      });
    }
  };

  /**
   * 分页查询
   * @param pageNum
   * @param pageSize
   */
  onPagination = async (current) => {
    this.dispatch('account:pageNum', current - 1);
    this.filter(1);
  };
}
