import { Store, IOptions } from 'plume2';
import { message, Modal } from 'antd';

import {Const, util} from 'qmkit';
import {
  getDrawCashList,
  updataDrawCashAuditPassStatusById,
  updataDrawCashAuditRejectStatusById,
  gather,
  updataDrawCashBatchAuditPassStatusById,
  tryAgain
} from './webapi';
import FormActor from './actor/form-actor';
import ExportActor from './actor/export-actor';
import { fromJS } from 'immutable';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      window['_store'] = this;
    }
  }

  bindActor() {
    return [new FormActor(),new ExportActor()];
  }

  /**
   * 初始化各标签页条数
   */
  gather = async () => {
    const gathers: any = await gather();
    if (gathers.res.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('draw: gather', gathers.res.context);
      });
    } else {
      message.error(gathers.res.message);
    }
  };

  /**
   * 初始化会员提现列表
   * @param pageNum
   * @param pageSize
   */
  init = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    this.dispatch('select:init', []);
    this.dispatch('loading:start');
    const params = this.state()
      .get('form')
      .toJS();

    const pageList: any = await getDrawCashList({
      ...params,
      pageSize,
      pageNum
    });
    this.dispatch('loading:end');
    if (pageList.res.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('draw: init', pageList.res.context);
        this.dispatch('list:currentPage', pageNum && pageNum + 1);
      });
    } else {
      message.error(pageList.res.message);
    }
  };

  /**
   * 切换tab页
   * @param checkState
   */
  onTabChange = (checkState: number) => {
    this.gather();
    let searchParam = { field: 'checkState', value: checkState };

    this.dispatch('change:form', searchParam);
    let state = { checkState: checkState == 99 ? null : checkState };
    let param = this.state()
      .get('form')
      .toJS();

    param.checkState = state.checkState;

    param.auditStatus = '';
    this.dispatch('change:form', { field: 'auditStatus', value: '' });

    param.finishStatus = '';
    this.dispatch('change:form', { field: 'finishStatus', value: '' });

    param.drawCashStatus = '';
    this.dispatch('change:form', { field: 'drawCashStatus', value: '' });

    param.customerOperateStatus = '';
    this.dispatch('change:form', { field: 'customerOperateStatus', value: '' });

    param.pageNum = 0;
    this.dispatch('change:form', { field: 'pageNum', value: '0' });

    if (checkState == 0) {
      param.auditStatus = '0';
      this.dispatch('change:form', { field: 'auditStatus', value: '0' });
      this.dispatch('change:form', { field: 'drawCashStatus', value: '0' });
      this.dispatch('change:form', {
        field: 'customerOperateStatus',
        value: '0'
      });
      this.dispatch('change:form', {
        field: 'finishStatus',
        value: '0'
      });
    } else if (checkState == 1) {
      param.finishStatus = '1';
      this.dispatch('change:form', { field: 'auditStatus', value: '2' });
      this.dispatch('change:form', { field: 'finishStatus', value: '1' });
      this.dispatch('change:form', {
        field: 'customerOperateStatus',
        value: '0'
      });
      this.dispatch('change:form', { field: 'drawCashStatus', value: '2' });
    } else if (checkState == 2) {
      param.drawCashStatus = '1';
      this.dispatch('change:form', { field: 'auditStatus', value: '2' });
      this.dispatch('change:form', { field: 'finishStatus', value: '0' });
      this.dispatch('change:form', { field: 'drawCashStatus', value: '1' });
      this.dispatch('change:form', {
        field: 'customerOperateStatus',
        value: '0'
      });
    } else if (checkState == 3) {
      param.auditStatus = '1';
      this.dispatch('change:form', { field: 'auditStatus', value: '1' });
      this.dispatch('change:form', { field: 'finishStatus', value: '0' });
      this.dispatch('change:form', { field: 'drawCashStatus', value: '0' });
      this.dispatch('change:form', {
        field: 'customerOperateStatus',
        value: '0'
      });
    } else if (checkState == 4) {
      param.customerOperateStatus = '1';
      let customerOperateStatus = {
        field: 'customerOperateStatus',
        value: '1'
      };
      this.dispatch('change:form', customerOperateStatus);
      this.dispatch('change:form', { field: 'finishStatus', value: '0' });
      this.dispatch('change:form', { field: 'drawCashStatus', value: '0' });
      this.dispatch('change:form', { field: 'auditStatus', value: '0' });
    }
    this.init(param);
  };

  /**
   * 选择
   * @param list
   */
  onSelect = (list) => {
    this.dispatch('select:init', list);
  };

  /**
   * 搜索
   * @param params
   */
  onSearch = (params) => {
    this.dispatch('form:clear');
    if (params.customerOptions == 'customerName') {
      params.customerName = params.customerOptionsValue;
      params.customerAccount = null;
      this.dispatch('change:form', {
        field: 'customerName',
        value: params.customerOptionsValue
      });
      this.dispatch('change:form', { field: 'customerAccount', value: '' });
    }
    if (params.customerOptions == 'customerAccount') {
      params.customerAccount = params.customerOptionsValue;
      params.customerName = null;
      this.dispatch('change:form', {
        field: 'customerAccount',
        value: params.customerOptionsValue
      });
      this.dispatch('change:form', { field: 'customerName', value: '' });
    }
    //暂时不删
    // if (params.drawCashOptions == 'drawCashAccount') {
    //   params.drawCashAccount = params.drawCashOptionsValue;
    //   params.drawCashAccountName = null;
    //   this.dispatch('change:form', {
    //     field: 'drawCashAccount',
    //     value: params.drawCashOptionsValue
    //   });
    //   this.dispatch('change:form', {
    //     field: 'drawCashAccountName',
    //     value: ''
    //   });
    // }
    // if (params.drawCashOptions == 'drawCashAccountName') {
    //   params.drawCashAccountName = params.drawCashOptionsValue;
    //   params.drawCashAccount = null;
    //   this.dispatch('change:form', {
    //     field: 'drawCashAccountName',
    //     value: params.drawCashOptionsValue
    //   });
    //   this.dispatch('change:form', { field: 'drawCashAccount', value: '' });
    // }
    this.dispatch('form:field', params);

    this.init(params);
  };

  /**
   * 单个审核 => 不通过
   * @param drawCashId
   * @param rejectReason
   */
  onAuditStatus = async (drawCashId, rejectReason) => {
    const { res } = await updataDrawCashAuditRejectStatusById(
      drawCashId,
      1,
      rejectReason
    );
    if (res.code === Const.SUCCESS_CODE) {
      message.success('驳回成功');
      this.init();
      this.gather();
    } else {
      message.error(res.message);
    }
  };

  /**
   * 控制驳回窗口显示
   * @param drawCashId
   * @param visible
   */
  setRejectModalVisible = (drawCashId, visible) => {
    this.transaction(() => {
      this.dispatch('reject:setRejectDrawCashId', drawCashId);
      this.dispatch('reject:setRejectModalVisible', visible);
    });
  };

  /**
   * 重试微信提现接口
   * @param drawCashId
   */
  tryAgain = async (drawCashId) => {
    const { res } = await tryAgain(drawCashId);
    if (res.code != Const.SUCCESS_CODE) {
      message.error(res.message);
      return;
    }
    message.success('操作成功');
    //刷新页面
    this.init();
  };

  /**
   * 设置form参数
   */
  setFormField = (field, value) => {
    this.dispatch('form: field', { field, value });
  };

  onFormChange = ({ field, value }) => {
    this.dispatch('form:field', { field, value });
  };

  onFormChangeInput = ({ field, value }) => {
    if (field == 'customerOptionsValue') {
      if (this.state().get('customerOptions') == 'customerName') {
        this.dispatch('form:field:customerName', value);
      }
      if (this.state().get('customerOptions') == 'customerAccount') {
        this.dispatch('form:field:customerAccount', value);
      }
    }
    //暂时不删
    // if (field == 'drawCashOptionsValue') {
    //   if (this.state().get('drawCashOptions') == 'drawCashAccount') {
    //     this.dispatch('form:field:drawCashAccount', value);
    //   }
    //   if (this.state().get('drawCashOptions') == 'drawCashAccountName') {
    //     this.dispatch('form:field:drawCashAccountName', value);
    //   }
    // }
  };

  /**
   * 批量审核 => 通过
   */
  onBatchAudit = async () => {
    let param = this.state()
      .get('form')
      .toJS();
    if (param.checkState != '0') {
      message.error('暂无可审核的提现单');
      return;
    }
    const selected = this.state().get('selected');
    if (selected.isEmpty()) {
      message.error('请先选择您要操作的数据');
      return;
    }

    const confirm = Modal.confirm;
    confirm({
      title: '批量审核',
      content:
        '确定批量审核通过所选提现申请？\n' +
        '\n' +
        '审核通过后，系统将会自动向所有提现账户进行打款。',
      onOk: async () => {
        const drawCashIdList = selected.toArray();
        const { res } = await updataDrawCashBatchAuditPassStatusById(
          drawCashIdList,
          2
        );
        if (res.code == Const.SUCCESS_CODE) {
          message.success('批量审核成功');
          //refresh
          this.init();
          this.gather();
        } else {
          message.error(res.message);
        }
      }
    });
  };

  /**
   * 单个审核 => 通过
   * @param drawCashId
   */
  onConfirm = async (drawCashId) => {
    const { res } = await updataDrawCashAuditPassStatusById(drawCashId, 2);

    if (res.code === Const.SUCCESS_CODE) {
      message.success('审核成功');
      this.init();
      this.gather();
    } else {
      message.error(res.message);
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
      message.error('请选择要导出的会员提现记录');
      return new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
    }
    let param = this.state()
        .get('form')
        .toJS();

    // 提现状态
    const checkState = param.checkState;
    if (checkState == 0) {
      param.checkState='CHECK';
    } else if (checkState == 1) {
      param.checkState='FINISH';
    } else if (checkState == 2) {
      param.checkState='FAIL';
    } else if (checkState == 3) {
      param.checkState='NOT_AUDIT';
    } else if (checkState == 4) {
      param.checkState='CANCEL';
    }
    // 设置选中编号
    return this._onExport({ drawCashIdList: selected.toJS(), checkState:param.checkState});
  };

  /**
   * 按搜索条件导出
   * @returns {Promise<T>}
   */
  onExportByParams = () => {
    // 搜索条件
    let param = this.state()
        .get('form')
        .toJS();

    // 提现状态
    const checkState = param.checkState;
    if (checkState == 0) {
      param.auditStatus = 'WAIT';
      param.drawCashStatus = 'WAIT';
      param.customerOperateStatus = 'APPLY';
      param.finishStatus = 'UNSUCCESS';
      param.checkState='CHECK';
    } else if (checkState == 1) {
      param.finishStatus = 'SUCCESS';
      param.auditStatus = 'PASS';
      param.customerOperateStatus = 'APPLY';
      param.drawCashStatus = 'SUCCESS';
      param.checkState='FINISH';
    } else if (checkState == 2) {
      param.drawCashStatus = 'FAIL';
      param.auditStatus = 'PASS';
      param.finishStatus = 'UNSUCCESS';
      param.customerOperateStatus = 'APPLY';
      param.checkState='FAIL';
    } else if (checkState == 3) {
      param.auditStatus = 'REJECT';
      param.finishStatus = 'UNSUCCESS';
      param.drawCashStatus = 'WAIT';
      param.customerOperateStatus = 'APPLY';
      param.checkState='NOT_AUDIT';
    } else if (checkState == 4) {
      param.customerOperateStatus = 'CANCEL';
      param.finishStatus = 'UNSUCCESS';
      param.drawCashStatus = 'WAIT';
      param.auditStatus = 'WAIT';
      param.checkState='CANCEL';
    }

    return this._onExport(param);
  };


  _onExport = (param: {}) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 参数加密
        let base64 = new util.Base64();
        const token = (window as any).token;
        if (token) {
          let result = JSON.stringify({ ...param, token: token });
          let encrypted = base64.urlEncode(result);

          // 新窗口下载
          const exportHref = Const.HOST + `/draw/cash/export/params/${encrypted}`;
          window.open(exportHref);
        } else {
          message.error('请登录');
        }

        resolve();
      }, 500);
    });
  };
}
