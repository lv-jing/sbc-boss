import { Store, IOptions } from 'plume2';
import { fromJS } from 'immutable';
import { message } from 'antd';

import { Const } from 'qmkit';

import * as webapi from './webapi';
import SmsActor from './actor/sms-actor';
import VisibleActor from './actor/visible-actor';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new SmsActor(), new VisibleActor()];
  }

  init = async () => {
    const { res } = await webapi.fetchAllSms();
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('sms:init', fromJS(res.context));
    } else {
      message.error(res.message);
    }
  };

  mailEdit = () => {
    this.dispatch('modal:mailShow');
  };

  smsEdit = async (id) => {
    const { res } = await webapi.fetchSms(id);
    if (res.code == Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('modal:smsShow');
        this.dispatch('sms:edit', res.context);
      });
    } else {
      message.error(res.message);
    }
  };

  smsSave = async (params) => {
    params.id = this.state().getIn(['smsSetting', 'id']);
    const { res } = await webapi.editSms(params);
    if (res.code == Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.init();
      this.dispatch('modal:smsHide');
    } else {
      message.error(res.message);
    }
  };

  mailCancel = () => {
    this.dispatch('modal:mailHide');
  };

  smsCancel = () => {
    this.dispatch('modal:smsHide');
  };
}
