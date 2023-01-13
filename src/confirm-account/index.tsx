import React from 'react';
import { Breadcrumb, Row, Col, Form } from 'antd';
import { Headline, Const, BreadCrumb } from 'qmkit';
import { StoreProvider } from 'plume2';
import moment from 'moment';
import styled from 'styled-components';

import Appstore from './store';
import List from './components/list';
import FightModal from './components/modal';

const GreyBg = styled.div`
  background: #fafafa;
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

const FightFromModal = Form.create()(FightModal as any);

@StoreProvider(Appstore, { debug: __DEV__ })
export default class ConfirmAccount extends React.Component<any, any> {
  store: Appstore;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { tid } = this.props.match.params;
    if (__DEV__) {
    }
    if (this.props.location.state.applyEnterTime) {
      let kind = this.props.location.state.kind;
      //入驻时间
      this.store.enterTime(this.props.location.state.applyEnterTime, kind);
    }
    this.store.init(tid);
  }

  render() {
    const storeInfo = this.store.state().get('storeInfo');
    return (
      <div>
        <BreadCrumb>
          <Breadcrumb.Item>确认账号</Breadcrumb.Item>
        </BreadCrumb>
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>财务</Breadcrumb.Item>
          <Breadcrumb.Item>收款账户</Breadcrumb.Item>
          <Breadcrumb.Item>商家收款账户</Breadcrumb.Item>
          <Breadcrumb.Item>确认账号</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className="container">
          <Headline
            title={
              this.store.state().get('kind') == 'details'
                ? '查询明细'
                : '确认账号'
            }
          />

          <div>
            <GreyBg>
              <Row>
                <Col span={12}>
                  <span>店铺名称：</span>{' '}
                  {storeInfo && JSON.stringify(storeInfo) != '{}'
                    ? storeInfo.get('storeName')
                    : '-'}
                </Col>
                <Col span={12}>
                  <span>入驻时间：</span>{' '}
                  {this.store.state().get('applyEnterTime')
                    ? moment(this.store.state().get('applyEnterTime')).format(
                        'YYYY-MM-DD HH:mm:ss'
                      )
                    : '无'}
                </Col>
                <Col span={12}>
                  <span>商家编码：</span>{' '}
                  {storeInfo && JSON.stringify(storeInfo) != '{}'
                    ? storeInfo.get('supplierCode')
                    : '-'}
                </Col>
                <Col span={12}>
                  <span>合同有效期：</span>
                  {moment(storeInfo.get('contractStartDate'))
                    .format(Const.DAY_FORMAT)
                    .toString()}
                  ---
                  {moment(storeInfo.get('contractEndDate'))
                    .format(Const.DAY_FORMAT)
                    .toString()}
                </Col>
              </Row>
            </GreyBg>
          </div>
          <List />
        </div>

        <FightFromModal />
      </div>
    );
  }
}
