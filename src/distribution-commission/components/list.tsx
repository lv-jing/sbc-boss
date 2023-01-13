import * as React from 'react';
import { Link } from 'react-router-dom';
import { Relax, IMap } from 'plume2';
import { Tooltip } from 'antd';
import { List } from 'immutable';
import moment from 'moment';
import { withRouter } from 'react-router';
import { DataGrid, noop, Const, AuthWrapper } from 'qmkit';

declare type IList = List<any>;
const { Column } = DataGrid;

//默认每页展示的数量
const CUSTOMER_STATUS = {
  0: '启用',
  1: '禁用'
};
@withRouter
@Relax
export default class DistributionCommisionList extends React.Component<
  any,
  any
> {
  props: {
    history?: any;
    relaxProps?: {
      loading: boolean;
      dataList: IList;
      total: number;
      pageSize: number;
      currentPage: number;
      init: Function;
      onPagination: Function;
      searchParams: IMap;
      onSelect: Function;
      selected: IList;
    };
  };

  static relaxProps = {
    loading: 'loading',
    total: 'total',
    pageSize: 'pageSize',
    currentPage: 'currentPage',
    dataList: 'dataList',
    init: noop,
    onPagination: noop,
    searchParams: 'searchParams',
    selected: 'selected',
    onSelect: noop,
  };

  constructor(props) {
    super(props);
    const { searchParams } = props.relaxProps;
    this.state = {
      sortedInfo: {
        columnKey: searchParams.get('sortColumn'),
        order: searchParams.get('sortRole') == 'asc' ? 'ascend' : 'descend'
      }
    };
  }

  /**
   * 数据源发生变化时，以新的为准
   * @param nextProps
   */
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.relaxProps.searchParams.get('sortColumn') !=
        this.props.relaxProps.searchParams.get('sortColumn') ||
      nextProps.relaxProps.searchParams.get('sortRole') !=
        this.props.relaxProps.searchParams.get('sortRole')
    ) {
      this.setState({
        sortedInfo: {
          columnKey: nextProps.relaxProps.searchParams.get('sortColumn'),
          order:
            nextProps.relaxProps.searchParams.get('sortRole') == 'asc'
              ? 'ascend'
              : 'descend'
        }
      });
    }
  }

  render() {
    const {
      loading,
      dataList,
      pageSize,
      total,
      currentPage,
      selected,
      onSelect
    } = this.props.relaxProps;
    const { sortedInfo } = this.state;
    return (
      <DataGrid
        loading={loading}
        rowKey="distributionId"
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: selected.toJS(),
          onChange: (selectedRowKeys) => {
            onSelect(selectedRowKeys);
          }
        }}
        pagination={{ current: currentPage, pageSize, total }}
        onChange={(pagination, filters, sorter) =>
          this._changeOrder(pagination, filters, sorter)
        }
        dataSource={dataList.toJS()}
      >
        <Column
          title="分销员名称/账号"
          key="customerAccount"
          dataIndex="customerAccount"
          render={(customerAccount, rowData: any) => (
            <div>
              <p>{rowData.customerName}</p>
              <p>{this._hideAccount(customerAccount)}</p>
            </div>
          )}
        />

        <Column
            title="分销员等级"
            key="distributorLevelName"
            dataIndex="distributorLevelName"
        />

        <Column
          width={114}
          title="加入时间"
          key="createTime"
          dataIndex="createTime"
          sorter={true}
          sortOrder={sortedInfo.columnKey === 'createTime' && sortedInfo.order}
          render={(createTime) =>
            createTime ? moment(createTime).format(Const.TIME_FORMAT) : '-'
          }
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
          title="已入账佣金总额"
          key="commissionTotal"
          dataIndex="commissionTotal"
          sorter={true}
          sortOrder={
            sortedInfo.columnKey === 'commissionTotal' && sortedInfo.order
          }
          render={(commissionTotal) =>
            commissionTotal ? '￥' + commissionTotal.toFixed(2) : '￥0.00'
          }
        />

        <Column
          title="已入账分销佣金"
          key="commission"
          dataIndex="commission"
          sorter={true}
          sortOrder={sortedInfo.columnKey === 'commission' && sortedInfo.order}
          render={(commission) =>
            commission ? '￥' + commission.toFixed(2) : '￥0.00'
          }
        />

        <Column
          title="已入账邀新奖金"
          key="rewardCash"
          dataIndex="rewardCash"
          sorter={true}
          sortOrder={sortedInfo.columnKey === 'rewardCash' && sortedInfo.order}
          render={(rewardCash) =>
            rewardCash ? '￥' + rewardCash.toFixed(2) : '￥0.00'
          }
        />

        <Column
          title="未入账分销佣金"
          key="commissionNotRecorded"
          dataIndex="commissionNotRecorded"
          sorter={true}
          sortOrder={
            sortedInfo.columnKey === 'commissionNotRecorded' && sortedInfo.order
          }
          render={(commissionNotRecorded) =>
            commissionNotRecorded
              ? '￥' + commissionNotRecorded.toFixed(2)
              : '￥0.00'
          }
        />

        <Column
          title="未入账邀新奖金"
          key="rewardCashNotRecorded"
          dataIndex="rewardCashNotRecorded"
          sorter={true}
          sortOrder={
            sortedInfo.columnKey === 'rewardCashNotRecorded' && sortedInfo.order
          }
          render={(rewardCashNotRecorded) =>
            rewardCashNotRecorded
              ? '￥' + rewardCashNotRecorded.toFixed(2)
              : '￥0.00'
          }
        />

        <Column
          width={96}
          title="操作"
          key="operate"
          render={(record) => {
            return (
              <AuthWrapper functionName={'f_distribution_commission_list'}>
                <div>
                  <Link
                    to={`/commission-detail/${(record as any).customerId}`}
                  >
                    查看
                  </Link>
                </div>
              </AuthWrapper>
            );
          }}
        />
      </DataGrid>
    );
  }

  /**
   * 升降序排列
   * @param pagination
   * @param filters
   * @param sorter
   * @private
   */
  _changeOrder = (pagination, _filters, sorter) => {
    const { onPagination } = this.props.relaxProps;
    //sortName
    const field = sorter.field;
    //sortOrder
    const order = sorter.order == 'descend' ? 'desc' : 'asc';
    //普通换页还是排序,当前的排序名称不变，则为页切换，变化的话则为排序，从第一页开始
    const { sortedInfo } = this.state;
    if (sortedInfo) {
      if (
        sortedInfo.columnKey != sorter.field ||
        sortedInfo.order != sorter.order
      ) {
        onPagination(1, field, order);
      } else {
        onPagination(pagination.current, field, order);
      }
    }
    this.setState({
      sortedInfo: sorter.field
        ? sorter
        : { columnKey: 'createTime', order: 'descend' }
    });
  };

  /**
   * 手机号隐藏
   */
  _hideAccount = (account) => {
    return account.length > 0
      ? account.substring(0, 3) + '****' + account.substring(7, account.length)
      : '';
  };
}
