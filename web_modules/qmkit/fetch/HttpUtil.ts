import { message, notification } from 'antd';
import { util, history, cache } from 'qmkit';
const msg = {
    'K-000005': 'Your account is disabled',
    'K-000015': 'Failed to obtain authorization',
    'K-000002': '',
    '500': 'System is deploying, if it does not recovery after 10 mins, please contact the administrator.',
    '502': 'System is deploying, if it does not recovery after 10 mins, please contact the administrator.',
    '503': 'System is deploying, if it does not recovery after 10 mins, please contact the administrator.',
};
let errorList: any = [], _timerOut = 0, _times: number = 0, _error_index = 0;
class HttpUtil {
    /**
      * 发送fetch请求
       * @param fetchUrl
       * @param fetchParams
       * @returns {Promise}
       */

    static handleFetchData(fetchUrl, fetchParams, httpCustomerOpertion) {
        let errorObj = Object.assign({}, { fetchUrl: fetchUrl.split('?')[0], fetchParams, httpCustomerOpertion });
        // 1. 处理的第一步
        const { isShowLoading, customerTip } = httpCustomerOpertion
        if (isShowLoading) {

        }
        httpCustomerOpertion.isFetched = false
        httpCustomerOpertion.isAbort = false
        // 处理自定义的请求头
        if (httpCustomerOpertion.hasOwnProperty("customHead")) {
            const { customHead } = httpCustomerOpertion
            fetchParams.headers = Object.assign({}, fetchParams.headers, customHead)
        }
        // 2. 对fetch请求再进行一次Promise的封装
        const fetchPromise = new Promise((resolve, reject) => {
            fetch(fetchUrl, fetchParams).then(
                (response: any) => {
                    // 3. 放弃迟到的响应
                    if (httpCustomerOpertion.isAbort) {
                        // 3. 请求超时后，放弃迟到的响应
                        return
                    }
                    if (isShowLoading) {
                        //暂不统一处理
                    }
                    httpCustomerOpertion.isFetched = true
                    response.json().then(jsonBody => {
                        if (response.status == 200 && response.ok) {
                            _error_index = 0;
                            _timerOut = 0;
                            if (jsonBody.code === 'K-999997') {
                                HttpUtil.notificationPop(jsonBody.message)
                                return;
                            }
                            // token 过期时，前端直接处理
                            else if (jsonBody.code === 'K-080016') {
                                HttpUtil.notificationPop(jsonBody.message)
                                history.go(-1)
                            }
                            // 账号禁用 统一返回到登录页面
                            else if (fetchUrl.indexOf('baseConfig')===-1&&['K-000002', 'K-000005', 'K-000015'].includes(jsonBody.code)) {
                                HttpUtil.notificationPop(msg[jsonBody.code] || jsonBody.message)
                                util.logout();
                                history.push('/login')
                            } else if (jsonBody === 'Method Not Allowed') {
                                let message = 'You do not have permission to access this feature'
                                HttpUtil.notificationPop(message)
                            } else if (jsonBody.code === 'K-000000' || customerTip) {
                                resolve(HttpUtil.handleResult(jsonBody, httpCustomerOpertion))
                            } else {
                             
                                reject(HttpUtil.handleFailedResult({ code: jsonBody.code, message: jsonBody.message, error: jsonBody.message }, httpCustomerOpertion))
                            }
                        } else {
                            reject(HttpUtil.handleFailedResult({ code: response.status, message: jsonBody.message, error: jsonBody.message }, httpCustomerOpertion))
                        }

                    }).catch(e => {
                        const errMsg = e.name + " " + e.message
                        reject(HttpUtil.handleFailedResult({ code: response.status, message: errMsg, error: errMsg, }, httpCustomerOpertion))
                    })
                }
            ).catch(e => {
                const errMsg = e.name + " " + e.message
                if (httpCustomerOpertion.isAbort) {
                    // 请求超时后，放弃迟到的响应
                    return
                }
                httpCustomerOpertion.isFetched = true
                let er = { code: "404", error: errMsg, message: 'Request interface failed or interface does not exist, please check it' }
                reject(HttpUtil.handleFailedResult(er, httpCustomerOpertion))
            })
        })
        // console.log(errorObj.fetchUrl.indexOf('esIndex/repair')>-1,'====')
        let bool=(errorObj.fetchUrl.indexOf('esIndex/repair')>-1)||(errorObj.fetchUrl.indexOf('esIndex/rebuild')>-1)
        if(!bool){
            return Promise.race([fetchPromise, HttpUtil.fetchTimeout(httpCustomerOpertion)])
        }else{
            return Promise.race([fetchPromise])
        }
    }
    /**
       * 统一处理后台返回的结果, 包括业务逻辑报错的结果
       * @param result
       *
       */
    static handleResult(result, httpCustomerOpertion) {

        let code = result?.code ?? false;
        if (code && httpCustomerOpertion.isHandleResult === true) {
            const errMsg = result.msg || result.message;
            const errStr = `${errMsg}`
        }
        return result
    }
    /**
     * 统一处fetch的异常, 不包括业务逻辑报错
     * @param result
     *
     */
    static handleFailedResult(result, httpCustomerOpertion) {
        if (result.code && httpCustomerOpertion.isHandleResult === true) {
            const errMsg = msg[result.code] || result.msg || result.message;
            const errStr = `${errMsg}（${result.code}）`
            _error_index === 0 && HttpUtil.notificationPop(errStr)
        }
        _error_index++;
        return result;
    }
    static notificationPop(errStr) {
        return notification.error({
            message: 'System Notification',
            duration: 5,
            key:'error_pop',
            description: errStr,
            onClose: () => {
                _error_index = 0;
            },
        });
    }
    /**
     * 控制Fetch请求是否超时
     * @returns {Promise}
     */
    static fetchTimeout(httpCustomerOpertion) {
        const { isShowLoading } = httpCustomerOpertion
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (!httpCustomerOpertion.isFetched) {
                    // 还未收到响应，则开始超时逻辑，并标记fetch需要放弃
                    httpCustomerOpertion.isAbort = true
                    HttpUtil.notificationPop('Service  timeout , try again later')
                    reject({ code: "timeout", message: 'Service  timeout , try again later' })
                }
            }, httpCustomerOpertion.timeout || 40000)
        })
    }
}
export default HttpUtil;