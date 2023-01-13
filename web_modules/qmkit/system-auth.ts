import cache from './cache';
import Const from './config';
import { message } from 'antd';
import noop from './noop';

const isSystem = (event: Function) => {
  if (!event) return noop;
  return (e) => {
    const loginInfo = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA));
    const accountName = loginInfo && loginInfo.accountName;
    const { systemAuth } = Const;
    if (systemAuth == true) {
      if (accountName == 'system') {
        event(e);
      } else {
        if(e && e.preventDefault) e.preventDefault();
        message.error('您没有该权限，如需修改请联系管理员!')
      }
    } else {
      event(e);
    }
  }
}

export default isSystem;
