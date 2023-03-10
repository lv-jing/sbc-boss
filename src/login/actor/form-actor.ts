import { Actor, Action, IMap } from 'plume2';

export default class FormActor extends Actor {
  defaultState() {
    return {
      //账号
      account: '',
      //密码
      password: '',
      //是否记住
      isRemember: false,
      //登录logo
      loginLogo: '',
      refresh:false
    };
  }

  @Action('login:logo')
  logo(state: IMap, uri) {
    return state.set('loginLogo', uri);
  }

  @Action('login:check')
  check(state: IMap, isRemember) {
    return state.set('isRemember', isRemember);
  }

  @Action('login:input')
  input(state: IMap, { field, value }) {
    return state.set(field, value);
  }

  @Action('login:refresh')
  refresh(state: IMap,bool) {
    return state.set('refresh', bool);
  }
}
