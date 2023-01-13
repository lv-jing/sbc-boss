import React from 'react';
import { Row, Col, Statistic } from 'antd';
import { Relax } from 'plume2';
import { IMap } from 'typings/globalType';
@Relax
export default class PlanMarketing extends React.Component<any, any> {

  props: {
    relaxProps?: {
      customerPlanSendCount: IMap;
    };
  };

  static relaxProps = {
    customerPlanSendCount: 'customerPlanSendCount'
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { customerPlanSendCount } = this.props.relaxProps;
    return (
      <div style={{ padding: 20 }}>
        <Row gutter={16}>
          <Col span={6}>
            <Statistic title="权益礼包发放人/次" value={customerPlanSendCount ? `${customerPlanSendCount.get('giftPersonCount')}/${customerPlanSendCount.get('giftCount')}` : '0'} />
          </Col>
          <Col span={6}>
            <Statistic title="优惠券发放人/张" value={customerPlanSendCount ? `${customerPlanSendCount.get('couponPersonCount')}/${customerPlanSendCount.get('couponCount')}` : '0'} />
          </Col>
          <Col span={6}>
            <Statistic title="优惠券使用人/张" value={customerPlanSendCount ? `${customerPlanSendCount.get('couponPersonUseCount')}/${customerPlanSendCount.get('couponUseCount')}` : '0'} />
          </Col>
          <Col span={6}>
            <Statistic title="优惠券转化率" value={customerPlanSendCount ? `${customerPlanSendCount.get('couponUseRate')}%` : '0'} />
          </Col>
        </Row>
      </div>
    );
  }
}
