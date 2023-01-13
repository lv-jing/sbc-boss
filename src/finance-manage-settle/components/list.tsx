import React from 'react';

import { Relax } from 'plume2';
import {Modal, Table } from 'antd';
import { Const, noop, history, util, checkAuth } from 'qmkit';
import moment from 'moment';

import { IMap, IList } from 'typings/globalType';

const { Column } = Table;
const confirm = Modal.confirm;

@Relax
export default class List extends React.Component<any, any> {
  props: {
    relaxProps?: {
      settlePage: IMap;
      setCheckedSettleIds: Function;
      changeSettleStatus: Function;
      checkedSettleIds: IList;
      queryParams: IMap;
      fetchSettleList: Function;
    };
  };

  static relaxProps = {
    settlePage: 'settlePage',
    setCheckedSettleIds: noop,
    changeSettleStatus: noop,
    checkedSettleIds: 'checkedSettleIds',
    queryParams: 'queryParams',
    fetchSettleList: noop
  };

  render() {
    const {
      settlePage,
      setCheckedSettleIds,
      checkedSettleIds,
      queryParams,
      fetchSettleList
    } = this.props.relaxProps;

    return (
      <Table
        className="resetTable"
        rowSelection={
          queryParams.get('settleStatus') != 1 && {
            type: 'checkbox',
            onChange: (selectedRowKeys) => {
              setCheckedSettleIds(selectedRowKeys);
            },
            selectedRowKeys: checkedSettleIds.toJS()
          }
        }
        rowKey="settleId"
        dataSource={
          settlePage.get('content') ? settlePage.get('content').toJS() : []
        }
        pagination={{
          total: settlePage.get('totalElements'),
          pageSize: settlePage.get('size'),
          current: settlePage.get('number') + 1
        }}
        onChange={(pagination) =>
          fetchSettleList(pagination['current'] - 1, 10)
        }
      >
        {queryParams.get('settleStatus') == 1 && (
          <Column
            title="结算时间"
            key="settleTime"
            dataIndex="settleTime"
            render={(value) => {
              return moment(value)
                .format(Const.DAY_FORMAT)
                .toString();
            }}
          />
        )}

        <Column
          title="结算单生成时间"
          key="createTime"
          dataIndex="createTime"
          render={(value) => {
            return moment(value)
              .format(Const.DAY_FORMAT)
              .toString();
          }}
        />

        <Column title="结算单号" key="statementNo" dataIndex="settlementCode" />

        <Column
          title="结算时间段"
          key="statementTime"
          render={(row) => {
            return `${row.startTime}～${row.endTime}`;
          }}
        />

        <Column title="店铺名称" key="storeName" dataIndex="storeName" />

        <Column
          title="商品实付总额"
          key="splitPayPrice"
          dataIndex="splitPayPrice"
          render={(value) => {
            return util.FORMAT_YUAN(value);
          }}
        />

        <Column
          title="运费总额"
          key="deliveryPrice"
          dataIndex="deliveryPrice"
          render={(value) => {
            return util.FORMAT_YUAN(value);
          }}
        />

        <Column
          title="通用券优惠总额"
          key="commonCouponPrice"
          dataIndex="commonCouponPrice"
          render={(value) => {
            return util.FORMAT_YUAN(value);
          }}
        />

        <Column
          title="积分抵扣总额"
          key="pointPrice"
          dataIndex="pointPrice"
          render={(value) => {
            return util.FORMAT_YUAN(value);
          }}
        />

        <Column
          title="平台佣金总额"
          key="platformPrice"
          dataIndex="platformPrice"
          render={(value) => {
            return util.FORMAT_YUAN((Math.floor(value * 100) / 100).toFixed(2));
          }}
        />

        <Column
          title="分销佣金总额"
          key="commissionPrice"
          dataIndex="commissionPrice"
          render={(value) => {
            return util.FORMAT_YUAN(value);
          }}
        />

        <Column
          title="店铺应收总额"
          key="storePrice"
          dataIndex="storePrice"
          render={(value) => {
            return util.FORMAT_YUAN((Math.floor(value * 100) / 100).toFixed(2));
          }}
        />

        <Column
          width={60}
          title="操作"
          key="operation"
          render={(row) => {
            return (
              this._menu(row.settleId, row.settleStatus)
            );
          }}
        />
      </Table>
    );
  }

  _menu = (settleId, settleStatus) => {
    return (
      <div className="operation-box" style={{width:160}}>
        {settleStatus == 0 &&
          checkAuth('m_billing_details_2') && (
              <a onClick={() => history.push(`/billing-details/${settleId}`)}>
                设为已结算
              </a>
          )}
        {settleStatus == 2 &&
          checkAuth('m_billing_details_2') && (
              <a onClick={() => this._handleSettleStatus(settleId, 1)}>
                设为已结算
              </a>
          )}
        {checkAuth('m_billing_details_1') && (
            <a onClick={() => history.push(`/billing-details/${settleId}`)}>
              查询明细
            </a>
        )}
      </div>
    );
  };

  _handleSettleStatus = (settleId, status) => {
    const { changeSettleStatus } = this.props.relaxProps;
    confirm({
      title: '提示',
      content:
        status == 1
          ? '确定要将该条结算记录设置为"已结算"吗？'
          : '确定要将该条结算记录设置为"暂不处理"吗？',
      onOk() {
        changeSettleStatus([settleId], status);
      }
    });
  };
}
