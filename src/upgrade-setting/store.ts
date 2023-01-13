import { Store, IOptions } from 'plume2';
import * as webapi from './webapi';

import { message } from 'antd';

import InfoActor from './actor/info-actor';
import { Const } from 'qmkit';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    // debug
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new InfoActor()];
  }

  /**
   * 初始化
   * @returns {Promise<void>}
   */
  init = async () => {
    const { res } = await webapi.fetchUpgradeInfo();
    if (res.code == Const.SUCCESS_CODE) {
      if (res.context) {
        this.dispatch('init', res.context);
      }
    }
  };

  /**
   * 修改升级配置信息字段
   */
  onChange = ({ field, value }) => {
    this.dispatch('app: upgrade: edit', { field, value });
  };

  /**
   * 编辑保存
   * @param info
   * @returns {Promise<void>}
   */
  onSaveSetting = async (info) => {
    const { res } = await webapi.saveUpgradeSetting(info);
    if (res.code == Const.SUCCESS_CODE) {
      message.success('操作成功！');
      this.init();
    } else {
      message.error(res.message);
    }
  };
}
