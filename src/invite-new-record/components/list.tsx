import * as React from 'react';
import { Relax, IMap } from 'plume2';
import { List } from 'immutable';
import moment from 'moment';
import { withRouter } from 'react-router';
import { DataGrid, noop, Const } from 'qmkit';

declare type IList = List<any>;
const { Column } = DataGrid;

@withRouter
@Relax
export default class InviteNewRecordList extends React.Component<any, any> {
  props: {
    history?: any;
    relaxProps?: {
      loading: boolean;
      dataList: IList;
      total: number;
      pageSize: number;
      currentPage: number;
      init: Function;
      searchParams: IMap;
      selected: IList;
      onSelect: Function;
    };
  };

  static relaxProps = {
    loading: 'loading',
    total: 'total',
    pageSize: 'pageSize',
    currentPage: 'currentPage',
    dataList: 'dataList',
    init: noop,
    searchParams: 'searchParams',
    selected: 'selected',
    onSelect: noop,
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
      currentPage,
      init,
      searchParams,
      selected,
      onSelect,
    } = this.props.relaxProps;

    const key = searchParams.get('isRewardRecorded');

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
        rowKey="recordId"
        pagination={{
          current: currentPage,
          pageSize,
          total,
          onChange: (pageNum, pageSize) => {
            init({ pageNum: pageNum - 1, pageSize });
          }
        }}
        dataSource={dataList.toJS()}
      >
        <Column
          title="受邀人"
          key="invitedNewCustomerName"
          dataIndex="invitedNewCustomerName"
          render={(invitedNewCustomerName, rowData: any) => (
            <div>
              <p>{invitedNewCustomerName}</p>
              <p>{this._hideAccount(rowData.invitedNewCustomerAccount)}</p>
            </div>
          )}
        />

        <Column
          title="邀请人"
          key="requestCustomerName"
          dataIndex="requestCustomerName"
          render={(requestCustomerName, rowData: any) => (
            <div>
              <p>
                {requestCustomerName}
                {rowData.distributor == 1 && (
                  <span style={styles.platform}>分销员</span>
                )}
              </p>
              <p>{this._hideAccount(rowData.requestCustomerAccount)}</p>
            </div>
          )}
        />

        <Column
          title="有效邀新"
          key="availableDistribution"
          dataIndex="availableDistribution"
          render={(availableDistribution) =>
            availableDistribution == 1 ? '是' : '否'
          }
        />

        <Column
          title="注册时间"
          key="registerTime"
          dataIndex="registerTime"
          render={(registerTime) =>
            registerTime ? moment(registerTime).format(Const.TIME_FORMAT) : '-'
          }
        />

        <Column
          title="下单时间"
          key="firstOrderTime"
          dataIndex="firstOrderTime"
          render={(firstOrderTime) =>
            firstOrderTime
              ? moment(firstOrderTime).format(Const.TIME_FORMAT)
              : '-'
          }
        />

        <Column
          title="订单编号"
          key="orderCode"
          dataIndex="orderCode"
          render={(orderCode) => (orderCode ? orderCode : '-')}
        />

        <Column
          title="订单完成时间"
          key="orderFinishTime"
          dataIndex="orderFinishTime"
          render={(orderFinishTime) =>
            orderFinishTime
              ? moment(orderFinishTime).format(Const.TIME_FORMAT)
              : '-'
          }
        />

        <Column
          title="奖励入账时间"
          key="rewardRecordedTime"
          dataIndex="rewardRecordedTime"
          render={(rewardRecordedTime) =>
            rewardRecordedTime
              ? moment(rewardRecordedTime).format(Const.TIME_FORMAT)
              : '-'
          }
        />

        {key == '1' ? (
          <Column
            title="奖励"
            key="rewardCash"
            dataIndex="rewardCash"
            render={(text, rowData: any) => this._renderReward(text, rowData)}
          />
        ) : (
          <Column
            title="未入账奖励"
            width=""
            key="settingAmount"
            dataIndex="settingAmount"
            render={(text, rowData: any) =>
              this._renderSettingReward(text, rowData)
            }
          />
        )}

        {key == '0' && (
          <Column
            title="未入账原因"
            key="failReasonFlag"
            dataIndex="failReasonFlag"
            render={(failReasonFlag) =>
              failReasonFlag == 0
                ? '非有效邀新'
                : failReasonFlag == 1
                  ? '奖励达到上限'
                  :failReasonFlag == 2
                  ? '奖励未开启'
                  : ''
            }
          />
        )}
      </DataGrid>
    );
  }
  /**
   * 奖励
   */
  _renderReward = (text, rowData) => {
    let show = text;
    if (rowData.rewardFlag == 0) {
      if (rowData.rewardCash) {
        show = '￥' + rowData.rewardCash.toFixed(2);
      } else {
        show = '-';
      }
    } else {
      if (rowData.rewardCoupon && rowData.rewardCoupon.length > 20) {
        show = `${rowData.rewardCoupon.substring(0, 20)}...`;
      } else {
        show = rowData.rewardCoupon;
      }
    }
    return show;
  };

  /**
   * 预计奖励
   */
  _renderSettingReward = (text, rowData) => {
    let show = text;
    if (rowData.rewardFlag == 0) {
      if (rowData.settingAmount) {
        show = '￥' + rowData.settingAmount.toFixed(2);
      } else {
        show = '-';
      }
    } else {
      if (rowData.settingCoupons && rowData.settingCoupons.length > 20) {
        show = `${rowData.settingCoupons.substring(0, 20)}...`;
      } else {
        show = rowData.settingCoupons;
      }
    }
    return show;
  };
  /**
   * 手机号隐藏
   */
  _hideAccount = (account) => {
    return account && account.length > 0
      ? account.substring(0, 3) + '****' + account.substring(7, account.length)
      : '';
  };
}

const styles = {
  platform: {
    fontSize: 12,
    color: '#fff',
    padding: '1px 3px',
    background: '#F56C1D',
    display: 'inline-block',
    marginLeft: 5
  }
};
