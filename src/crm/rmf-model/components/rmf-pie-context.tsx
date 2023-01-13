import React from 'react';
import { Relax } from 'plume2';

import { history, AuthWrapper } from 'qmkit';
import { Row, Col } from 'antd';
import RmfPie from './rmf-pie';
import { IList } from 'typings/globalType';
@Relax
export default class RfmPieContext extends React.Component<any, any> {
  props: {
    relaxProps?: {
      rfmModal: IList
    };
  };

  static relaxProps = {
    rfmModal: 'rfmModal'
  };

  render() {
    const { rfmModal } = this.props.relaxProps;
    return (
      <div>
        <Row style={{ paddingTop: '2%' }}>
          <span style={{ fontWeight: 700, fontSize: '1.07rem' }}>RFM分段分布概况</span>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <AuthWrapper functionName={'f_rfm_param'}>
            <a href="javascript:;" onClick={() => history.push('/rmf-config')}>参数调整</a>
          </AuthWrapper>
        </Row>
        <Row>
          {rfmModal.map((item, index) => {
            return <Col span={8} key={index}>
              <RmfPie title={item.get('title')} data={item.get('data')} />
            </Col>
          })}
          {/* <Col span={8}>
            <RmfPie title="R分分布情况" data={fromJS(data)} />
          </Col>
          <Col span={8}>
            <RmfPie title="F分分布情况" data={fromJS(data)} />
          </Col>
          <Col span={8}>
            <RmfPie title="M分分布情况" data={fromJS(data)} />
          </Col> */}
        </Row>
      </div>
    );
  }
}
