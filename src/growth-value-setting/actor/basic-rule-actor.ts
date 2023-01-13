import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class BasicRuleActor extends Actor {
  defaultState() {
    return {
      basicRules:[],
      originalBasicRules:[],
      //成长值规则说明富文本编辑器
      introEditor: {},
      isIntroFilled: true
    };
  }

  /**
   * 初始化成长值基础获取规则
   */
  @Action('growth-value-basic-rule:init')
  init(state: IMap, basicRules) {
    return state.set('basicRules', fromJS(basicRules));
  }

  /**
   * 初始化原始成长值基础获取规则
   */
  @Action('growth-value-origin-basic-rule:init')
  initOrigin(state: IMap, basicRules) {
    return state.set('originalBasicRules', fromJS(basicRules));
  }

  /**
   * 修改成长值基础获取规则状态
   */
  @Action('growth-value-basic-rule:status')
  editStatus(state: IMap, { index, status }) {
    return state.updateIn(['basicRules', index, 'status'], () => status);
  }

  /**
   * 修改成长值基础获取规则
   */
  @Action('growth-value-basic-rule:context')
  editContext(state: IMap, { index, type, value }) {
    return state.updateIn(
      ['basicRules', index, 'context'],
      (val) => {
        val = JSON.parse(val);
        val[type] = value;
        return JSON.stringify(val) as any;
      });
  }

  @Action('growth-value-basic-rule: introEditor')
  introEditor(state, introEditor) {
    return state.set('introEditor', introEditor);
  }

  @Action('growth-value-basic-rule: isIntroFilled')
  isIntroFilled(state, isIntroFilled) {
    return state.set('isIntroFilled', isIntroFilled);
  }

}
