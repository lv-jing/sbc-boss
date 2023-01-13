import React from 'react';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import { Relax } from 'plume2';
import { Row, Col } from 'antd';
import { IMap } from 'typings/globalType';
import 'echarts/lib/component/tooltip';

@Relax
export default class RmfBar extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }
  props: {
    relaxProps?: {
      rfmBar: IMap;
    };
  };

  static relaxProps = {
    rfmBar: 'rfmBar'
  };
  render() {
    const { rfmBar } = this.props.relaxProps;
    const xData = rfmBar.get('x').toJS();
    const yData = rfmBar.get('y').toJS();
    return (
      <div>
        <Row style={{ paddingTop: '2%' }}>
          <span style={{ fontWeight: 700, fontSize: '1.07rem' }}>
            RFM分群分布概况
          </span>
        </Row>
        <Row>
          <Col span={24}>
            <ReactEchartsCore
              echarts={echarts}
              option={{
                grid: {
                  left: '2%',
                  right: '2%',
                  bottom: '2%',
                  containLabel: true
                },
                tooltip: { show: true, trigger: 'axis' },
                xAxis: {
                  type: 'value'
                },
                yAxis: {
                  type: 'category',
                  data: yData
                },
                series: [
                  {
                    // name: '2011年',
                    type: 'bar',
                    data: xData,
                    itemStyle: {
                      normal: {
                        // 随机显示
                        //color:function(d){return "#"+Math.floor(Math.random()*(256*256*256-1)).toString(16);}

                        // 定制显示（按顺序）
                        color: function(params) {
                          const colorList = [
                            '#c23531',
                            '#2f4554',
                            '#61a0a8',
                            '#d48265',
                            '#91c7ae',
                            '#749f83',
                            '#ca8622',
                            '#bda29a',
                            '#6e7074',
                            '#546570',
                            '#c4ccd3'
                          ];
                          return colorList[params.dataIndex % 11];
                        }
                      }
                    }
                  }
                ]
              }}
              style={{ height: '600px', width: '100%' }}
              notMerge={true}
            />
          </Col>
        </Row>
      </div>
    );
  }
}
