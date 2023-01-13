import * as React from 'react';
import { Relax, IMap } from 'plume2';
import { AuthWrapper, DataGrid, noop } from 'qmkit';
import { List } from 'immutable';
import { Link } from 'react-router-dom';

declare type IList = List<any>;
const { Column } = DataGrid;

@Relax
export default class FundsList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      dataList: IList;
      pageSize: number;
      pageNum: number;
      total: number;
      init: Function;
      sortedInfo: IMap;
      setFormField: Function;
      setSortedInfo: Function;
      checkSwapInputGroupCompact: Function;
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
    sortedInfo: 'sortedInfo',
    setFormField: noop,
    setSortedInfo: noop,
    checkSwapInputGroupCompact: noop,
    selected: 'selected',
    onSelect: noop,
  };

  render() {
    const { dataList, init, pageSize, pageNum, total, selected, onSelect } = this.props.relaxProps;
    const sortedInfo = this.props.relaxProps.sortedInfo.toJS();
    return (
      <DataGrid
        dataSource={dataList.toJS()}
        rowKey="customerFundsId"
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: selected.toJS(),
          onChange: (selectedRowKeys) => {
            onSelect(selectedRowKeys);
          }
        }}
        onChange={(pagination, filters, sorter) =>
          this._handleOnChange(pagination, filters, sorter)
        }
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
          title="会员名称/账号"
          key="customerName"
          render={(rowInfo) => {
            const { customerAccount, customerName } = rowInfo;
            return (
              <div>
                <p>{customerName}</p>
                <p>{customerAccount}</p>
              </div>
            );
          }}
        />
        <Column
          title="会员等级"
          key="distributor"
          render={(rowInfo) => {
            const { distributor,customerLevelName } = rowInfo;
            return (customerLevelName || distributor == 1) ? (
              <div>
                <p>{customerLevelName ? customerLevelName : ''}<br/>{distributor == 1 ? '分销员' : ''}</p>
              </div>
            ):<div>-</div>;
          }}
        />
        <Column
          title="账户余额"
          dataIndex="accountBalance"
          key="accountBalance"
          sorter={true}
          sortOrder={
            sortedInfo.columnKey === 'accountBalance' && sortedInfo.order
          }
          render={(rowInfo) => {
            return rowInfo == null ? '￥0.0' : '￥' + rowInfo.toFixed(2);
          }}
        />
        <Column
          title="冻结余额"
          dataIndex="blockedBalance"
          key="blockedBalance"
          sorter={true}
          sortOrder={
            sortedInfo.columnKey === 'blockedBalance' && sortedInfo.order
          }
          render={(rowInfo) => {
            return rowInfo == null ? '￥0.0' : '￥' + rowInfo.toFixed(2);
          }}
        />
        <Column
          title="可提现余额"
          dataIndex="withdrawAmount"
          key="withdrawAmount"
          sorter={true}
          sortOrder={
            sortedInfo.columnKey === 'withdrawAmount' && sortedInfo.order
          }
          render={(rowInfo) => {
            return rowInfo == null ? '￥0.0' : '￥' + rowInfo.toFixed(2);
          }}
        />
        <Column
          title="操作"
          key="option"
          render={(rowInfo) => {
            return (
              <AuthWrapper functionName="f_funds_detail">
                <Link to={`/customer-funds-detail/${rowInfo.customerId}`}>
                  查看明细
                </Link>
              </AuthWrapper>
            );
          }}
        />
      </DataGrid>
    );
  }

  _handleOnChange = (pagination, _filters, sorter) => {
    let currentPage = pagination.current;
    const {
      init,
      setFormField,
      setSortedInfo,
      pageNum,
      checkSwapInputGroupCompact
    } = this.props.relaxProps;
    if (pageNum != currentPage - 1) {
      return;
    }
    const sortedInfo = this.props.relaxProps.sortedInfo.toJS();
    if (
      sorter.columnKey != sortedInfo.columnKey ||
      sorter.order != sortedInfo.order
    ) {
      currentPage = 1;
    }
    setFormField(
      'sortColumn',
      sorter.columnKey ? sorter.columnKey : 'createTime'
    );
    setFormField('sortRole', sorter.order === 'ascend' ? 'asc' : 'desc');
    setSortedInfo(sorter.columnKey, sorter.order);
    this.setState({ pageNum: currentPage - 1 });
    checkSwapInputGroupCompact();
    init();
  };
}
