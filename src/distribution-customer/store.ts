import { IOptions, Store } from 'plume2';
import * as webapi from './webapi';
import ListActor from './actor/list-actor';
import LoadingActor from './actor/loading-actor';
import FormActor from './actor/form-actor';
import SelectedActor from './actor/selected-customer-actor';
import { message } from 'antd';
import EditActor from './actor/edit-actor';
import VisibleActor from './actor/visible-actor';
import ForbidActor from './actor/forbid-actor';
import { Const, util, QMMethod } from 'qmkit';
import { fromJS } from 'immutable';
import ExportActor from './actor/export-actor';

export default class AppStore extends Store {
  // 搜索条件缓存
  searchCache = {} as any;

  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [
      new ListActor(),
      new LoadingActor(),
      new FormActor(),
      new SelectedActor(),
      new EditActor(),
      new VisibleActor(),
      new ForbidActor(),
      new ExportActor()
    ];
  }

  initDistributorLevelBaseInfo = async () => {
    const list: any = await webapi.getDistributorLevelBaseInfo();
    if (list.res.code === Const.SUCCESS_CODE) {
      this.dispatch('set:distributor:level:list', list.res.context.list);
      this.dispatch('edit:distributor:level:list', list.res.context.list);
    }
  };

  init = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    this.dispatch('loading:start');
    this.switchInput();
    const query = this.state()
      .get('form')
      .toJS();
    this.searchCache = query;
    const { res } = await webapi.fetchDistributionCustomerList({
      ...query,
      pageNum,
      pageSize
    });
    if (res.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('loading:end');
        this.dispatch('listActor:init', res.context.distributionCustomerVOPage);
        this.dispatch('select:init', []);
      });
    } else {
      this.dispatch('loading:end');
      message.error(res.message);
    }
  };

  onFormChange = ({ field, value }) => {
    this.dispatch('form:field', { field, value });
  };

  /**
   * 更改搜索项
   */
  changeOption = (val) => {
    this.dispatch('form: changeOption', val);
  };

  onSearch = () => {
    this.init({ pageNum: 0, pageSize: 10 });
  };

  onSelect = (list) => {
    this.dispatch('select:init', list);
  };

  /**
   * 新增
   */
  onAdd = async () => {
    this.dispatch('modal:show');
  };

  //取消
  onCancel = () => {
    this.transaction(() => {
      this.dispatch('edit', false);
      this.dispatch('modal:hide');
    });
  };

  onSave = async (distributionCustomer) => {
    if (this.state().get('onSubmit')) {
      this.dispatch('modal:submit', false);
      //保存
      const { res } = await webapi.saveDistributionCustomer(
        distributionCustomer
      );
      if (res.code === Const.SUCCESS_CODE) {
        message.success(res.message);
        this.dispatch('modal:hide');
        this.init();
      } else {
        this.dispatch('modal:submit', true);
        message.error(res.message);
      }
    }
  };

  /**
   * 禁用或启用会员
   * @param distributionId
   * @returns {Promise<void>}
   */
  onCheckStatus = async (distributionId, forbiddenFlag, forbiddenReason) => {
    const { res } = await webapi.batchAudit(
      forbiddenFlag,
      [distributionId],
      forbiddenReason
    );
    if (res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.init();
    } else {
      message.error(res.message);
    }
  };
  /**
   * 控制禁用窗口显示
   * @param visible
   */
  setForbidModalVisible = (distributionId, visible) => {
    this.transaction(() => {
      this.dispatch('forbid:setForbidCustomerId', distributionId);
      this.dispatch('forbid:setForbidModalVisible', visible);
    });
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
   * 交换页面检索项
   */
  switchInput = () => {
    const {
      inviteCountStart,
      inviteCountEnd,
      inviteAvailableCountStart,
      inviteAvailableCountEnd,
      rewardCashStart,
      rewardCashEnd,
      distributionTradeCountStart,
      distributionTradeCountEnd,
      salesStart,
      salesEnd,
      commissionStart,
      commissionEnd
    } = this.state()
      .get('form')
      .toJS();
    if (parseFloat(inviteCountStart) > parseFloat(inviteCountEnd)) {
      this.onFormChange({ field: 'inviteCountStart', value: inviteCountEnd });
      this.onFormChange({ field: 'inviteCountEnd', value: inviteCountStart });
    }
    if (
      parseFloat(inviteAvailableCountStart) >
      parseFloat(inviteAvailableCountEnd)
    ) {
      this.onFormChange({
        field: 'inviteAvailableCountStart',
        value: inviteAvailableCountEnd
      });
      this.onFormChange({
        field: 'inviteAvailableCountEnd',
        value: inviteAvailableCountStart
      });
    }
    if (parseFloat(rewardCashStart) > parseFloat(rewardCashEnd)) {
      this.onFormChange({ field: 'rewardCashStart', value: rewardCashEnd });
      this.onFormChange({ field: 'rewardCashEnd', value: rewardCashStart });
    }
    if (
      parseFloat(distributionTradeCountStart) >
      parseFloat(distributionTradeCountEnd)
    ) {
      this.onFormChange({
        field: 'distributionTradeCountStart',
        value: distributionTradeCountEnd
      });
      this.onFormChange({
        field: 'distributionTradeCountEnd',
        value: distributionTradeCountStart
      });
    }
    if (parseFloat(salesStart) > parseFloat(salesEnd)) {
      this.onFormChange({ field: 'salesStart', value: salesEnd });
      this.onFormChange({ field: 'salesEnd', value: salesStart });
    }
    if (parseFloat(commissionStart) > parseFloat(commissionEnd)) {
      this.onFormChange({ field: 'commissionStart', value: commissionEnd });
      this.onFormChange({ field: 'commissionEnd', value: commissionStart });
    }
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
      message.error('请选择要导出的分销员');
      return new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
    }
    const form = this.state().get('form');
    return this._onExport({
      distributionIdList: selected.toJS(),
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
    let params = this.searchCache;

    const forbiddenFlag = params.forbiddenFlag;
    // 账号状态
    if (forbiddenFlag == '1') {
      params.forbiddenFlag = 'YES';
    } else if (forbiddenFlag == '0') {
      params.forbiddenFlag = 'NO';
    }
    params = QMMethod.trimValueDeep(params);
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
            Const.HOST + `/distribution/customer/export/params/${encrypted}`;
          window.open(exportHref);
        } else {
          message.error('请登录');
        }

        resolve();
      }, 500);
    });
  };
}
