import { Fetch } from 'qmkit';

type TResult = {
  code: string;
  message: string;
  context: any;
};

/**
 * 查询logo
 * @returns {Promise<IAsyncResult<T>>}
 */
export const fetchBossLogo = () => {
  return Fetch('/bosslogo');
};

/**
 * 查询手机是否存在
 * @param phone
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function fetchPhoneExist(phone: string) {
  return Fetch<TResult>(`/customer/${phone}/existByEmail`);
}

/**
 * 发送手机验证码
 * @param phone
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function sendValidCode(phone) {
  return Fetch<TResult>(`/password/sendGrid/${phone}`, {
    method: 'POST',
    body: JSON.stringify({})
  });
}

/**
 * 校验验证码
 * @param phone phone
 * @param code code
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function validCode(phone: string, code: string) {
  return Fetch<TResult>(`/password/sendGrid/${phone}/${code}`, {
    method: 'POST',
    body: JSON.stringify({})
  });
}

/**
 * 设置手机密码
 * @param phone phone
 * @param password password
 * @returns {Promise<IAsyncResult<TResult>>}
 */
export function resetPassword(
  phone: string,
  password: string,
  smsVerifyCode: string
) {
  return Fetch<TResult>(`/password/email/${phone}/${password}/${smsVerifyCode}`, {
    method: 'POST',
    body: JSON.stringify({})
  });
}
