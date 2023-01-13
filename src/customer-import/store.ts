import {IOptions, Store} from 'plume2';
import CustomerImportActor from './actor/customer-import-actor';
import {message} from "antd";
import {Const, util} from "qmkit";

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new CustomerImportActor()];
  }

  /**
   * 下载客户导入模板
   */
  downloadTemplate = () => {
    const token = (window as any).token;
    if (token) {
      let base64 = new util.Base64();
      let result = JSON.stringify({token: token});
      let encrypted = base64.urlEncode(result);
      // 新窗口下载
      const exportHref = Const.HOST + `/customer/customerImport/downloadTemplate/${encrypted}`;
      window.open(exportHref);
    } else {
      message.error('请登录');
    }
  }

  toNextStep = () => {
    const currentStep: number = this.state().get('currentStep');
    this.dispatch('step:change', currentStep + 1);
  };

  toPrevStep = () => {
    const currentStep: number = this.state().get('currentStep');
    this.dispatch('step:change', currentStep - 1);
  };
}
