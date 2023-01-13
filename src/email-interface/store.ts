import { IOptions, Store } from 'plume2';
import { Const } from 'qmkit';
import { message } from 'antd';
import EmailInterfaceActor from './actor/email-interface-actor';
import * as webapi from './webapi';
import { fromJS } from 'immutable';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new EmailInterfaceActor()];
  }

  /**
   * 初始化表单
   */
  emailFormInit = async () => {
    const { res } = await webapi.fetchTxEmailConfig();
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('email:config:init', fromJS(res.context));
    } else {
      message.error(res.message);
    }
  };

  /**
   * 编辑表单
   */
  emailFormEdit = () => {
    this.dispatch('form:visitable:change');
  };

  /**
   * 关闭表单
   */
  emailFormCancel = () => {
    this.dispatch('form:visitable:change');
    this.emailFormInit();
  };

  /**
   * 改变表单字段值
   */
  changeEmailFormValue = (key, value) => {
    this.dispatch('email:form:edit', { key, value });
  };

  /**
   * 保存
   */
  saveEmail = async () => {
    const config = this.state().get('emailConfig');
    const { res } = await webapi.saveTxEmailConfig(config);
    if (res.code == Const.SUCCESS_CODE) {
      this.emailFormCancel();
      message.success('操作成功');
    } else {
      message.error(res.message);
    }
  };
}
