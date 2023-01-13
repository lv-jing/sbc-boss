import { Store, IOptions } from 'plume2';
import { Const } from 'qmkit';
import { message } from 'antd';
import MiniInterfaceActor from './actor/mini-interface-actor';
import * as webapi from './webapi';
import actionType from './action-type';
import { Map } from 'immutable';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new MiniInterfaceActor()];
  }

  /**
   * 编辑表单
   */
  wxFormEdit = () => {
    this.dispatch(actionType.CHANGE_WX_FORM_SHOW);
    this.miniFormInit();
  };

  /**
   * 关闭表单
   */
  miniFormCancel = () => {
    this.dispatch(actionType.CHANGE_WX_FORM_SHOW);
  };

  /**
   * 初始化表单
   */
  miniFormInit = async () => {
    const { res } = await webapi.fetchWxMiniSet();
    //获取成功,有无内容
    if (res.code == Const.SUCCESS_CODE) {
      let miniSet = Map();
      if (res.context.context) {
        miniSet = miniSet.set('appId', JSON.parse(res.context.context).appId);
        miniSet = miniSet.set('appSecret', JSON.parse(res.context.context).appSecret);
        miniSet = miniSet.set('status', res.context.status);
      }
      //设置内容
      this.dispatch(actionType.WX_FORM_INIT, miniSet);
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
  saveMiniProgram = async (values) => {
    const { res } = await webapi.saveMiniProgram(values);
    if (res.code == Const.SUCCESS_CODE) {
      this.miniFormCancel();
      message.success('操作成功');
    } else {
      message.error(res.message);
    }
  };
}
