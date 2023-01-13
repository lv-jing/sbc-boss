import { Store, IOptions } from 'plume2';
import { message } from 'antd';
import { Const } from 'qmkit';
import VisibleActor from './actor/visible-actor';
import ExpPortActor from './actor/expport-actor';
import * as webapi from './webapi';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new VisibleActor(), new ExpPortActor(), new VisibleActor()];
  }

  init = async () => {
    const { res } = await webapi.fetchAllExpressPort();
    this.dispatch('port:init', res);
    this.dispatch('port:edit', res);
  };

  onEdit = () => {
    this.transaction(() => {
      this.dispatch('modal:show');
    });
  };

  onCancel = () => {
    this.dispatch('modal:hide');
  };

  /**
   * 保存修改（编辑）*/
  onSave = async (form) => {
    /**
     * 获取秘钥并将空格去除*/
    const deliveryKey = form.deliveryKey.replace(/\s/g, '');
    const customerKey = form.customerKey.replace(/\s/g, '');
    const { status } = form;
    const { configId } = this.state().get('portObj');
    if (configId == '') {
      const { res } = await webapi.savePort(
        configId,
        customerKey,
        deliveryKey,
        status
      );
      this.messageByResult(res);
    } else {
      const { res } = await webapi.editPort(
        configId,
        customerKey,
        deliveryKey,
        status
      );
      this.messageByResult(res);
    }
  };

  messageByResult(res) {
    if (res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.dispatch('modal:hide');
      this.init();
    } else {
      message.error(res.message);
    }
  }

  /**
   * 根据状态进行启用或停用操作*/
  changeStatus = async (status: number) => {
    const { configId } = this.state().get('portObj');
    const { deliveryKey } = this.state().get('portObj');
    const { customerKey } = this.state().get('portObj');
    const { res } = await webapi.editPort(
      configId,
      customerKey,
      deliveryKey,
      status
    );
    this.messageByResult(res);
  };
}
