import 'whatwg-fetch';
import Const from '../config';
import { util, history, cache } from 'qmkit';
import * as _ from 'lodash';
import { message } from 'antd';
import HttpUtil from './HttpUtil';

/**
 * 定义异步返回结果
 */
export interface IAsyncResult<T> {
  res: T;
  res2: T;
  res3: T;
  err: Error;
  data?: Object
}
    /**
  * get 请求
  * @param url
  * @param params
  * @param isHandleError
  * @param httpCustomerOpertion 使用者传递过来的参数, 用于以后的扩展用户自定义的行为
  * {
  *    isHandleResult: boolen    //是否需要处理错误结果   true 需要/false 不需要
  *    isShowLoading: boolen     //是否需要显示loading动画
  *    customHead: object        // 自定义的请求头
  *    timeout: int              //自定义接口超时的时间
  * }
  * @returns {Promise}
  */
interface IHttpCustomerOpertion{
    isHandleResult:boolean,
    isShowLoading?:boolean,
    customHead?:any,
    timeout?: number,
    customerTip?:boolean
}
/**
 * 封装业务fetch
 * @param input 输入url等
 * @param init 初始化http header信息等
 */
export default async function Fetch<T>(
  input: RequestInfo,
  init?: RequestInit,
  httpCustomerOpertion:IHttpCustomerOpertion={isHandleResult:true,isShowLoading:true,customerTip:false}
): Promise<IAsyncResult<T>> {
  try {
    if (!httpCustomerOpertion.hasOwnProperty("isHandleResult")) {
        httpCustomerOpertion.isHandleResult = true
    }
    if (!httpCustomerOpertion.hasOwnProperty("isShowLoading")) {
        httpCustomerOpertion.isShowLoading = true
    }
    if (!(window as any).token) {
      //判断是否登陆
      util.isLogin();
    }

    if (typeof input === 'string') {
      input += `${
        input.indexOf('?') == -1 ? '?reqId=' : '&reqId='
      }${Math.random()}`;
    }
    const request = {
      method: 'GET',
      mode: 'cors',
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Accept-Language': sessionStorage.getItem(cache.LANGUAGE),
        Authorization:
          'Bearer' + ((window as any).token ? ' ' + (window as any).token : '')
      },
      credentials: 'include'
    };
    let r = init && init.body;
    if (r) {
      init.body = JSON.stringify(trimValueDeep(JSON.parse(r as string)));
    }
    const merge = Object.assign({}, request, init);
    // let url = Const.HOST + input;
    let url = input.toString().indexOf('http') !== -1 ? input.toString(): Const.HOST + input;
    //去掉url中可能存在的//
    url = url.replace(/([^:])\/\//, '$1/');
    //const res = await fetch(url, merge);
    const res:any = await HttpUtil.handleFetchData(url, merge, httpCustomerOpertion)
    if(url.indexOf('/clinics/exportPrescriber') !== -1){
      const resBlob =await res.blob();
      return {
        res: null,
        res2: null,
        res3: null,
        data:resBlob,
        err: null
      };
    }
    //  const resJSON = await res.json();
   
   

    //TODO 和后端约定返回的数据格式, 然后再细分
    if(res.defaultLocalDateTime){
      sessionStorage.setItem('defaultLocalDateTime',res.defaultLocalDateTime)
    }
    
    
    return {
      res: res,
      res2: res,
      res3: res,
      err: null
    };
  } catch (err) {
    // console.error(err)
    //dev
    if (process.env.NODE_ENV != 'production') {
      console.warn(err);
    }
    //全局的错误提示
    return {
      res: err,
      res2: err,
      res3: err,
      err
    };
  }
}

/**
 * 所有请求参数trim
 * @param value
 */
function trimValueDeep(value) {
  return value && !_.isNumber(value) && !_.isBoolean(value) && !_.isDate(value)
    ? _.isString(value)
      ? _.trim(value)
      : _.isArray(value)
        ? _.map(value, trimValueDeep)
        : _.mapValues(value, trimValueDeep)
    : value;
}
