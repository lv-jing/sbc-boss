import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class BasicRuleActor extends Actor {
  defaultState() {
    return {
      basicRules:[]
    };
  }

  /**
   * 初始化积分基础获取规则
   */
  @Action('points-basic-rule: init')
  init(state: IMap, basicRules) {
    return state.set('basicRules', fromJS(basicRules));
  }

  /**
   * 修改积分基础获取规则状态
   */
  @Action('points-basic-rule: status')
  editStatus(state: IMap, { index, status }) {
    return state.updateIn(['basicRules', index, 'status'], () => status);
  }

  /**
   * 修改积分基础获取规则
   */
  @Action('points-basic-rule: context')
  editContext(state: IMap, { index, type, value }) {
    return state.updateIn(
      ['basicRules', index, 'context'],
      (val) => {
        val = JSON.parse(val);
        val[type] = value;
        return JSON.stringify(val) as any;
      });
  }

}
