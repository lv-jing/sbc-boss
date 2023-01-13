import React from 'react';
import { cache } from 'qmkit';

/**
 * 校验当前用户是否有功能编码对应的权限
 * @param {string} functionName
 */
export function checkAuth(functionName: string) {
  if (functionName) {
    const functionsList = JSON.parse(
      sessionStorage.getItem(cache.LOGIN_FUNCTIONS)
    ) as Array<string>;
    if (!functionsList || functionsList.length == 0) {
      return false;
    }
    //获得权限明细
    const functions = functionName.split(',');
    let flag = functions.every((value) =>
      functionsList.some((func) => func == value.trim())
    );
    return flag;
  } else {
    return false;
  }
}

interface AuthProps {
  functionName: string;
}

/**
 * 权限组件封装
 */
export class AuthWrapper extends React.Component<AuthProps, any> {
  render() {
    return checkAuth(this.props.functionName) && this.props.children;
  }
}

/**
 * 权限组件封装,符合一个就权限就返回true
 * <OneAuthWrapper functionName='f_a,f_b...'>
 */
export class OneAuthWrapper extends React.Component<AuthProps, any> {
  render() {
    return checkMenu(this.props.functionName) && this.props.children;
  }
}

/**
 * 校验当前菜单是否具有功能编码最少一个的对应权限，即只要有一个功能编码存在就返回true
 * @param {string} functionName
 */
export function checkMenu(functionName) {
  if (functionName) {
    if (functionName == 'none') {
      return true;
    }
    const functionsList = JSON.parse(
      sessionStorage.getItem(cache.LOGIN_FUNCTIONS)
    ) as Array<string>;

    if (!functionsList || functionsList.length == 0) {
      return false;
    }
    //获得权限明细
    const functions = functionName.split(',');
    let flag = functions.some((f) => functionsList.some((v) => v == f));
    return flag;
  } else {
    return false;
  }
}
