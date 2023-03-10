import React from 'react';
import { Relax } from 'plume2';
import { Const, DataGrid, noop } from 'qmkit';
import { List } from 'immutable';
import { Dropdown, Icon, Menu, Popconfirm } from 'antd';
import momnet from 'moment';

type TList = List<any>;
const { Column } = DataGrid;

const invoiceStateDic = {
  0: '待开票',
  1: '已开票'
};

const invoiceTypeDic = {
  0: '普通发票',
  1: '增值税专用发票'
};
const payOrderStatusDic = {
  0: '已付款',
  1: '未付款',
  2: '待确认',
  null: '未付款'
};

/**
 * 订单收款单列表
 */
@Relax
export default class OrderInvoiceList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      loading: boolean;
      // selected: TList;
      total: number;
      pageSize: number;
      dataList: TList;
      // onSelect: Function;
      onDestory: Function;
      onConfirm: Function;
      init: Function;
      onSearchByInvoiceId: Function;
      current: number;
    };
  };

  static relaxProps = {
    loading: 'loading',
    total: 'total',
    // selected: 'selected',
    pageSize: 'pageSize',
    dataList: 'dataList',
    onDestory: noop,
    // onSelect: noop,
    init: noop,
    onConfirm: noop,
    onSearchByInvoiceId: noop,
    current: 'current'
  };

  render() {
    const {
      loading,
      total,
      pageSize,
      // selected,
      dataList,
      // onSelect,
      init,
      current,
      onSearchByInvoiceId
    } = this.props.relaxProps;
    return (
      <DataGrid
        loading={loading}
        /* rowSelection={{
          type: 'checkbox',
          selectedRowKeys: selected.toJS(),
          onChange: (selectedRowKeys) => {
            onSelect(selectedRowKeys);
          }
        }}*/
        rowKey="orderInvoiceId"
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
          title="开票时间"
          key="invoiceTime"
          dataIndex="invoiceTime"
          render={(invoiceTime) => (
            <span>
              {invoiceTime
                ? momnet(invoiceTime)
                    .format(Const.TIME_FORMAT)
                    .toString()
                : '-'}
            </span>
          )}
        />
        <Column title="订单号" key="orderNo" dataIndex="orderNo" />
        <Column
          title="商家"
          key="supplierName"
          dataIndex="supplierName"
          render={(supplierName) => (supplierName ? supplierName : '-')}
        />
        <Column title="客户" key="customerName" dataIndex="customerName" />
        <Column
          title="订单金额"
          key="orderPrice"
          dataIndex="orderPrice"
          render={(orderPrice) => (
            <span>
              {orderPrice != null ? `￥${orderPrice.toFixed(2)}` : '-'}
            </span>
          )}
        />
        <Column
          title="付款状态"
          dataIndex="payOrderStatus"
          key="payOrderStatus"
          render={(payOrderStatus) => (
            <span> {payOrderStatusDic[payOrderStatus]} </span>
          )}
        />

        <Column
          title="发票类型"
          dataIndex="invoiceType"
          key="invoiceType"
          render={(invoiceType) => <span>{invoiceTypeDic[invoiceType]}</span>}
        />

        <Column
          title="发票抬头"
          dataIndex="invoiceTitle"
          key="invoiceTitle"
          render={(invoiceTitle) => <span>{invoiceTitle || '个人'}</span>}
        />

        <Column
          title="开票状态"
          dataIndex="invoiceState"
          key="invoiceState"
          render={(invoiceState) => (
            <span>{invoiceStateDic[invoiceState]}</span>
          )}
        />
        <Column
          title="操作"
          dataIndex="operation"
          key="operation"
          render={(_text, record: any) => {
            return (
              <a
                href="javascript:"
                onClick={() => onSearchByInvoiceId(record.orderInvoiceId)}
              >
                查看
              </a>
            );
          }}
        />
      </DataGrid>
    );
  }

  _renderOperate(rowInfo) {
    const { invoiceState, orderInvoiceId } = rowInfo;

    //待确认
    return (
      <Dropdown
        getPopupContainer={() => document.getElementById('page-content')}
        overlay={this._renderMenu(orderInvoiceId, invoiceState)}
        trigger={['click']}
      >
        <a className="ant-dropdown-link" href="#">
          操作 <Icon type="down" />
        </a>
      </Dropdown>
    );
  }

  _renderMenu = (id: string, invoiceState: number) => {
    const { onDestory, onConfirm, onSearchByInvoiceId } = this.props.relaxProps;

    return (
      <Menu>
        <Menu.Item key="0">
          <a href="javascript:void(0);" onClick={() => onSearchByInvoiceId(id)}>
            查看
          </a>
        </Menu.Item>

        <Menu.Item key="1">
          <Popconfirm
            title={
              invoiceState == 0
                ? '请确认已选订单已开票?'
                : '是否确认作废这条开票记录?'
            }
            onConfirm={() => {
              invoiceState == 0 ? onConfirm(id) : onDestory(id);
            }}
            okText="确定"
            cancelText="取消"
          >
            <a href="javascript:void(0);">
              {invoiceState == 0 ? '开票' : ' 作废'}
            </a>
          </Popconfirm>
        </Menu.Item>
        <Menu.Divider />
      </Menu>
    );
  };
}
