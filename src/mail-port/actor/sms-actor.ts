import { Actor, Action, IMap } from 'plume2';

export default class SmsActor extends Actor {
  defaultState() {
    return {
      sms: [],
      smsSetting: {
        account: '',
        interFaceUrl: '',
        name: '',
        password: '',
        siteAddress: '',
        status: '',
        template: ''
      }
    };
  }

  constructor() {
    super();
  }

  @Action('sms:init')
  init(state: IMap, sms) {
    return state.set('sms', sms);
  }

  @Action('sms:edit')
  edit(state, data: IMap) {
    return state.update('smsSetting', (sms) => sms.merge(data));
  }
}
