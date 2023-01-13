import React from 'react';
import { Alert } from 'antd';

export default class Tips extends React.Component<any, any> {
  render() {
    return (
      <Alert
        message="操作说明："
        description={
          <div>
            <p>
              1、订单设置关联了订单退单处理的关键流程，请谨慎操作；
            </p>
            <p>
              2、审核开关涉及到关键业务，请根据实际情况设置，在不了解的情况下请联系我们的工作人员进行修改；
            </p>
          </div>
        }
        type="info"
      />
    );
  }
}
