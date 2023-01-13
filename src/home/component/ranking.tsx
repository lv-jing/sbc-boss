import React from 'react';
import { Relax } from 'plume2';

import { Table } from 'antd';
import { IList } from 'typings/globalType';
import { AuthWrapper } from 'qmkit';

import { skuRankingQL } from '../ql';

const skuSalesColumns = [
  {
    title: '序号',
    dataIndex: 'serialNumber',
    key: 'serialNumber'
  },
  {
    title: '商品信息',
    dataIndex: 'skuName',
    key: 'skuName',
    width: 400,
    render: (_text, record) => (
      <div className="proDetails">
        <p>{record.skuName}</p>
        <span>{record.skuDetailName}</span>
      </div>
    )
  },
  {
    title: 'sku编码',
    dataIndex: 'skuNo',
    key: 'skuNo'
  },
  {
    title: '下单笔数',
    dataIndex: 'skuOrderCount',
    key: 'skuOrderCount'
  },
  {
    title: '下单金额',
    dataIndex: 'skuOrderAmt',
    key: 'skuOrderAmt',
    render: (_text, record) => '￥' + (record.skuOrderAmt || 0).toFixed(2)
  },
  {
    title: '下单件数',
    dataIndex: 'skuOrderNum',
    key: 'skuOrderNum'
  }
];

const customerOrderColumns = [
  {
    title: '序号',
    dataIndex: 'serialNumber',
    key: 'serialNumber'
  },
  {
    title: '客户名称',
    dataIndex: 'customerName',
    key: 'customerName'
  },
  {
    title: '下单笔数',
    dataIndex: 'tradeNum',
    key: 'tradeNum'
  },
  {
    title: '下单金额',
    dataIndex: 'tradeAmount',
    key: 'tradeAmount',
    render: (_text, record) => '￥' + (record.tradeAmount || 0).toFixed(2)
  }
];

const employeeSaleColumns = [
  {
    title: '序号',
    dataIndex: 'serialNumber',
    key: 'serialNumber'
  },
  {
    title: '业务员',
    dataIndex: 'employeeName',
    key: 'employeeName'
  },
  {
    title: '下单笔数',
    dataIndex: 'orderCount',
    orderCount: 'orderCount'
  },
  {
    title: '下单金额',
    dataIndex: 'amount',
    key: 'amount',
    render: (_text, record) => '￥' + (record.amount || 0).toFixed(2)
  },
  {
    title: '付款订单数',
    dataIndex: 'payCount',
    key: 'payCount'
  },
  {
    title: '付款金额',
    dataIndex: 'payAmount',
    key: 'payAmount',
    render: (_text, record) => '￥' + (record.payAmount || 0).toFixed(2)
  }
];

const storeStatisticalColumns = [
  {
    title: '序号',
    dataIndex: 'serialNumber',
    key: 'serialNumber'
  },
  {
    title: '店铺名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '访客数UV',
    dataIndex: 'totalUv',
    key: 'totalUv'
  },
  {
    title: '浏览量PV',
    dataIndex: 'totalPv',
    key: 'totalPv'
  },
  {
    title: '商品访客数',
    dataIndex: 'skuTotalUv',
    key: 'skuTotalUv'
  },
  {
    title: '商品浏览量',
    dataIndex: 'skuTotalPv',
    key: 'skuTotalPv'
  }
];

const storeTradeColumns = [
  {
    title: '序号',
    dataIndex: 'serialNumber',
    key: 'serialNumber'
  },
  {
    title: '店铺名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '下单笔数',
    dataIndex: 'orderCount',
    key: 'orderCount'
  },
  {
    title: '下单人数',
    dataIndex: 'orderNum',
    key: 'orderNum'
  },
  {
    title: '下单金额',
    dataIndex: 'orderAmt',
    key: 'orderAmt',
    render: (text, _record) => '￥' + (text || 0).toFixed(2)
  }
];

@Relax
export default class Ranking extends React.Component<any, any> {
  props: {
    relaxProps?: {
      skuSaleRanking: boolean;
      customerOrderRanking: boolean;
      employeeAchieve: boolean;
      skuRanking: any;
      customerRanking: any;
      employeeRanking: IList;
      storeTrade: boolean;
      storeStatistics: boolean;
      storeStatisticRanking: IList;
      storeTradeRanking: IList;
    };
  };

  static relaxProps = {
    skuSaleRanking: 'skuSaleRanking',
    customerOrderRanking: 'customerOrderRanking',
    employeeAchieve: 'employeeAchieve',
    skuRanking: skuRankingQL,
    customerRanking: 'customerRanking',
    employeeRanking: 'employeeRanking',
    storeTrade: 'storeTrade',
    storeStatistics: 'storeStatistics',
    storeStatisticRanking: 'storeStatisticRanking',
    storeTradeRanking: 'storeTradeRanking'
  };

  render() {
    const {
      skuSaleRanking,
      customerOrderRanking,
      employeeAchieve,
      skuRanking,
      customerRanking,
      employeeRanking,
      storeTrade,
      storeStatistics,
      storeStatisticRanking,
      storeTradeRanking
    } = this.props.relaxProps;
    return (
      <div>
        {skuSaleRanking ? (
          <AuthWrapper functionName="f_goods_watch_2">
            <div className="flowBox">
              <div className="homeItem" style={{ flex: 1 }}>
                <h3>商品销售排行Top10</h3>
                <Table
                  dataSource={skuRanking ? skuRanking : null}
                  columns={skuSalesColumns}
                  size="middle"
                  pagination={false}
                />
              </div>
            </div>
          </AuthWrapper>
        ) : null}
        <div className="flowBox">
          {storeStatistics ? (
            <AuthWrapper functionName="f_flow_watch_2">
              <div className="homeItem" style={{ flex: 1 }}>
                <h3>店铺流量排行Top10</h3>
                <Table
                  dataSource={storeStatisticRanking.toJS()}
                  columns={storeStatisticalColumns}
                  size="middle"
                  pagination={false}
                />
              </div>
            </AuthWrapper>
          ) : null}
          {storeTrade ? (
            <AuthWrapper functionName="f_trade_watch_2">
              <div className="homeItem" style={{ flex: 1, marginLeft: 12 }}>
                <h3>店铺交易排行Top10</h3>
                <Table
                  dataSource={storeTradeRanking.toJS()}
                  columns={storeTradeColumns}
                  size="middle"
                  pagination={false}
                />
              </div>
            </AuthWrapper>
          ) : null}
        </div>
        <div className="flowBox">
          {customerOrderRanking ? (
            <AuthWrapper functionName="f_customer_watch_2">
              <div className="homeItem" style={{ flex: 1 }}>
                <h3>客户订货排行Top10</h3>
                <Table
                  dataSource={customerRanking.toJS()}
                  columns={customerOrderColumns}
                  size="middle"
                  pagination={false}
                />
              </div>
            </AuthWrapper>
          ) : null}
          {employeeAchieve ? (
            <AuthWrapper functionName="f_employee_watch_2">
              <div className="homeItem" style={{ flex: 1, marginLeft: 10 }}>
                <h3>业务员业绩排行Top10</h3>
                <Table
                  dataSource={employeeRanking.toJS()}
                  columns={employeeSaleColumns}
                  size="middle"
                  pagination={false}
                />
              </div>
            </AuthWrapper>
          ) : null}
        </div>
      </div>
    );
  }
}
