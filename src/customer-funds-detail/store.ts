import { Store, IOptions } from 'plume2';
import { message } from 'antd';

import { Const, util } from 'qmkit';
import FundsDetailActor from './actor/funds-detail-actor';
import { getFundsDetailList, getFundsStatistics } from './webapi';
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
    return [new FundsDetailActor(), new ExportActor(), new SelectedActor()];
  }

  statistics = async () => {
    const params = this.state()
      .get('form')
      .toJS();
    const { customerId } = params;
    const statistics: any = await getFundsStatistics(customerId);
    if (statistics.res.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('funds:detail:statistics', statistics.res.context);
      });
    } else {
      message.error(statistics.res.message);
    }
  };

  /**
   * 初始化余额明细列表
   */
  init = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    this.dispatch('select:init', []);
    const params = this.state()
      .get('form')
      .toJS();
    const pageList: any = await getFundsDetailList({
      ...params,
      pageSize,
      pageNum
    });
    if (pageList.res.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('funds:detail:init', pageList.res.context);
      });
    } else {
      message.error(pageList.res.message);
    }
  };

  /**
   * 设置form参数
   */
  setFormField = (field, value) => {
    this.dispatch('funds:detail:form:field', { field, value });
  };

  /**
   * 切换tab
   */
  changeTab = (tabType) => {
    this.dispatch('funds:detail:changeTab', tabType);
    this.statistics();
    this.init();
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
      message.error('请选择要导出的会员资金明细记录');
      return new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
    }
    let params = this.state()
      .get('form')
      .toJS();

    const fundsType = params.fundsType;
    if (fundsType == 0) {
      params.fundsType = 'ALL';
    } else if (fundsType == 1) {
      params.fundsType = 'DISTRIBUTION_COMMISSION';
    } else if (fundsType == 2) {
      params.fundsType = 'COMMISSION_WITHDRAWAL';
    } else if (fundsType == 3) {
      params.fundsType = 'INVITE_NEW_AWARDS';
    }
    return this._onExport({
      customerFundsDetailIdList: selected.toJS(),
      tabType: params.tabType,
      fundsType: params.fundsType,
      sortMap: params.sortMap
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

    const fundsType = params.fundsType;
    if (fundsType == 0) {
      params.fundsType = 'ALL';
    } else if (fundsType == 1) {
      params.fundsType = 'DISTRIBUTION_COMMISSION';
    } else if (fundsType == 2) {
      params.fundsType = 'COMMISSION_WITHDRAWAL';
    } else if (fundsType == 3) {
      params.fundsType = 'INVITE_NEW_AWARDS';
    }else if (fundsType == 4) {
      params.fundsType = 'COMMISSION_COMMISSION';
    }else if (fundsType == 5) {
      params.fundsType = 'BALANCE_PAY';
    }else if (fundsType == 6) {
      params.fundsType = 'BALANCE_PAY_REFUND';
    }
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
          const exportHref =
            Const.HOST + `/funds-detail/export/params/${encrypted}`;
          window.open(exportHref);
        } else {
          message.error('请登录');
        }

        resolve();
      }, 500);
    });
  };
}
