import React from 'react';
import { Alert } from 'antd';

export default class Tips extends React.Component<any, any> {
  render() {
    return (
      <Alert
        message="操作提示"
        description={
          <div>
            <p>
              1、订单设置关联了订单退单处理的关键流程，请谨慎操作，所有设置在点击保存后生效。
            </p>
            <p>2、客户逾期未处理的待收货订单，将会自动确认收货。</p>
            <p>3、超过设定时间的已完成订单，客户将无法发起退货退款申请。</p>
            <p>4、商家逾期未处理的待审核退单，将会自动审核通过。</p>
            <p>5、商家逾期未处理的待收货退单，将会自动确认收货。</p>
          </div>
        }
        type="info"
      />
    );
  }
}
