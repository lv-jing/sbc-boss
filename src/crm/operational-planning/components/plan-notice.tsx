import React from 'react';
import { Row, Col, Statistic } from 'antd';
import { Relax } from 'plume2';
import { IMap } from 'typings/globalType';
@Relax
export default class PlanNotice extends React.Component<any, any> {

  props: {
    relaxProps?: {
      planstatisticsmessagepush: IMap;
    };
  };

  static relaxProps = {
    planstatisticsmessagepush: 'planstatisticsmessagepush'
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { planstatisticsmessagepush } = this.props.relaxProps
    return (
      <div style={{ padding: 20 }}>
        <Row gutter={16}>
          <Col span={6}>
            <Statistic title="站内信收到人/次" value={planstatisticsmessagepush ? `${planstatisticsmessagepush.get('messageReceiveNum')}/${planstatisticsmessagepush.get('messageReceiveTotal')}` : '0'} />
          </Col>
          <Col span={6}>
            <Statistic title="Push收到次数" value={planstatisticsmessagepush ? planstatisticsmessagepush.get('pushNum') : '0'} />
          </Col>
        </Row>
      </div>
    );
  }
}
