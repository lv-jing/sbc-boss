import { Store } from 'plume2';
import ListActor from './actor/list-actor';
import * as webapi from './webapi';
import SearchActor from './actor/search-actor';
import LoadingActor from './actor/loading-actor';
import SelectedActor from './actor/selected-actor';
import { message } from 'antd';
import VisibleActor from './actor/visible-actor';
import EditActor from './actor/edit-actor';
import ViewActor from './actor/view-actor';
import { fromJS } from 'immutable';
import momnet from 'moment';
import { Const, QMMethod } from 'qmkit';

export default class AppStore extends Store {
  bindActor() {
    return [
      new ListActor(),
      new SearchActor(),
      new LoadingActor(),
      new SelectedActor(),
      new VisibleActor(),
      new EditActor(),
      new ViewActor()
    ];
  }

  constructor(props) {
    super(props);
    //debug
    (window as any)._store = this;
  }

  //;;;;;;;;;;;;;action;;;;;;;;;;;;;;;;;;;;;;;
  init = async (param?) => {
    this.dispatch('loading:start');
    const searchForm = this.state()
      .get('searchForm')
      .merge(fromJS(param));
    const { res } = await webapi.fetchPayOrderList(searchForm.toJS());

    this.transaction(() => {
      this.dispatch('loading:end');
      this.dispatch('list:init', res);
      this.dispatch('current', param && param.pageNum + 1);
      this.dispatch('select:init', []);
    });
  };

  onFormChange = (searchParam) => {
    this.dispatch('change:searchForm', searchParam);
  };

  /**
   * 查询
   * @returns {Promise<void>}
   */
  onSearch = QMMethod.onceFunc(async () => {
    const param = this.state()
      .get('searchForm')
      .toJS();

    const { res } = await webapi.fetchPayOrderList(param);

    this.transaction(() => {
      this.dispatch('loading:end');
      this.dispatch('list:init', res);
      this.dispatch('current', 1);
    });
  }, 1000);

  onSelect = (list) => {
    this.dispatch('select:init', list);
  };

  /**
   * 批量
   */
  onBatchConfirm = async () => {
    const { res: result } = await webapi.checkFunctionAuth(
      '/account/confirm',
      'POST'
    );
    if (!result.context) {
      message.error('此功能您没有权限访问');
      return;
    }

    let selected = this.state().get('selected');
    if (selected.isEmpty()) {
      message.error('请先选择订单');
      return;
    }
    selected = this.state()
      .get('dataList')
      .filter(
        (data) =>
          selected.includes(data.get('payOrderId')) &&
          data.get('payOrderStatus') == 2
      )
      .map((data) => data.get('payOrderId'));
    if (selected.count() <= 0) {
      this.successMsgThenInit();
      return;
    }

    const { res } = await webapi.confirm(selected.toJS());
    this.messageByResult(res);
  };

  /**
   * 批量作废
   * @returns {Promise<void>}
   */
  onBatchDestory = async () => {
    const { res: result } = await webapi.checkFunctionAuth(
      '/account/payOrder/destory',
      'PUT'
    );
    if (!result.context) {
      message.error('此功能您没有权限访问');
      return;
    }

    const selected = this.state().get('selected');
    if (selected.isEmpty()) {
      message.error('请先选择订单');
      return;
    }
    const orderIds = this.state()
      .get('dataList')
      .filter((data) => selected.includes(data.get('payOrderId')))
      .map((data) => data.get('orderCode'));

    for (let orderId of orderIds) {
      const { res: verifyRes } = await webapi.verifyAfterProcessing(orderId);

      if (
        verifyRes.code === Const.SUCCESS_CODE &&
        verifyRes.context.length > 0
      ) {
        message.error('订单已申请退货，不能作废收款记录');
        return;
      }
    }

    const { res } = await webapi.destory(selected.toJS());
    this.messageByResult(res);
  };

  onConfirm = async (id) => {
    let ids = [];
    ids.push(id);
    const { res } = await webapi.confirm(ids);
    this.messageByResult(res);
  };

  onDestory = async (id) => {
    let ids = [];
    ids.push(id);
    const { res: verifyRes } = await webapi.verifyAfterProcessing(
      this.state()
        .get('dataList')
        .find((data) => data.get('payOrderId') === id)
        .get('orderCode')
    );
    if (verifyRes.code === Const.SUCCESS_CODE && verifyRes.context.length > 0) {
      message.error('订单已申请退货，不能作废收款记录');
      return;
    }
    const { res } = await webapi.destory(ids);
    this.messageByResult(res);
  };

  onCreateReceivable = async (payOrderId) => {
    const { res: result } = await webapi.checkFunctionAuth(
      '/account/receivable',
      'POST'
    );
    if (!result.context) {
      message.error('此功能您没有权限访问');
      return;
    }

    const { res } = await webapi.offlineAccounts();
    this.dispatch('offlineAccount', fromJS(res));
    this.dispatch('offlineAccount:payOrderId', payOrderId);
    this.dispatch('modal:show');
  };

  onCancel = async () => {
    this.dispatch('modal:hide');
  };

  messageByResult(res) {
    if (res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.init({ pageNum: 0, pageSize: 10 });
    } else {
      message.error(res.message);
    }
  }

  /**
   * 保存
   * @param receivableForm
   * @returns {Promise<void>}
   */
  onSave = async (receivableForm) => {
    receivableForm.payOrderId = this.state().get('payOrderId');
    receivableForm.createTime = momnet(receivableForm.createTime)
      .format('YYYY-MM-DD')
      .toString();
    //保存
    const { res } = await webapi.addReceivable(receivableForm);
    if (res.code === Const.SUCCESS_CODE) {
      message.success(res.message);
      this.dispatch('modal:hide');
      this.init({});
    } else {
      message.error(res.message);
    }
  };

  /**
   * 操作成功提示
   */
  successMsgThenInit = () => {
    message.success('操作成功');
    this.init({ pageNum: 0, pageSize: 10 });
  };

  /**
   * 查看
   * @param {string} id
   */
  onView = (id: string) => {
    const receive = this.state()
      .get('dataList')
      .find((receive) => receive.get('payOrderId') == id);

    this.transaction(() => {
      this.dispatch('receive:receiveView', receive);
      this.dispatch('viewModal:show');
    });
  };

  /**
   * 隐藏视图
   */
  onViewHide = () => {
    this.dispatch('viewModal:hide');
  };
}
