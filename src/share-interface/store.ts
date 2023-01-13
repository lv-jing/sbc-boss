import { Store, IOptions } from 'plume2';
import { Const } from 'qmkit';
import { message } from 'antd';
import ShareInterfaceActor from './actor/share-interface-actor';
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
    return [new ShareInterfaceActor()];
  }

  changeWxFormVisible = () => {
    this.dispatch('changeWxFormVisible');
  };

  /**
   * 初始化表单
   */
  wxFormInit = async () => {
    const { res } = (await webapi.queryWechatShareSet()) as any;
    if (res.code == Const.SUCCESS_CODE) {
      if (res.context) {
        this.dispatch('wxFromInit', fromJS(res.context));
      }
      this.changeWxFormVisible();
    } else {
      message.error(res.message);
    }
  };

  /**
   * 改变表单字段值
   */
  changeWxFormValue = (key, value) => {
    this.dispatch('changeWxFrom', { key, value });
  };

  /**
   * 保存
   */
  saveWx = async (values) => {
    const { res } = (await webapi.saveWxShareInfo(values)) as any;
    if (res.code == Const.SUCCESS_CODE) {
      this.changeWxFormVisible();
      message.success('操作成功');
    } else {
      message.error(res.message);
    }
  };
}
