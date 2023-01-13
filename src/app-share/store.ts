import { Store, IOptions } from 'plume2';
import { fromJS } from 'immutable';
import { message } from 'antd';
import { Const } from 'qmkit';
import * as webapi from './webapi';
import AppShareActor from './actor/app-share-actor';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    // debug
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new AppShareActor()];
  }

  /**
   * 初始化
   */
  init = async () => {
    const { res } = (await webapi.getAppShareSetting()) as any;
    if (res.code == Const.SUCCESS_CODE) {
      let context = res.context;
      if (context != null) {
        context.icon = context.icon
          ? [{ uid: 1, status: 'done', url: context.icon }]
          : [];
        context.downloadImg = context.downloadImg
          ? [{ uid: 1, status: 'done', url: context.downloadImg }]
          : [];
        context.shareImg = context.shareImg
          ? [{ uid: 1, status: 'done', url: context.shareImg }]
          : [];
      }
      this.dispatch('init', fromJS(context));
    } else {
      message.error(res.message);
    }
  };

  /**
   * 保存
   */
  save = async (params) => {
    const { res } = (await webapi.modifyAppShareSetting(params)) as any;
    if (res.code == Const.SUCCESS_CODE) {
      message.success('保存成功!');
    } else {
      message.error(res.message);
    }
  };

  /**
   * 修改表单信息
   */
  onFormFieldChange = (key, value) => {
    this.dispatch('form:field:change', { key, value: fromJS(value) });
  };
}
