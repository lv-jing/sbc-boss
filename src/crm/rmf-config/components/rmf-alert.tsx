import React from 'react';
import { Alert } from 'antd';
import { Relax } from 'plume2';

@Relax
export default class RmfAlert extends React.Component<any, any> {
  render() {
    return (
      <Alert
        message=""
        description={
          <div>
            <p>
              1、通过分析客户最近消费时间(R)、消费频次(F)、消费金额(M)，可有效衡量客户价值和客户创利能力。消费频次越大、消费金额越高的客户，其客户生命价值(LTV)越高。通过营销活动、会员体系、精准人群运营，可有效提升客户贡献；
            </p>
            <p>
              2、您可按照阶梯设置各个维度的得分值，建议最少设置5个阶梯，阶梯数越多，会员综合分差距越大；
            </p>
            <p>3、我们将以每个维度的平均得分为分界线进行会员分群；</p>
            <p>
              4、会员RFM数据每天更新一次 ，若有参数调整，以当天最后一次为准；
            </p>
          </div>
        }
        type="info"
      />
    );
  }
}
