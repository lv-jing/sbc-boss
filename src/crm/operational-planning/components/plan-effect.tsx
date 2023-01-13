import React from 'react';
import { Row, Col, Statistic } from 'antd';
import { Relax } from 'plume2';
import cover from '../img/cover.png';
import pay from '../img/pay.png';
import visitor from '../img/visitor.png';
import back from '../img/back.png';
import { IMap } from 'typings/globalType';
@Relax
export default class PlanEffect extends React.Component<any, any> {
  props: {
    relaxProps?: {
      customerPlanConversion: IMap;
    };
  };

  static relaxProps = {
    customerPlanConversion: 'customerPlanConversion'
  };

  constructor(props) {
    super(props);
  }
  render() {
    const { customerPlanConversion } = this.props.relaxProps;
    return (
      <div style={{ padding: 20 }}>
        <Row gutter={16}>
          <Col span={3}>
            <Statistic title="访客数UV" value={customerPlanConversion ? customerPlanConversion.get('visitorsUvCount') : '0'} />
          </Col>
          <Col span={3}>
            <Statistic title="下单人数" value={customerPlanConversion ? customerPlanConversion.get('orderPersonCount') : '0'} />
          </Col>
          <Col span={3}>
            <Statistic title="下单笔数" value={customerPlanConversion ? customerPlanConversion.get('orderCount') : '0'} />
          </Col>
          <Col span={3}>
            <Statistic title="付款人数" value={customerPlanConversion ? customerPlanConversion.get('payPersonCount') : '0'} />
          </Col>
          <Col span={3}>
            <Statistic title="付款笔数" value={customerPlanConversion ? customerPlanConversion.get('payCount') : '0'} />
          </Col>
          <Col span={3}>
            <Statistic title="付款金额" value={customerPlanConversion ? `￥${customerPlanConversion.get('totalPrice')}` : '￥0'} />
          </Col>
          <Col span={3}>
            <Statistic title="客单价" value={customerPlanConversion ? `￥${customerPlanConversion.get('unitPrice')}` : '￥0'} />
          </Col>
        </Row>
        <div className="chart">
          <div className="back-chart">
            <div className="item cover">
              <img src={cover} className="icon" />
              <div className="right">
                <p className="title">覆盖人数</p>
                <p className="num">{customerPlanConversion ? customerPlanConversion.get('coversCount') : '0'}</p>
              </div>
            </div>
            <div className="item visitor">
              <img src={visitor} className="icon" />
              <div className="right">
                <p className="title">访客人数</p>
                <p className="num">{customerPlanConversion ? customerPlanConversion.get('visitorsCount') : '0'}</p>
              </div>
            </div>
            <div className="item pay">
              <img src={pay} className="icon" />
              <div className="right">
                <p className="title">付款人数</p>
                <p className="num">{customerPlanConversion ? customerPlanConversion.get('payPersonCount') : '0'}</p>
              </div>
            </div>
          </div>
          <div className="funnel">
            <img src={back} className="funnel-img" />
            <div className="titles">
              <p>覆盖人数</p>
              <p>访客</p>
              <p>支付</p>
            </div>
            <div className="funnel-change first">
              <p className="label">转化率</p>
              <p className="number">{customerPlanConversion ? `${customerPlanConversion.get('coversVisitorsRate')}%` : '0%'}</p>
            </div>
            <div className="funnel-change next">
              <p className="label">转化率</p>
              <p className="number">{customerPlanConversion ? `${customerPlanConversion.get('payVisitorsRate')}%` : '0%'}</p>
            </div>
            <div className="funnel-change end">
              <p className="label">转化率</p>
              <p className="number">{customerPlanConversion ? `${customerPlanConversion.get('payCoversRate')}%` : '0%'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
