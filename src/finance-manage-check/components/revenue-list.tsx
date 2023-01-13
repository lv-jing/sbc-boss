import React from 'react';
import { Relax } from 'plume2';
import { DataGrid, history, noop } from 'qmkit';
const { Column } = DataGrid;

@Relax
export default class RevenueList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      incomeList: any;
      incomeTotal: any;
      payWaysObj: any;
      dateRange: any;
      total: number;
      pageNum: number;
      onPagination: Function;
      pageSize: number;
    };
  };

  static relaxProps = {
    incomeList: 'incomeList',
    incomeTotal: 'incomeTotal',
    payWaysObj: 'payWaysObj',
    dateRange: 'dateRange',
    total: 'total',
    pageNum: 'pageNum',
    onPagination: noop,
    pageSize: 'pageSize'
  };

  render() {
    const {
      incomeList,
      payWaysObj,
      incomeTotal,
      dateRange,
      total,
      pageSize,
      pageNum
    } = this.props.relaxProps;
    return (
      <div>
        <div className="totalAmount">
          <ul>
            {incomeTotal.toJS().length > 0
              ? incomeTotal.map((v, i) => {
                  //不显示预存款，优惠券和积分
                  return (
                    v.get('payWay') != 'ADVANCE' &&
                    v.get('payWay') != 'COUPON' && (
                      <li key={i}>
                        <p className="payName">
                          &nbsp;{payWaysObj.toJS()[v.get('payWay')]}
                        </p>
                        <strong>{v.get('sumAmount')}</strong>
                        <p className="payPercent">
                          &nbsp;{v.get('percentage')}
                        </p>
                      </li>
                    )
                  );
                })
              : null}
          </ul>
        </div>

        <div>
          <DataGrid
            dataSource={incomeList.toJS().length > 0 ? incomeList.toJS() : []}
            rowKey={(record) => record.index}
            pagination={{
              pageSize,
              total,
              current: pageNum + 1
            }}
            onChange={(pagination, filters, sorter) =>
              this._getData(pagination, filters, sorter)
            }
          >
            <Column
              title="序号"
              dataIndex="index"
              key="index"
              width="50"
              render={(_text, _rowData: any, index) => {
                return pageNum * pageSize + index + 1;
              }}
            />
            <Column
              title="店铺名称"
              dataIndex="storeName"
              key="storeName"
              width="200"
            />
            <Column
              title="转账汇款"
              dataIndex="CASH"
              key="CASH"
              width="100"
              render={(_text, rowData: any) => {
                return <span>{rowData.payItemAmountMap.CASH}</span>;
              }}
            />
            <Column
              title="银联"
              dataIndex="UNIONPAY"
              key="UNIONPAY"
              width="100"
              render={(_text, rowData: any) => {
                return <span>{rowData.payItemAmountMap.UNIONPAY}</span>;
              }}
            />
            <Column
              title="支付宝"
              dataIndex="ALIPAY"
              key="ALIPAY"
              width="100"
              render={(_text, rowData: any) => {
                return <span>{rowData.payItemAmountMap.ALIPAY}</span>;
              }}
            />
            <Column
              title="微信"
              dataIndex="WECHAT"
              key="WECHAT"
              width="100"
              render={(_text, rowData: any) => {
                return <span>{rowData.payItemAmountMap.WECHAT}</span>;
              }}
            />
            <Column
              title="企业银联"
              dataIndex="UNIONPAY_B2B"
              key="UNIONPAY_B2B"
              width="100"
              render={(_text, rowData: any) => {
                return <span>{rowData.payItemAmountMap.UNIONPAY_B2B}</span>;
              }}
            />
            <Column
              title="积分兑换"
              dataIndex="POINT"
              key="POINT"
              width="100"
              render={(_text, rowData: any) => {
                return <span>{rowData.payItemAmountMap.POINT}</span>;
              }}
            />
            <Column
              title="余额"
              dataIndex="BALANCE"
              key="BALANCE"
              width="100"
              render={(_text, rowData: any) => {
                return <span>{rowData.payItemAmountMap.BALANCE}</span>;
              }}
            />
            <Column
              title="合计"
              dataIndex="totalAmount"
              key="totalAmount"
              width="100"
            />
            <Column
              title="操作"
              dataIndex="operate"
              key="operate"
              width="100"
              render={(_text, record: any) => {
                return (
                  <a
                    onClick={() =>
                      history.push({
                        pathname: `/finance-manage-refund/${
                          record.storeId
                        }/${'income'}`,
                        state: {
                          beginTime:
                            dateRange.get('beginTime') + ' ' + '00:00:00',
                          endTime: dateRange.get('endTime') + ' ' + '23:59:59',
                          storeName: record.storeName
                        }
                      })
                    }
                  >
                    明细
                  </a>
                );
              }}
            />
          </DataGrid>
        </div>
      </div>
    );
  }

  /**
   * 分页查询
   * @param pageNum
   * @param pageSize
   * @private
   */
  _getData = (pagination, _filter, _sorter) => {
    const { onPagination } = this.props.relaxProps;
    onPagination(pagination.current, pagination.pageSize);
  };
}
