import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Button } from 'antd';

export default function QuickLinks() {
  return (
    <div>
      <Row gutter={[16,16]}>
        <Col span={8}>
          <Card title="Store" bordered={false}>
            <div><Button size="large" style={{margin:'10px 0'}}><Link to="/supplier-list">Store list</Link></Button></div>
            <div><Button size="large" style={{margin:'10px 0'}}><Link to="/supplier-evaluate-list">Store evaluation</Link></Button></div>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Product" bordered={false}>
            <div><Button size="large" style={{margin:'10px 0'}}><Link to="/goods-list">Product list</Link></Button></div>
            <div><Button size="large" style={{margin:'10px 0'}}><Link to="/goods-cate">Product category</Link></Button></div>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Setting" bordered={false}>
            <div><Button size="large" style={{margin:'10px 0'}}><Link to="/basic-setting">Basic setting</Link></Button></div>
            <div><Button size="large" style={{margin:'10px 0'}}><Link to="/employee-list">Employee list</Link></Button></div>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Order" bordered={false}>
            <div><Button size="large" style={{margin:'10px 0'}}><Link to="/order-list">Order list</Link></Button></div>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Subscription" bordered={false}>
            <div><Button size="large" style={{margin:'10px 0'}}><Link to="/subscription-list">Subscription list</Link></Button></div>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Pet owner" bordered={false}>
            <div><Button size="large" style={{margin:'10px 0'}}><Link to="/customer-list">Pet owner list</Link></Button></div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

