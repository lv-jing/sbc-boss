import React from 'react';
import { Breadcrumb, Row, Col } from 'antd';
import { Headline, BreadCrumb } from 'qmkit';
import styled from 'styled-components';

import List from './components/list';

const GreyBg = styled.div`
  background: #f5f5f5;
  padding: 15px;
  color: #333333;
  margin-bottom: 20px;

  span {
    width: 100px;
    text-align: right;
    color: #666666;
    display: inline-block;
    margin: 5px 0;
  }
`;

export default class ConfirmAccount extends React.Component<any, any> {
  render() {
    return (
      <div>
        <BreadCrumb>
          <Breadcrumb.Item>查询明细</Breadcrumb.Item>
        </BreadCrumb>
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>财务</Breadcrumb.Item>
          <Breadcrumb.Item>收款账户</Breadcrumb.Item>
          <Breadcrumb.Item>商家收款账户</Breadcrumb.Item>
          <Breadcrumb.Item>查询明细</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className="container">
          <Headline title="查询明细" />

          <div>
            <GreyBg>
              <Row>
                <Col span={12}>
                  <span>店铺名称：</span> 来伊份旗舰店
                </Col>
                <Col span={12}>
                  <span>入驻时间：</span> 2016-12-12
                </Col>
                <Col span={12}>
                  <span>店铺编码：</span> 000990002
                </Col>
                <Col span={12}>
                  <span>合同有效期：</span> 2017-12-1-2019-12-12
                </Col>
              </Row>
            </GreyBg>
          </div>
          <List />
        </div>
      </div>
    );
  }
}
