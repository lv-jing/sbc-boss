import { IOptions, Store } from 'plume2';
import RmfActor from './actor/rmf-actor';
import * as webapi from './webapi';
import { Const, history } from 'qmkit';
import { message } from 'antd';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new RmfActor()];
  }

  /**
   * 初始化
   */
  init = async () => {
    const {
      res: { code, context }
    } = (await webapi.getCMFConfigInfo()) as any;
    if (code === Const.SUCCESS_CODE) {
      context.r[0].param = 1;
      this.dispatch('rmf-init', context);
    }
  };

  /**
   * 改变表单值
   */
  changeFormValue = (keys, val) => {
    this.dispatch('change:form:value', { keys, val });
  };

  /**
   * 改变范围
   */
  changePeriod = (val) => {
    this.dispatch('change:period', val);
  };

  /**
   * 删除一条记录
   */
  delItem = (path) => {
    this.dispatch('del:item', path);
  };

  /**
   * 添加一条记录
   */
  addItem = (key) => {
    this.dispatch('add:item', key);
  };

  /**
   * 保存
   */
  save = async () => {
    const hasNullVal = (key) => {
      return (
        params[key].filter((item) => item.param == null || item.score == null)
          .length > 0
      );
    };
    const params = this.state().toJS();
    if (hasNullVal('r')) {
      message.error('必填项未填：请填写R模型');
      return;
    }
    if (hasNullVal('f')) {
      message.error('必填项未填：请填写F模型');
      return;
    }
    if (hasNullVal('m')) {
      message.error('必填项未填：请填写M模型');
      return;
    }

    const { res } = (await webapi.saveCMFConfigInfo(params)) as any;
    if (res.code == Const.SUCCESS_CODE) {
      message.success('操作成功');
      history.goBack();
    } else {
      message.error(res.message);
    }
  };
}
