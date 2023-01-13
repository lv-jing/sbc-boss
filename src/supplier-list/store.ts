import { Store } from 'plume2';

import { message } from 'antd';

import OperateModal from './actor/modal-actor';
import * as webApi from './webapi';
import CompanyActor from './actor/company-actor';
import { Const } from 'qmkit';

export default class AppStore extends Store {
  constructor(props) {
    super(props);
  }

  bindActor() {
    return [new OperateModal(), new CompanyActor()];
  }

  /**
   * 显示/关闭 弹窗
   */
  switchModal = ({ modalType, id = -1 }) => {
    this.dispatch('modal: switch', { modalType, id });
  };

  /**
   * 初始化商家列表
   */
  initSuppliers = async (
    { pageNum, pageSize } = { pageNum: 0, pageSize: 10 }
  ) => {
    this.dispatch('company: setLoading', true);
    const params = this.state().get('form').toJS();
    const { res } = await webApi.fetchSupplierList({
      ...params,
      pageSize,
      pageNum
    });
    if (res?.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('company: init: supplier', res.context);
        this.dispatch('company: currentPage', pageNum && pageNum + 1);
      });
      this.dispatch('company: setLoading', false);
    } else {
      this.dispatch('company: setLoading', false);
      message.error(res.message);
    }
  };

  /**
   * 切换tab
   */
  changeTab = (auditState) => {
    this.dispatch('company: form: set', auditState);
    this.initSuppliers();
  };

  /**
   * 设置form参数
   */
  setField = ({ field, value }) => {
    this.dispatch('company: form: field', { field, value });
  };

  /**
   * 更改搜索项
   */
  changeOption = (val) => {
    this.dispatch('company: form: changeOption', val);
  };

  /**
   * 输入原因
   */
  enterReason = (reason) => {
    this.dispatch('modal: reason', reason);
  };

  /**
   * 启用/禁用 账号
   */
  reject = async ({ companyInfoId, accountState }) => {
    const reason = this.state().get('reason');
    const { res } = await webApi.switchEmployee({
      companyInfoId,
      accountDisableReason: reason,
      accountState
    });
    if (res.code == Const.SUCCESS_CODE) {
      if (accountState == 0) {
        message.success('启用成功!');
      } else if (accountState == 1) {
        message.success('禁用成功!');
        this.switchModal({ modalType: 0, id: -1 });
      }
      this.initSuppliers();
    } else {
      message.error(res.message);
    }
  };

  /**
   * 开店/关店
   */
  switchStore = async ({ storeId, storeState }) => {
    const reason = this.state().get('reason');
    const { res } = await webApi.switchStore({
      storeId,
      storeClosedReason: reason,
      storeState
    });
    if (res.code == Const.SUCCESS_CODE) {
      if (storeState == 0) {
        message.success('开店成功!');
      } else if (storeState == 1) {
        message.success('关店成功!');
        this.switchModal({ modalType: 0, id: -1 });
      }
      this.initSuppliers();
    } else {
      message.error(res.message);
    }
  };
}
