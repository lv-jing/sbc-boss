import React from 'react';
import { Alert } from 'antd';

export default class Tips extends React.Component<any, any> {
  render() {
    return (
      <Alert
        message=""
        description={
          <div>
            <p>
              请准确输入用户的手机号，如果用户已经注册了商城账号，点击确定后用户将获得分销员资格。如果用户未注册过商城账号，点击确定后将自动替用户创建商城账号并且发放分销员资格。
            </p>
          </div>
        }
        type="info"
      />
    );
  }
}
