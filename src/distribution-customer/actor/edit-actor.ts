import { Actor, Action, IMap } from 'plume2';
import { List, fromJS } from 'immutable';

export default class EditActor extends Actor {
  //数据源
  defaultState() {
    return {
      customerForm: {
        //账户名
        customerAccount: ''
      },
      edit: false,
      distributorLevelIds: List()
    };
  }

  constructor() {
    super();
  }

  /**
   * 初始化分销员等级
   * @param {IMap} state
   * @param distributorLevelIds
   * @returns {Map<string, V>}
   */
  @Action('init:distributorLevelIds')
  initDistributorLevelIds(state: IMap, distributorLevelIds) {
    return state.update((state) => {
      return state.set('distributorLevelIds', fromJS(distributorLevelIds));
    });
  }

  @Action('edit:init')
  init(state: IMap, customer) {
    return state.mergeIn(['customerForm'], customer);
  }

  @Action('edit')
  edit(state: IMap, isEdit) {
    return state.set('edit', isEdit);
  }

  /**
   * 设置分销员等级列表
   * @param {IMap} state
   * @param data
   * @returns {Map<string, V>}
   */
  @Action('edit:distributor:level:list')
  setDistributorLevelList(state: IMap, data) {
    return state.set('distributorLevelIds', fromJS(data));
  }
}
