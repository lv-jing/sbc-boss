import { Store, IOptions } from 'plume2';
import { fromJS } from 'immutable';
import { message } from 'antd';
import { Const } from 'qmkit';

import * as webapi from './webapi';
import PictureActor from './actor/picture-actor';
import VisibleActor from './actor/visible-actor';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new PictureActor(), new VisibleActor()];
  }

  /**
   * 初始化
   * @returns {Promise<void>}
   */
  init = async () => {
    const { res } = await webapi.fetchAllPicture();
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('picture:init', fromJS(res.context));
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
    const { res } = await webapi.fetchPicture(id);
    if (res.code == Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('modal:show');
        this.dispatch('picture:edit', res.context);
        this.dispatch('picture:edit', res.context.aliyun);
      });
    } else {
      message.error(res.message);
    }
  };

  //取消
  onCancel = () => {
    this.dispatch('modal:hide');
  };

  //保存
  onSave = async (params) => {
    const aliYun = {
      endPoint: params.endPoint,
      accessKeyId: params.accessKeyId,
      accessKeySecret: params.accessKeySecret,
      bucketName: params.bucketName
    };
    const { res } = await webapi.editPicture({
      id: this.state().getIn(['pictureForm', 'id']),
      configType: this.state().getIn(['pictureForm', 'configType']),
      status: 1,
      aliyun: aliYun
    });
    if (res.code == Const.SUCCESS_CODE) {
      this.init();
      this.dispatch('modal:hide');
    } else {
      message.error(res.message);
    }
  };
}
