import { Store, IOptions } from 'plume2';
import { fromJS } from 'immutable';
import { message } from 'antd';
import { Const } from 'qmkit';

import * as webapi from './webapi';
import ResourceActor from './actor/resource-actor';
import VisibleActor from './actor/visible-actor';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new ResourceActor(), new VisibleActor()];
  }

  /**
   * 初始化
   * @returns {Promise<void>}
   */
  init = async () => {
    const { res } = await webapi.fetchAllResource();
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('resource:init', fromJS(res.context.systemConfigVOS));
    } else {
      message.error(res.message);
    }
  };

  /**
   * 编辑
   * @param id
   * @returns {Promise<void>}
   */
  onEdit = async (id) => {
    const { res } = await webapi.fetchResource(id);
    if (res.code == Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('modal:show');
        this.dispatch('resource:edit', res.context);
      });
    } else {
      message.error(res.message);
    }
  };

  /**
   * 根据状态进行启用或停用操作*/
  changeStatus = async (id) => {
    const { res: resource } = await webapi.fetchResource(id);
    if (resource.code === Const.SUCCESS_CODE) {
      const { res } = await webapi.editResource({
        id: resource.context.id,
        status: 1
      });
      this.messageByResult(res);
    } else {
      message.error(resource.message);
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

  //取消
  onCancel = () => {
    this.dispatch('modal:hide');
  };

  //保存
  onSave = async (params) => {
    const context = JSON.stringify({
      endPoint: params.endPoint,
      accessKeyId: params.accessKeyId,
      accessKeySecret: params.accessKeySecret,
      bucketName: params.bucketName,
      region: params.region
    });
    const { res } = await webapi.editResource({
      id: this.state().getIn(['resourceForm', 'id']),
      configType: this.state().getIn(['resourceForm', 'configType']),
      status: this.state().getIn(['resourceForm', 'state']),
      context: context
    });
    if (res.code == Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.init();
      this.dispatch('modal:hide');
    } else {
      message.error(res.message);
    }
  };
}
