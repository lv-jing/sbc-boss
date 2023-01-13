import * as React from 'react';
import { Relax, IMap } from 'plume2';
import { Tooltip } from 'antd';
import { withRouter } from 'react-router';
import { Const, DataGrid, noop, AuthWrapper, util } from 'qmkit';
import { List } from 'immutable';
import momnet from 'moment';

declare type IList = List<any>;
const { Column } = DataGrid;

//默认每页展示的数量
const CUSTOMER_STATUS = {
  0: '启用',
  1: '禁用'
};

const STATUS = (status) => {
  if (status === 0) {
    return 1;
  } else if (status === 1) {
    return 0;
  }
};

const STATUS_OPERATE = (status) => {
  if (status === 0) {
    return '禁用';
  } else if (status === 1) {
    return '启用';
  }
};

@withRouter
@Relax
export default class CustomerList extends React.Component<any, any> {
  props: {
    history?: any;
    relaxProps?: {
      loading: boolean;
      dataList: IList;
      total: number;
      pageSize: number;
      pageNum: number;
      onSelect: Function;
      selected: IList;
      init: Function;
      //启用/禁用
      onCheckStatus: Function;
      form: any;
      setForbidModalVisible: Function;
      sortedInfo: IMap;
      onFormChange: Function;
      setSortedInfo: Function;
    };
  };

  static relaxProps = {
    loading: 'loading',
    selected: 'selected',
    total: 'total',
    pageSize: 'pageSize',
    pageNum: 'pageNum',
    dataList: 'dataList',
    onSelect: noop,
    init: noop,
    //启用/禁用
    onCheckStatus: noop,
    form: 'form',
    setForbidModalVisible: noop,
    sortedInfo: 'sortedInfo',
    onFormChange: noop,
    setSortedInfo: noop
  };

  componentWillMount() {
    this.setState({
      tooltipVisible: {},
      rejectDomVisible: false
    });
  }

  render() {
    const {
      loading,
      dataList,
      pageSize,
      total,
      pageNum,
      selected,
      onSelect,
      init
    } = this.props.relaxProps;
    // 表格排序
    const sortedInfo = this.props.relaxProps.sortedInfo.toJS();
    return (
      <DataGrid
        loading={loading}
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: selected.toJS(),
          onChange: (selectedRowKeys) => {
            onSelect(selectedRowKeys);
          }
        }}
        rowKey="distributionId"
        onChange={(pagination, filters, sorter) =>
          this._handleOnChange(pagination, filters, sorter)
        }
        pagination={{
          current: pageNum + 1,
          pageSize,
          total,
          onChange: (pageNum, pageSize) => {
            init({ pageNum: pageNum - 1, pageSize });
          }
        }}
        dataSource={dataList.toJS()}
      >
        <Column
          title="分销员账号"
          key="customerName"
          dataIndex="customerName"
          width="120px"
          render={(_customerName, rowData) => {
            return (
              <div>
                <p>{this._parsePhone((rowData as any).customerName)}</p>
                <p>{this._parsePhone((rowData as any).customerAccount)}</p>
              </div>
            );
          }}
        />
        <Column
          title="分销员等级"
          key="distributorLevelName"
          dataIndex="distributorLevelName"
          width="110px"
        />
        <Column
          title="加入时间"
          key="createTime"
          dataIndex="createTime"
          width="110px"
          render={(createTime) => (
            <div>
              <p>
                {' '}
                {createTime
                  ? momnet(createTime)
                      .format(Const.TIME_FORMAT)
                      .toString()
                      .split(' ')[0]
                  : '-'}
              </p>
              <p>
                {' '}
                {createTime
                  ? momnet(createTime)
                      .format(Const.TIME_FORMAT)
                      .toString()
                      .split(' ')[1]
                  : '-'}
              </p>
            </div>
          )}
        />

        <Column
          title="邀新人数"
          key="inviteCount"
          dataIndex="inviteCount"
          sorter={true}
          sortOrder={sortedInfo.columnKey === 'inviteCount' && sortedInfo.order}
          render={(inviteCount) => (inviteCount ? inviteCount : '0')}
        />

        <Column
          title="有效邀新数"
          key="inviteAvailableCount"
          dataIndex="inviteAvailableCount"
          sorter={true}
          sortOrder={
            sortedInfo.columnKey === 'inviteAvailableCount' && sortedInfo.order
          }
          render={(inviteAvailableCount) =>
            inviteAvailableCount ? inviteAvailableCount : '0'
          }
        />
        <Column
          title="已入账邀新奖金"
          key="rewardCash"
          dataIndex="rewardCash"
          sorter={true}
          sortOrder={sortedInfo.columnKey === 'rewardCash' && sortedInfo.order}
          render={(text) => {
            return this._renderMoney(text);
          }}
        />
        <Column
          title="未入账邀新奖金"
          key="rewardCashNotRecorded"
          dataIndex="rewardCashNotRecorded"
          sorter={true}
          sortOrder={
            sortedInfo.columnKey === 'rewardCashNotRecorded' && sortedInfo.order
          }
          render={(text) => {
            return this._renderMoney(text);
          }}
        />
        <Column
          title="分销订单"
          key="distributionTradeCount"
          dataIndex="distributionTradeCount"
          sorter={true}
          sortOrder={
            sortedInfo.columnKey === 'distributionTradeCount' &&
            sortedInfo.order
          }
          render={(distributionTradeCount) =>
            distributionTradeCount ? distributionTradeCount : '0'
          }
        />
        <Column
          title="销售额"
          key="sales"
          dataIndex="sales"
          sorter={true}
          sortOrder={sortedInfo.columnKey === 'sales' && sortedInfo.order}
          render={(text) => {
            return this._renderMoney(text);
          }}
        />
        <Column
          title="已入账分销佣金"
          key="commission"
          dataIndex="commission"
          sorter={true}
          sortOrder={sortedInfo.columnKey === 'commission' && sortedInfo.order}
          render={(text) => {
            return this._renderMoney(text);
          }}
        />
        <Column
          title="未入账分销佣金"
          key="commissionNotRecorded"
          dataIndex="commissionNotRecorded"
          sorter={true}
          sortOrder={
            sortedInfo.columnKey === 'commissionNotRecorded' && sortedInfo.order
          }
          render={(text) => {
            return this._renderMoney(text);
          }}
        />

        <Column
          title="账号状态"
          key="forbiddenFlag"
          dataIndex="forbiddenFlag"
          render={(forbiddenFlag, rowData) => {
            if (forbiddenFlag == 1) {
              return (
                <div>
                  <p>禁止分销</p>
                  <Tooltip placement="top" title={rowData['forbiddenReason']}>
                    <a href="javascript:void(0);">原因</a>
                  </Tooltip>
                </div>
              );
            } else {
              return <span>{CUSTOMER_STATUS[forbiddenFlag]}</span>;
            }
          }}
        />

        <Column
          title="操作"
          width="62px"
          dataIndex="operation"
          key="operation"
          render={(text, rowData) => {
            return this._operator(text, rowData);
          }}
        />
      </DataGrid>
    );
  }

  /**
   * 操作按钮
   * @param record
   * @returns {any}
   */
  _operator(_text, rowData) {
    const { onCheckStatus, setForbidModalVisible } = this.props.relaxProps;
    return (
      <AuthWrapper functionName={'f_distribution_customer_2'}>
        <a
          href="javascript:void(0);"
          onClick={() => {
            STATUS(rowData.forbiddenFlag) == 0
              ? onCheckStatus(
                  rowData.distributionId,
                  STATUS(rowData.forbiddenFlag)
                )
              : setForbidModalVisible(rowData.distributionId, true);
          }}
        >
          {STATUS_OPERATE(rowData.forbiddenFlag)}
        </a>
      </AuthWrapper>
    );
  }

  /**
   * 解析phone
   * @param phone
   */
  _parsePhone(phone: string) {
    if (phone && phone.length == 11) {
      return `${phone.substring(0, 4)}****` + `${phone.substring(7, 11)}`;
    } else {
      return phone;
    }
  }

  /**
   * 金额（元）
   */
  _renderMoney(text) {
    return text ? util.FORMAT_YUAN(text) : '¥0.00';
  }

  _handleOnChange = (_pagination, _filters, sorter) => {
    const {
      init,
      onFormChange,
      setSortedInfo,
      pageNum
    } = this.props.relaxProps;
    const sortedInfo = this.props.relaxProps.sortedInfo.toJS();
    let currentPage = _pagination.current;
    //如果是翻页触发table数据变化 不重新排序
    if (pageNum != currentPage - 1) {
      return;
    }
    if (
      sorter.columnKey != sortedInfo.columnKey ||
      sorter.order != sortedInfo.order
    ) {
      onFormChange({
        field: 'sortColumn',
        value: sorter.columnKey ? sorter.columnKey : 'createTime'
      });
      onFormChange({
        field: 'sortRole',
        value: sorter.order === 'ascend' ? 'asc' : 'desc'
      });
      this.setState({ pageNum: 0 });
      setSortedInfo(sorter.columnKey, sorter.order);
    }
    init();
  };
}
