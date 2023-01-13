import { Action, Actor, IMap } from 'plume2';

export default class customerDetailActor extends Actor {
  defaultState() {
    return {
      customerId: '',
      modalVisible: false,
      baseInfo: {},
      tagList: [],
      customerTagList: [],
      groupNames: [],
      rfmStatistic: {},
      tagModalVisible: false
    };
  }

  @Action('form: field')
  formFiledChange(state, { key, value }) {
    return state.set(key, value);
  }

  @Action('init')
  init(state, { customerId, customerTagRelVOList, groupNames, rfmStatistic }) {
    return state
      .set('customerId', customerId)
      .set('customerTagList', customerTagRelVOList)
      .set('groupNames', groupNames)
      .set('rfmStatistic', rfmStatistic);
  }

  @Action('tab: change')
  tabChange(state, key) {
    return state.set('queryTab', key);
  }

  @Action('toggle: form: modal')
  toggleFormModel(state) {
    return state.set('modalVisible', !state.get('modalVisible'));
  }

  @Action('init:baseInfo')
  initBaseInfo(state, baseInfo) {
    return state.set('baseInfo', baseInfo);
  }

  @Action('init:tagList')
  initTagList(state: IMap, tagList) {
    return state.set('tagList', tagList);
  }

  @Action('toggle:tag:modal')
  toggleTagModal(state) {
    return state.set('tagModalVisible', !state.get('tagModalVisible'));
  }

  @Action('init:state')
  initState(state: IMap, { field, value }) {
    return state.set(field, value);
  }
}
