import * as React from 'react';
import { Relax } from 'plume2';
import { Const, DataGrid, noop } from 'qmkit';
import { List } from 'immutable';
import moment from 'moment';

declare type IList = List<any>;
const { Column } = DataGrid;

const FUNDS_TYPE = {
  1: '分销佣金',
  3: '邀新奖励',
  4: '佣金提成'
};

@Relax
export default class FundsList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      dataList: IList;
      pageSize: number;
      pageNum: number;
      total: number;
      init: Function;
      onSelect: Function;
      selected: IList;
    };
  };

  static relaxProps = {
    dataList: 'dataList',
    pageSize: 'pageSize',
    pageNum: 'pageNum',
    total: 'total',
    init: noop,
    selected: 'selected',
    onSelect: noop
  };

  render() {
    const {
      dataList,
      init,
      pageSize,
      pageNum,
      total,
      selected,
      onSelect
    } = this.props.relaxProps;
    return (
      <DataGrid
        dataSource={dataList.toJS()}
        rowKey="customerFundsDetailId"
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: selected.toJS(),
          onChange: (selectedRowKeys) => {
            onSelect(selectedRowKeys);
          }
        }}
        pagination={{
          pageSize,
          total,
          current: pageNum + 1,
          onChange: (currentPage, pageSize) => {
            init({ pageNum: currentPage - 1, pageSize: pageSize });
          }
        }}
      >
        <Column
          title="入账时间"
          dataIndex="createTime"
          key="createTime"
          render={(rowInfo) => {
            return (
              <div>
                <p>
                  {rowInfo ? moment(rowInfo).format(Const.TIME_FORMAT) : '-'}
                </p>
              </div>
            );
          }}
        />
        <Column
          title="业务编号"
          dataIndex="businessId"
          key="businessId"
          render={(rowInfo) => {
            return (
              <div>
                <p>{rowInfo ? rowInfo : '-'}</p>
              </div>
            );
          }}
        />
        <Column
          title="账务类型"
          dataIndex="fundsType"
          key="fundsType"
          render={(rowInfo) => <p>{FUNDS_TYPE[rowInfo]}</p>}
        />
        <Column
          title="收支金额"
          key="receiptPaymentAmount"
          render={(rowInfo) => {
            const { fundsType, receiptPaymentAmount } = rowInfo;
            return (
              <div>
                <p>
                  {this._handReceiptPaymentAmount(
                    fundsType,
                    receiptPaymentAmount
                  )}
                </p>
              </div>
            );
          }}
        />
      </DataGrid>
    );
  }

  _handReceiptPaymentAmount = (fundsType, receiptPaymentAmount) => {
    let sign = '+';
    if (fundsType == 2) {
      sign = '-';
    }
    return sign + '￥' + receiptPaymentAmount.toFixed(2);
  };
}
