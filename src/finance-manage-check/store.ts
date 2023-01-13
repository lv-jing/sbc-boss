/**
 * Created by feitingting on 2017/12/12.
 */
import { IOptions, Store } from 'plume2';
import { message } from 'antd';
import * as webapi from './webapi';
import FinanceActor from './actor/finance-actor';
import { Const, util } from 'qmkit';
import { fromJS } from 'immutable';
export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new FinanceActor()];
  }

  init = async () => {
    const { res } = await webapi.fetchAllPayWays();
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('finance:payWays', res.context);
    }
    const searchTime = {
      beginTime:
        this.state()
          .get('dateRange')
          .get('beginTime') +
        ' ' +
        '00:00:00',
      endTime:
        this.state()
          .get('dateRange')
          .get('endTime') +
        ' ' +
        '23:59:59',
      keywords: this.state().get('storeName')
    };
    this.dispatch('finance:searchTime', fromJS(searchTime));
    //获取收入对账明细
    if (this.state().get('tabKey') == 1) {
      await this.fetchIncomeList();
    } else {
      await this.fetchRefundList();
    }
  };

  /**
   * 获取收入对账列表
   */
  fetchIncomeList = async () => {
    const { res: income } = await webapi.fetchIncomeList({
      beginTime:
        this.state()
          .get('dateRange')
          .get('beginTime') +
        ' ' +
        '00:00:00',
      endTime:
        this.state()
          .get('dateRange')
          .get('endTime') +
        ' ' +
        '23:59:59',
      pageNum: this.state().get('pageNum'),
      keywords: this.state().get('storeName')
    });
    //总体
    const { res: incomeTotal } = await webapi.fetchIncomeTotal({
      beginTime:
        this.state()
          .get('dateRange')
          .get('beginTime') +
        ' ' +
        '00:00:00',
      endTime:
        this.state()
          .get('dateRange')
          .get('endTime') +
        ' ' +
        '23:59:59'
    });
    if (income.code == Const.SUCCESS_CODE) {
      this.dispatch('finance:income', income.context.content);
      this.dispatch('finance:total', income.context.totalElements);
    } else {
      message.error(income.message);
    }
    if (incomeTotal.code == Const.SUCCESS_CODE) {
      this.dispatch('finance:incomeTotal', incomeTotal.context);
    }
  };

  /**
   * 改变时间
   * @param params
   */
  changeDateRange = (key, value) => {
    this.dispatch('finance:dateRange', { key: key, value: value });
  };

  /**
   * 根据日期搜索
   */
  searchByDate = async () => {
    const searchTime = {
      beginTime:
        this.state()
          .get('dateRange')
          .get('beginTime') +
        ' ' +
        '00:00:00',
      endTime:
        this.state()
          .get('dateRange')
          .get('endTime') +
        ' ' +
        '23:59:59',
      keywords: this.state().get('storeName')
    };
    this.dispatch('finance:searchTime', fromJS(searchTime));
    this.transaction(() => {
      //从第一页开始
      this.dispatch('finance:pageNum', 0);
      this.dispatch('finance:total', 0);
    });
    if (this.state().get('tabKey') == 1) {
      await this.fetchIncomeList();
    } else {
      await this.fetchRefundList();
    }
  };

  /**
   * 切换选项卡
   */
  onTabChange = async (key) => {
    this.transaction(() => {
      this.dispatch('finance:tabkey', key);
      //从第一页开始
      this.dispatch('finance:pageNum', 0);
      this.dispatch('finance:total', 0);
      //店铺名称清空
      this.dispatch('finance:storeName', '');
    });
    //zhanghao 原型修改，时间不需要重置
    //时间还原为当天
    // this.changeDateRange('beginTime', moment(new Date()).format('YYYY-MM-DD'));
    // this.changeDateRange('endTime', moment(new Date()).format('YYYY-MM-DD'));
    //收入对账
    if (key == 1) {
      await this.fetchIncomeList();
    } else {
      //退款对账
      await this.fetchRefundList();
    }
  };

  /**
   * 获取退款对账列表
   */
  fetchRefundList = async () => {
    const { res: refund } = await webapi.fetchRefundList({
      beginTime:
        this.state()
          .get('dateRange')
          .get('beginTime') +
        ' ' +
        '00:00:00',
      endTime:
        this.state()
          .get('dateRange')
          .get('endTime') +
        ' ' +
        '23:59:59',
      pageNum: this.state().get('pageNum'),
      keywords: this.state().get('storeName')
    });
    const { res: refundTotal } = await webapi.fetchRefundTotal({
      beginTime:
        this.state()
          .get('dateRange')
          .get('beginTime') +
        ' ' +
        '00:00:00',
      endTime:
        this.state()
          .get('dateRange')
          .get('endTime') +
        ' ' +
        '23:59:59'
    });
    if (refundTotal.code == Const.SUCCESS_CODE) {
      this.dispatch('finance:refundTotal', refundTotal.context);
    }
    if (refund.code == Const.SUCCESS_CODE) {
      this.dispatch('finance:refund', refund.context.content);
      this.dispatch('finance:total', refund.context.totalElements);
    } else {
      message.error(refund.message);
    }
  };
  /**
   * 批量导出
   */
  bulk_export = async () => {
    const searchTime = this.state()
      .get('searchTime')
      .toJS();
    const { beginTime, endTime, keywords } = searchTime;
    return new Promise((resolve) => {
      setTimeout(() => {
        // 参数加密
        const base64 = new util.Base64();
        const token = (window as any).token;
        if (token) {
          const result = JSON.stringify({
            keywords: keywords,
            beginTime: beginTime,
            endTime: endTime,
            token: token,
            accountRecordType: this.state().get('tabKey') - 1
          });
          const encrypted = base64.urlEncode(result);
          // 新窗口下载
          const exportHref =
            Const.HOST + `/finance/bill/exportIncome/${encrypted}`;
          window.open(exportHref);
        } else {
          message.error('请登录');
        }

        resolve();
      }, 500);
    });
  };

  /**
   * 选项卡标签
   * @param {string} kind
   */
  setTab = (kind: string) => {
    //收入对账or退款对账
    if (kind == 'income') {
      this.dispatch('finance:tabkey', '1');
    } else {
      this.dispatch('finance:tabkey', '2');
    }
  };

  /**
   * 分页查询
   * @param pageNum
   * @param pageSize
   */
  onPagination = async (current, _pageSize) => {
    this.dispatch('finance:pageNum', current - 1);
    if (this.state().get('tabKey') == '1') {
      await this.fetchIncomeList();
    } else {
      await this.fetchRefundList();
    }
  };

  /**
   * 根据店铺名称查询店铺
   * @param storeName
   * @returns {Promise<void>}
   */
  queryStoreByName = async (storeName) => {
    this.storeQueryName(storeName);
    const { res } = await webapi.queryStoreByName(storeName);
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('finance:storeMap', res.context);
    } else {
      message.error(res.message);
    }
  };

  /**
   * 店铺名称关键字
   */
  storeQueryName = (name) => {
    this.dispatch('finance:storeName', name);
  };
}
