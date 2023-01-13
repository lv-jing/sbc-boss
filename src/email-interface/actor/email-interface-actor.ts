import { Actor, Action, IMap } from 'plume2';

export default class EmailInterfaceActor extends Actor {
  defaultState() {
    return {
      formVisible: false, // 邮箱设置弹出框可见性
      emailConfig: {}
    };
  }

  /**
   * 设置弹出框可见性
   */
  @Action('form:visitable:change')
  changeEmailFormShow(state: IMap) {
    return state.set('formVisible', !state.get('formVisible'));
  }

  /**
   * 初始化
   */
  @Action('email:config:init')
  emailFormInit(state: IMap, config) {
    return state.set('emailConfig', config);
  }

  /**
   * 改变表单字段值
   */
  @Action('email:form:edit')
  changeEmailFormValue(state: IMap, { key, value }) {
    return state.setIn(['emailConfig', key], value);
  }
}
