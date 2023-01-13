import React from 'react';
import { Relax } from 'plume2';
import styled from 'styled-components';

const StatisticsBox = styled.div`
  width: 100%;
  background-color: #fafafa;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px;
  padding-left: 20px;
  margin-bottom: 16px;
  margin-top: 20px;
  .item {
    margin-right: 20px;
  }
  .text {
    color: #666666;
    font-size: 14px;
    padding:5px
  }
  .price {
    font-size: 16px;
    color: #F56C1D;
  }
`;

@Relax
export default class Statistics extends React.Component<any, any> {
  props: {
    relaxProps?: {
      accountBalanceTotal: number;
      blockedBalanceTotal: number;
      withdrawAmountTotal: number;
    };
  };

  static relaxProps = {
    accountBalanceTotal: 'accountBalanceTotal',
    blockedBalanceTotal: 'blockedBalanceTotal',
    withdrawAmountTotal: 'withdrawAmountTotal'
  };
  render() {
    const {
      accountBalanceTotal,
      blockedBalanceTotal,
      withdrawAmountTotal
    } = this.props.relaxProps;
    return (
      <StatisticsBox>
        <div className="item">
          <p className="text">余额总额</p>
          <p className="price">￥{accountBalanceTotal.toFixed(2)}</p>
        </div>
        <div className="item">
          <p className="text">冻结余额总额</p>
          <p className="price">￥{blockedBalanceTotal.toFixed(2)}</p>
        </div>
        <div className="item">
          <p className="text">可提现余额总额</p>
          <p className="price">￥{withdrawAmountTotal.toFixed(2)}</p>
        </div>
      </StatisticsBox>
    );
  }
}
