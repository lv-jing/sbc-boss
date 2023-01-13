import React from 'react';
import { Store, Relax } from 'plume2';
import PropTypes from 'prop-types';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/radar';
import 'echarts/lib/component/tooltip';

import { Headline, noop } from 'qmkit';
import { Row, Col } from 'antd';

@Relax
export default class ConsumptionAnalysis extends React.Component<any, any> {
  _store: Store;

  //声明上下文依赖
  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
  }

  props: {
    relaxProps?: {
      rfmStatistic: any;
      groupNames: any;
      toggleTagModal: Function;
    };
  };

  static relaxProps = {
    rfmStatistic: 'rfmStatistic',
    groupNames: 'groupNames',
    toggleTagModal: noop
  };

  render() {
    //@ts-ignore
    const {
      rfmStatistic: {
        rfmTotal,
        lastTradeTime,
        tradeCount,
        tradeAmount,
        avgTradeAmount,
        rScore,
        fScore,
        mScore,
        rMaxScore,
        fMaxScore,
        mMaxScore
      }
    } = this.props.relaxProps;

    const option = {
      title: {
        text: '基础雷达图'
      },
      tooltip: {},
      // legend: {
      //   data: ['预算分配（Allocated Budget）', '实际开销（Actual Spending）']
      // },
      radar: {
        // shape: 'circle',
        name: {
          textStyle: {
            color: '#fff',
            backgroundColor: '#999',
            borderRadius: 3,
            padding: [3, 5]
          }
        },
        indicator: [
          { name: 'R分分布情况', max: rMaxScore },
          { name: 'F分分布情况', max: fMaxScore },
          { name: 'M分分布情况', max: mMaxScore }
        ]
      },
      series: [
        {
          name: 'FRM分析',
          type: 'radar',
          tooltip: {
            trigger: 'item'
          },
          itemStyle: { normal: { areaStyle: { type: 'default' } } },
          data: [
            {
              value: [rScore, fScore, mScore],
              name: 'FRM分析'
            }
          ]
        }
      ]
    };

    return (
      <div className="analysis article-wrap">
        <Headline title="TA的消费分析" />
        <div className="rfm-analysis">
          <Row>
            <Col span={12}>
              <ReactEchartsCore
                echarts={echarts}
                option={option}
                style={{ height: '360px', width: '100%' }}
                notMerge={true}
              />
            </Col>
            <Col span={8}>
              <div className="infos">
                <p className="item">
                  <span className="label">RFM综合分：</span>
                  <span className="info">{rfmTotal}</span>
                </p>
                <p className="item">
                  <span className="label">最近一次消费：</span>
                  <span className="info">{lastTradeTime}</span>
                </p>
                <p className="item">
                  <span className="label">近3个月消费记录：</span>
                  <span className="info">{tradeCount}</span>
                </p>
                <p className="item">
                  <span className="label">近3个月消费总额：</span>
                  <span className="info">￥{tradeAmount || 0}</span>
                </p>
                <p className="item">
                  <span className="label">近3个月笔单价：</span>
                  <span className="info">￥{avgTradeAmount || 0}</span>
                </p>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
