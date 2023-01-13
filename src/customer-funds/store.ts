import { Store, IOptions } from 'plume2';
import { message } from 'antd';

import { Const, util } from 'qmkit';
import FundsActor from './actor/funds-actor';
import { getFundsList, getFundsStatistics } from './webapi';
import { fromJS } from 'immutable';
import ExportActor from './actor/export-actor';
import SelectedActor from './actor/selected-actor';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      window['_store'] = this;
    }
  }

  bindActor() {
    return [new FundsActor(), new ExportActor(), new SelectedActor()];
  }

  /**
   * 获取会员资金统计信息
   * @returns {Promise<void>}
   */
  statistics = async () => {
    const statistics: any = await getFundsStatistics();
    if (statistics.res.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('funds: statistics', statistics.res.context);
      });
    } else {
      message.error(statistics.res.message);
    }
  };

  /**
   * 初始化会员资金列表
   */
  init = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    const params = this.state()
      .get('form')
      .toJS();
    const pageList: any = await getFundsList({
      ...params,
      pageSize,
      pageNum
    });
    if (pageList.res.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('funds: init', pageList.res.context);
      });
    } else {
      message.error(pageList.res.message);
    }
  };

  /**
   * 设置form参数
   */
  setFormField = (field, value) => {
    this.dispatch('funds: form: field', { field, value });
  };

  /**
   * 更改搜索项(会员账号、会员名称)
   */
  changeCustomerAccountOrNameOption = (val) => {
    this.dispatch('funds: form: changeCustomerAccountOrNameOption', val);
  };

  /**
   * 更改排序信息
   * @param columnKey
   * @param order
   */
  setSortedInfo = (columnKey, order) => {
    this.dispatch('funds:setSortedInfo', {
      columnKey: columnKey,
      order: order
    });
  };

  /**
   * 验证InputGroupCompact控件数值大小，并进行大小值交换
   */
  checkSwapInputGroupCompact = () => {
    const params = this.state()
      .get('form')
      .toJS();
    const {
      startAccountBalance,
      endAccountBalance,
      startBlockedBalance,
      endBlockedBalance,
      startWithdrawAmount,
      endWithdrawAmount
    } = params;
    if (parseFloat(startAccountBalance) > parseFloat(endAccountBalance)) {
      this.setFormField('startAccountBalance', endAccountBalance);
      this.setFormField('endAccountBalance', startAccountBalance);
    }
    if (parseFloat(startBlockedBalance) > parseFloat(endBlockedBalance)) {
      this.setFormField('startBlockedBalance', endBlockedBalance);
      this.setFormField('endBlockedBalance', startBlockedBalance);
    }
    if (parseFloat(startWithdrawAmount) > parseFloat(endWithdrawAmount)) {
      this.setFormField('startWithdrawAmount', endWithdrawAmount);
      this.setFormField('endWithdrawAmount', startWithdrawAmount);
    }
  };

  onSelect = (list) => {
    this.dispatch('select:init', list);
  };

  /**
   * 隐藏导出modal
   */
  onExportModalHide = () => {
    this.dispatch('list:export-modal:hide');
  };

  /**
   * 线上导出modal
   * @param status
   */
  onExportModalChange = (status) => {
    this.dispatch('list:export-modal:change', fromJS(status));
  };

  /**
   * 按选中的编号导出
   * @returns {Promise<T>}
   */
  onExportByIds = () => {
    const selected = this.state().get('selected');
    if (selected.isEmpty()) {
      message.error('请选择要导出的会员资金记录');
      return new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
    }
    const form = this.state().get('form');
    return this._onExport({
      customerFundsIdList: selected.toJS(),
      sortColumn: form.get('sortColumn'),
      sortRole: form.get('sortRole')
    });
  };

  /**
   * 按搜索条件导出
   * @returns {Promise<T>}
   */
  onExportByParams = () => {
    // 搜索条件
    let params = this.state()
      .get('form')
      .toJS();
    return this._onExport(params);
  };

  /**
   * 导出
   * @param params
   * @private
   */
  _onExport = (params: {}) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 参数加密
        let base64 = new util.Base64();
        const token = (window as any).token;
        if (token) {
          let result = JSON.stringify({ ...params, token: token });
          let encrypted = base64.urlEncode(result);

          // 新窗口下载
          const exportHref = Const.HOST + `/funds/export/params/${encrypted}`;
          window.open(exportHref);
        } else {
          message.error('请登录');
        }

        resolve();
      }, 500);
    });
  };
}
