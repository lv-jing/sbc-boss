import React from 'react';
import { Relax } from 'plume2';
import { Const, DataGrid, noop, checkAuth } from 'qmkit';
import { List } from 'immutable';
import { Menu, Popconfirm } from 'antd';
import momnet from 'moment';

type TList = List<any>;
const { Column } = DataGrid;

const payOrderStatusDic = {
  0: '已付款',
  1: '未付款',
  2: '待确认'
};

const payTypeDic = {
  0: '线上支付',
  1: '线下支付'
};

/**
 * 订单收款单列表
 */
@Relax
export default class PayOrderList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      loading: boolean;
      selected: TList;
      total: number;
      pageSize: number;
      dataList: TList;
      onSelect: Function;
      onDestory: Function;
      onConfirm: Function;
      onView: Function;
      init: Function;
      onCreateReceivable: Function;
      current: number;
    };
  };

  static relaxProps = {
    loading: 'loading',
    total: 'total',
    selected: 'selected',
    pageSize: 'pageSize',
    dataList: 'dataList',
    onDestory: noop,
    onSelect: noop,
    init: noop,
    onConfirm: noop,
    onView: noop,
    onCreateReceivable: noop,
    current: 'current'
  };

  render() {
    const {
      loading,
      total,
      pageSize,
      selected,
      dataList,
      onSelect,
      init,
      current
    } = this.props.relaxProps;
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
        rowKey="payOrderId"
        pagination={{
          pageSize,
          total,
          current: current,
          onChange: (pageNum, pageSize) => {
            init({ pageNum: pageNum - 1, pageSize });
          }
        }}
        dataSource={dataList.toJS()}
      >
        <Column
          title="收款流水号"
          key="receivableNo"
          dataIndex="receivableNo"
          render={(receivableNo) => (
            <span>{receivableNo ? receivableNo : '-'}</span>
          )}
          width="10%"
        />
        <Column
          title="订单编号"
          key="orderCode"
          dataIndex="orderCode"
          width="10%"
        />
        <Column
          title="下单时间"
          key="createTime"
          dataIndex="createTime"
          render={(createTime) => (
            <div>
              {momnet(createTime)
                .format(Const.TIME_FORMAT)
                .toString()
                .split(' ')
                .map((v) => {
                  return <span style={{ display: 'block' }}>{v}</span>;
                })}
            </div>
          )}
          width="9%"
        />
        <Column
          title="客户名称"
          key="customerName"
          dataIndex="customerName"
          width="8%"
        />
        <Column
          title="商家名称"
          key="supplierName"
          dataIndex="supplierName"
          width="12%"
        />
        <Column
          title="支付方式"
          key="payType"
          render={(rowInfo) => (
            <span>
              {rowInfo.payOrderPrice == null && rowInfo.payOrderPoints != null
                ? '积分兑换'
                : payTypeDic[rowInfo.payType]}
            </span>
          )}
          width="8%"
        />
        <Column
          title="收款账户"
          key="receivableAccount"
          dataIndex="receivableAccount"
          render={(receivableAccount) => (
            <div>
              {receivableAccount
                ? receivableAccount.split(' ').map((v) => {
                    return <span style={{ display: 'block' }}>{v}</span>;
                  })
                : '-'}
            </div>
          )}
          width="10%"
        />
        <Column
          title="应收金额"
          key="payOrderPrice"
          render={(rowInfo) => (
            <span>
              {rowInfo.payOrderPoints != null &&
                rowInfo.payOrderPoints + '积分  '}
              {rowInfo.payOrderPrice != null &&
                `￥${
                  rowInfo.payOrderPrice
                    ? rowInfo.payOrderPrice.toFixed(2)
                    : (0.0).toFixed(2)
                }`}
            </span>
          )}
          width="8%"
        />
        <Column
          title="付款状态"
          key="payOrderStatus"
          dataIndex="payOrderStatus"
          render={(payOrderStatus) => (
            <span>{payOrderStatusDic[payOrderStatus]}</span>
          )}
          width="8%"
        />
        <Column
          title="操作"
          render={(rowInfo) => this._renderOperate(rowInfo)}
          width="8%"
        />
      </DataGrid>
    );
  }

  _renderComment(comment) {
    return <span>{comment}</span>;
  }

  _renderOperate(rowInfo) {
    const { onView } = this.props.relaxProps;

    const { payOrderId, payOrderStatus, payType, tradeState } = rowInfo;

    if (payType == 0) {
      return checkAuth('fetchPayOrderList') ? (
        <a href="javascript:void(0);" onClick={() => onView(payOrderId)}>
          查看
        </a>
      ) : (
        '-'
      );
    }

    //待确认
    if (payOrderStatus == 2) {
      return this._renderConfirmMenu(payOrderId);
    } else if (payOrderStatus == 1) {
      //未付款
      //线下
      if (payType == 1 && tradeState.flowState != 'VOID') {
        return this._renderPayMenu(payOrderId);
      } else {
        return checkAuth('fetchPayOrderList') ? (
          <a href="javascript:void(0);" onClick={() => onView(payOrderId)}>
            查看
          </a>
        ) : (
          '-'
        );
      }
    } else {
      return checkAuth('fetchPayOrderList') ? (
        <a href="javascript:void(0);" onClick={() => onView(payOrderId)}>
          查看
        </a>
      ) : (
        '-'
      );
    }
  }

  _renderConfirmMenu = (id: string) => {
    const { onConfirm, onView } = this.props.relaxProps;

    return (
      <div className="operation-box">
        {checkAuth('fetchPayOrderList') && (
          <a href="javascript:void(0);" onClick={() => onView(id)}>
            查看
          </a>
        )}

        {checkAuth('fOrderDetail003') && (
          <Popconfirm
            title="确认已线下收款？"
            onConfirm={() => {
              onConfirm(id);
            }}
            okText="确认"
            cancelText="取消"
          >
            <a style={{}} href="javascript:void(0);">
              确认
            </a>
          </Popconfirm>
        )}

        {/* {checkAuth('fOrderDetail003') && (
          <Menu.Item key="1">
            <Popconfirm
              title="确定作废这条收款记录？"
              onConfirm={() => {
                onDestory(id);
              }}
              okText="确定"
              cancelText="取消"
            >
              <a href="javascript:void(0);">作废</a>
            </Popconfirm>
          </Menu.Item>
        )} */}
      </div>
    );
  };

  _renderPayMenu = (id: string) => {
    const { onCreateReceivable, onView } = this.props.relaxProps;

    return (
      <Menu>
        {checkAuth('fetchPayOrderList') && (
          <Menu.Item key="0">
            <a
              href="javascript:void(0);"
              onClick={() => onView(id)}
              style={{ color: '#F56C1D' }}
            >
              查看
            </a>
          </Menu.Item>
        )}

        {checkAuth('fOrderDetail003') && (
          <Menu.Item key="1">
            <a
              style={{ color: '#F56C1D' }}
              href="javascript:void(0);"
              onClick={() => onCreateReceivable(id)}
            >
              新增收款记录
            </a>
          </Menu.Item>
        )}

        <Menu.Divider />
      </Menu>
    );
  };
}
