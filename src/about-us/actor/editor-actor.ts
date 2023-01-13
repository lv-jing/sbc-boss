import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class EditorActor extends Actor {
  defaultState() {
    return {
      // 关于我们富文本编辑器
      regEditor: {},
      // 关于我们内容
      context: ''
    };
  }

  /**
   * 关于我们, 列/值 设置
   *
   * @param {IMap} state
   * @param {*} { field, value }
   * @returns
   * @memberof EditorActor
   */
  @Action('about-us: filed: value')
  fieldValue(state: IMap, { field, value }) {
    return state.set(field, fromJS(value));
  }

  @Action('setting: regEditor')
  regEditor(state, regEditor) {
    return state.set('regEditor', regEditor);
  }
}
