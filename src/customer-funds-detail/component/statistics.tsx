import React from 'react';
import { Relax } from 'plume2';

import { Row, Col } from 'antd';
//import styled from 'styled-components';

// const StatisticsBox = styled.div`
//   width: 100%;
//   background-color: #f5f5f5;
//   display: flex;
//   flex-direction: row;
//   align-items: center;
//   padding: 10px;
//   padding-left: 20px;
//   margin-bottom: 20px;
//   margin-top: 20px;
//   .item {
//     margin-right: 20px;
//   }
//   .text {
//     color: #999;
//     font-size: 12px;
//   }
//   .price {
//     font-size: 16px;
//     color: #333;
//   }
// `;

@Relax
export default class Statistics extends React.Component<any, any> {
  props: {
    relaxProps?: {
      customerName: string;
      customerAccount: string;
      //余额
      accountBalance: number;
      //冻结余额
      blockedBalance: number;
      //可提现余额
      withdrawAmount: number;
      //收入笔数
      income: number;
      //收入金额
      amountReceived: number;
      //支出笔数
      expenditure: number;
      //支出金额
      amountPaid: number;
    };
  };

  static relaxProps = {
    customerName: 'customerName',
    customerAccount: 'customerAccount',
    accountBalance: 'accountBalance',
    blockedBalance: 'blockedBalance',
    withdrawAmount: 'withdrawAmount',
    income: 'income',
    amountReceived: 'amountReceived',
    expenditure: 'expenditure',
    amountPaid: 'amountPaid'
  };
  render() {
    const {
      customerName,
      customerAccount,
      accountBalance,
      blockedBalance,
      withdrawAmount,
      income,
      amountReceived,
      expenditure,
      amountPaid
    } = this.props.relaxProps;
    return (
      <div style={styles.static}>
        <p style={{ marginLeft: 5 }}>
          会员:{customerAccount}
          <span style={{ marginLeft: 10 }}>{customerName}</span>
        </p>
        <Row>
          <Col span={4}>
            <p style={styles.nav}>余额</p>
            <p style={styles.num}>￥{accountBalance.toFixed(2)}</p>
          </Col>
          <Col span={5}>
            <p style={styles.nav}>冻结余额</p>
            <p style={styles.num}>￥{blockedBalance.toFixed(2)}</p>
          </Col>
          <Col span={5}>
            <p style={styles.nav}>可提现余额</p>
            <p style={styles.num}>￥{withdrawAmount.toFixed(2)}</p>
          </Col>
          <Col span={5}>
            <p style={styles.nav}>收入{income}笔</p>
            <p style={styles.num}>￥{amountReceived.toFixed(2)}</p>
          </Col>
          <Col span={5}>
            <p style={styles.nav}>支出{expenditure}笔</p>
            <p style={styles.num}>￥{amountPaid.toFixed(2)}</p>
          </Col>
        </Row>
      </div>
    );
  }
}

const styles = {
  nav: {
    fontSize: 14,
    color: '#666666',
    padding: 5
  },
  num: {
    color: '#F56C1D',
    fontSize: 16,
    padding: 5
  },
  static: {
    background: '#fafafa',
    padding: 10,
    marginBottom: 16
  }
};
