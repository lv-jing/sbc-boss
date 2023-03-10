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
   * ??????
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
   * ??????????????????
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
   * ??????????????????
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
   * ??????????????????
   * @returns {Promise<void>}
   */
  batchConfirm = async () => {
    const selected = this.state().get('selected') as TList;
    if (selected.isEmpty()) {
      message.error('????????????????????????');
      return;
    }
    const { res } = await webapi.bathCheck(1, selected.toJS());
    this.messageByResult(res);
  };

  /**
   * ????????????
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
   * ???????????????
   * @returns {Promise<void>}
   */
  onSave = async (saveForm) => {
    const { res } = await webapi.saveInvoice(saveForm);
    if (res.code === Const.SUCCESS_CODE) {
      message.success('????????????');

      this.init();
      this.dispatch('modal:hide');
    } else {
      message.error(res.message);
    }
  };

  /**
   * ?????????????????????
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
   * ??????
   */
  onAdd = async () => {
    const { res } = await webapi.checkFunctionAuth('/customer/invoice', 'POST');
    if (!res.context) {
      message.error('??????????????????????????????');
      return;
    }

    this.dispatch('modal:show');
  };

  /**
   * ????????????
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
        message.error('???????????????');
      }
    }
  };

  /**
   * ??????
   * @param value
   * @param cc
   */
  fetch = async (value) => {
    let searchString = '';
    //??????????????????????????????
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
   * ??????
   */
  onCancel = () => {
    this.dispatch('modal:hide');
  };

  /**
   * ????????????
   * @param customerAccount
   */
  onSelectCustomer = (selectedCustomer) => {
    this.dispatch('tax:customerSelected', selectedCustomer);
  };

  /**
   * ????????????
   * @param cusomerId
   * @returns {Promise<void>}
   */
  validCustomer = async (cusomerId: string) => {
    const { res } = await webapi.findInvoiceByCustomerId(cusomerId);
    if (res && (res as any).customerInvoiceId) {
      message.error('????????????????????????!');
      return;
    }
  };

  messageByResult(res) {
    if (res.code === Const.SUCCESS_CODE) {
      message.success('????????????');

      this.init();
    } else {
      message.error(res.message);
    }
  }

  /**
   * ??????ids
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
   * ??????/?????? ??????
   */
  switchModal = (invoiceId: string) => {
    this.dispatch('modal: switch', invoiceId);
  };

  /**
   * ????????????
   */
  enterReason = (reason) => {
    this.dispatch('modal: reason', reason);
  };

  /**
   * ?????????????????????
   * @returns {Promise<void>}
   */
  rejectInvoice = async () => {
    let invoiceId = this.state().get('invoiceId');
    let reason = this.state().get('reason');
    let checkState = 2;
    const { res } = await webapi.rejectInvoice(invoiceId, reason, checkState);
    if (res.code === Const.SUCCESS_CODE) {
      message.success('????????????');
      this.switchModal('');

      this.init();
    } else {
      message.error(res.message);
    }
  };
}
