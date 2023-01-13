import { Actor, Action, IMap } from 'plume2';

export default class MailVisibleActor extends Actor {
  defaultState() {
    return {
      mailVisible: false,
      smsVisible: false
    };
  }

  @Action('modal:mailShow')
  mailShow(state: IMap) {
    return state.set('mailVisible', true);
  }

  @Action('modal:smsShow')
  smsShow(state: IMap) {
    return state.set('smsVisible', true);
  }

  @Action('modal:mailHide')
  mailHide(state: IMap) {
    return state.set('mailVisible', false);
  }

  @Action('modal:smsHide')
  smsHide(state: IMap) {
    return state.set('smsVisible', false);
  }
}
