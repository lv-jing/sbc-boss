import { Store, IOptions } from 'plume2';
import { Const } from 'qmkit';
import { message } from 'antd';
import LoginInterfaceActor from './actor/login-interface-actor';
import * as webapi from './webapi';
import actionType from './action-type';
import { fromJS } from 'immutable';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new LoginInterfaceActor()];
  }

  /**
   * 编辑表单
   */
  wxFormEdit = () => {
    this.dispatch(actionType.CHANGE_WX_FORM_SHOW);
    this.wxFormInit();
  };

  /**
   * 关闭表单
   */
  wxFormCancel = () => {
    this.dispatch(actionType.CHANGE_WX_FORM_SHOW);
  };

  /**
   * 初始化表单
   */
  wxFormInit = async () => {
    const { res } = await webapi.fetchWxloginSet();
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch(actionType.WX_FORM_INIT, fromJS(res.context));
    } else {
      message.error(res.message);
    }
  };

  /**
   * 改变表单字段值
   */
  changeWxFormValue = (key, value) => {
    this.dispatch(actionType.CHANGE_WX_FORM_VALUE, { key, value });
  };

  /**
   * 保存
   */
  saveWx = async (values) => {
    const { res } = await webapi.saveWxloginSet(values);
    if (res.code == Const.SUCCESS_CODE) {
      this.wxFormCancel();
      message.success('操作成功');
    } else {
      message.error(res.message);
    }
  };
}
