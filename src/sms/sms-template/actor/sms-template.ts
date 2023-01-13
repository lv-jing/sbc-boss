import { Action, Actor } from 'plume2';
import { fromJS } from 'immutable';

export default class SMSActor extends Actor {
  defaultState() {
    return {
      saleFormData: {},
      verifyFormData: {},
      noticeFormData: {},
      type: 2,
      ifEdit: false,
      templateId: '',
      templateCode: '',
      smsPurposeList: [],
      passedSignList: [],
      notices: []
    };
  }

  @Action('set:state')
  setState(state, { field, value }) {
    return state.set(field, fromJS(value));
  }
}
