import React from 'react';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/pie';
import { Row, Col, List } from 'antd';

export default class RmfPie extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }
  render() {
    const { data, title } = this.props;
    const content = data.filter(item => {
      return item.get('name') != '平均分'
    }).toJS();
    return (
      <Row>
        <Col span={6} style={{ paddingTop: '2%', paddingLeft: '2%' }}>
          <List
            header={<div style={{ fontWeight: 700 }}>{title}</div>}
            dataSource={data.toJS()}
            split={false}
            renderItem={item => (
              <List.Item>
                {`${item.name}: ${item.value}`}
                {item.name === '平均分' ? '分' : '人'}
              </List.Item>
            )}
          />
        </Col>
        <Col span={18}>
          <ReactEchartsCore
            echarts={echarts}
            option={{
              series: [
                {
                  name: title,
                  type: 'pie',
                  radius: '55%',
                  center: ['50%', '60%'],
                  data: content,
                  itemStyle: {
                    emphasis: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                  }
                }
              ]
            }}
            style={{ height: '360px', width: '100%' }}
            notMerge={true}
          />
        </Col>
      </Row>
    );
  }
}
