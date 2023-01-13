import { Store } from 'plume2';
import * as webapi from './webapi';
import { message } from 'antd';
import { fromJS, List } from 'immutable';
import { Const, Fetch, ValidConst } from 'qmkit';
import InvoiceActor from './actor/view-actor';
import EditActor from './actor/edit-actor';
import LoadingActor from './actor/loading-actor';
import ListActor from './actor/list-actor';
import SearchActor from './actor/search-actor';
import VisibleActor from './actor/visible-actor';
import CustomerActor from './actor/customer-actor';
import InvoiceConfigActor from './actor/invoice-config-actor';
import SelectedActor from './actor/selected-actor';
import ModalActor from './actor/modal-actor';

type TList = List<any>;
export default class AppStore extends Store {
  bindActor() {
    return [
      new InvoiceActor(),
      new EditActor(),
      new LoadingActor(),
      new ListActor(),
      new SearchActor(),
      new VisibleActor(),
      new CustomerActor(),
      new InvoiceConfigActor(),
      new SelectedActor(),
      new ModalActor()
    ];
  }

  constructor(props) {
    super(props);
    //debug
    (window as any)._store = this;
  }

  //;;;;;;;;;;;;;action;;;;;;;;;;;;;;;;;;;;;;;
  init = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    this.dispatch('loading:start');
    let param = this.state()
      .get('searchForm')
      .toJS();
    let status = param.checkState == 99 ? null : param.checkState;
    param.checkState = status;
    param.pageNum = pageNum;
    param.pageSize = pageSize;

    const { res } = await webapi.fetchInvoices(param);
    const { res: invoiceConfig } = await webapi.invoiceConfig();

    if (res.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('loading:end');
        this.dispatch('list:init', res.context);
        this.dispatch('invoiceConfig', fromJS((invoiceConfig as any).context));
        this.dispatch('select:init', []);
      });
    } else {
      message.error(res.message);
      if (res.code === 'K-110001') {
        this.dispatch('loading:end');
      }
    }
  };

  /**
   * 查询
   * @returns {Promise<void>}
   */
  onSearch = async () => {
    const param = this.state()
      .get('searchForm')
      .toJS();
    if (param.checkState == '99') {
      param.checkState = null;
    }
    const { res } = await webapi.fetchInvoices(param);

    this.transaction(() => {
      this.dispatch('loading:end');
      this.dispatch('list:init', res.context);
    });
  };

  /**
   * onTabChange
   * @param checkState
   */
  onTabChange = (checkState: number) => {
    let searchParam = { field: 'checkState', value: checkState };
    this.dispatch('change:searchForm', searchParam);

    this.init();
  };

  /**
   * 删除增专资质
   * @param id
   * @returns {Promise<void>}
   */
  deleteByInvoiceId = async (id: number) => {
    let ids = [];
    ids.push(id);
    const { res } = await webapi.batchDeleteInvoice(ids);
    this.messageByResult(res);
  };

  /**
   * 作废增专资质
   * @param id
   * @returns {Promise<void>}
   */
  destroyByInvoiceId = async (id: number) => {
    let ids = [];
    ids.push(id);
    const { res } = await webapi.batchDestoryInvoice(ids);
    this.messageByResult(res);
  };

  /**
   * 批量审核通过
   * @returns {Promise<void>}
   */
  batchConfirm = async () => {
    const selected = this.state().get('selected') as TList;
    if (selected.isEmpty()) {
      message.error('请选择要操作的行');
      return;
    }
    const { res } = await webapi.bathCheck(1, selected.toJS());
    this.messageByResult(res);
  };

  /**
   * 审核通过
   * @param id
   * @returns {Promise<void>}
   */
  confirmByInvoiceId = async (id: number) => {
    let ids = [];
    ids.push(id);
    const { res } = await webapi.bathCheck(1, ids);
    this.messageByResult(res);
  };

  /**
   * 保存增专票
   * @returns {Promise<void>}
   */
  onSave = async (saveForm) => {
    const { res } = await webapi.saveInvoice(saveForm);
    if (res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');

      this.init();
      this.dispatch('modal:hide');
    } else {
      message.error(res.message);
    }
  };

  /**
   * 查看增专票信息
   * @param id
   * @returns {Promise<void>}
   */
  findByInvoiceId = async (id: number) => {
    const { res } = await webapi.findInvoiceById(id);
    this.dispatch('invoice', fromJS(res));
  };

  onFormChange = (searchParam) => {
    this.dispatch('change:searchForm', searchParam);
  };

  /**
   * 新增
   */
  onAdd = async () => {
    const { res } = await webapi.checkFunctionAuth('/customer/invoice', 'POST');
    if (!res.context) {
      message.error('此功能您没有权限访问');
      return;
    }

    this.dispatch('modal:show');
  };

  /**
   * 点击事件
   * @param value
   */
  handleSearch = async (value) => {
    if (value) {
      const array = [];
      array.push({ customerAccount: value });
      this.dispatch('tax:customers', fromJS(array));
    }
    if (ValidConst.number.test(value)) {
      await this.fetch(value);
      if (
        this.state()
          .get('customers')
          .count() === 0
      ) {
        message.error('客户不存在');
      }
    }
  };

  /**
   * 请求
   * @param value
   * @param cc
   */
  fetch = async (value) => {
    let searchString = '';
    //搜索的字符串搜出来的
    if (
      this.state().get('customers').count < 10 &&
      searchString.indexOf(value) !== -1
    ) {
      return;
    }

    await Fetch<TResult>(`/customer/all/${value}`).then(({ res }) => {
      searchString = value;
      this.dispatch('tax:customers', res);
    });
  };

  /**
   * 取消
   */
  onCancel = () => {
    this.dispatch('modal:hide');
  };

  /**
   * 会员选择
   * @param customerAccount
   */
  onSelectCustomer = (selectedCustomer) => {
    this.dispatch('tax:customerSelected', selectedCustomer);
  };

  /**
   * 验证客户
   * @param cusomerId
   * @returns {Promise<void>}
   */
  validCustomer = async (cusomerId: string) => {
    const { res } = await webapi.findInvoiceByCustomerId(cusomerId);
    if (res && (res as any).customerInvoiceId) {
      message.error('客户已有增票资质!');
      return;
    }
  };

  messageByResult(res) {
    if (res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');

      this.init();
    } else {
      message.error(res.message);
    }
  }

  /**
   * 选中ids
   * @param ids
   */
  onSelect = (list) => {
    this.dispatch('select:init', list);
  };

  onChangeSwitch = (checked) => {
    const status = checked ? 1 : 0;
    webapi.saveInvoiceStatus(status).then(() => {
      this.dispatch('updateInvoiceStatus', status);
    });
  };

  /**
   * 显示/关闭 弹窗
   */
  switchModal = (invoiceId: string) => {
    this.dispatch('modal: switch', invoiceId);
  };

  /**
   * 输入原因
   */
  enterReason = (reason) => {
    this.dispatch('modal: reason', reason);
  };

  /**
   * 增票审核不通过
   * @returns {Promise<void>}
   */
  rejectInvoice = async () => {
    let invoiceId = this.state().get('invoiceId');
    let reason = this.state().get('reason');
    let checkState = 2;
    const { res } = await webapi.rejectInvoice(invoiceId, reason, checkState);
    if (res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.switchModal('');

      this.init();
    } else {
      message.error(res.message);
    }
  };
}
