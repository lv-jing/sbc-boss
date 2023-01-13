import React from 'react';
import { Relax } from 'plume2';
import { AuthWrapper, Const, DataGrid, noop } from 'qmkit';
import { List } from 'immutable';
import { Dropdown, Icon, Menu, Modal, message } from 'antd';
import momnet from 'moment';
import { checkMenu } from '../../../web_modules/qmkit/checkAuth';
const confirm = Modal.confirm;

type TList = List<any>;
const { Column } = DataGrid;

const refundOrderStatusDic = {
  0: '待退款',
  1: '拒绝退款',
  2: '已退款',
  3: '待退款'
};

const payTypeDic = {
  0: '在线支付',
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
      onDestory: Function;
      onConfirm: Function;
      onView: Function;
      init: Function;
      onCreateRefund: Function;
      offlineAccounts: TList;
      onCreateRefuse: Function;
      onCreateOnlineRefund: Function;
      checkRefundStatus: Function;
      current: number;
    };
  };

  static relaxProps = {
    loading: 'loading',
    total: 'total',
    pageSize: 'pageSize',
    dataList: 'dataList',
    onDestory: noop,
    onSelect: noop,
    init: noop,
    onConfirm: noop,
    onView: noop,
    onCreateRefund: noop,
    offlineAccounts: 'offlineAccounts',
    onCreateRefuse: noop,
    onCreateOnlineRefund: noop,
    checkRefundStatus: noop,
    current: 'current'
  };

  render() {
    const {
      loading,
      total,
      pageSize,
      dataList,
      init,
      current
    } = this.props.relaxProps;
    return (
      <DataGrid
        loading={loading}
        rowKey="refundId"
        scroll={{ x: 1700 }}
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
          title="退款流水号"
          key="refundBillCode"
          dataIndex="refundBillCode"
          render={(refundBillCode) => (
            <span>{refundBillCode ? refundBillCode : '-'}</span>
          )}
        />
        <Column
          title="退单编号"
          key="returnOrderCode"
          dataIndex="returnOrderCode"
        />
        <Column
          title="退单时间"
          key="createTime"
          dataIndex="createTime"
          render={(createTime) => (
            <span>
              {momnet(createTime)
                .format(Const.TIME_FORMAT)
                .toString()}
            </span>
          )}
        />

        <Column title="客户名称" key="customerName" dataIndex="customerName" />
        {/*<Column title="退款时间" key="refundBillTime" dataIndex="refundBillTime"
        render={refundBillTime => refundBillTime?(
          <span>
            {momnet(refundBillTime)
              .format(Const.TIME_FORMAT)
              .toString()}
          </span>
        ): '-'} />*/}
        <Column title="商家名称" key="supplierName" dataIndex="supplierName" />
        <Column
          title="应退金额"
          key="returnPrice"
          dataIndex="returnPrice"
          render={(returnPrice) => (
            <span>
              {`￥${returnPrice ? returnPrice.toFixed(2) : (0.0).toFixed(2)}`}
            </span>
          )}
        />
        <Column
          title="退单改价"
          render={({ actualReturnPrice, returnPrice }) => {
            return returnPrice !== actualReturnPrice ? (
              <span>
                {actualReturnPrice || actualReturnPrice === 0
                  ? `￥${actualReturnPrice.toFixed(2)}`
                  : '-'}
              </span>
            ) : (
              '-'
            );
          }}
        />
        <Column
          title="应退积分"
          key="returnPoints"
          dataIndex="returnPoints"
          render={(returnPoints) => (
            <span>{`${returnPoints ? returnPoints : '-'}`}</span>
          )}
        />
        <Column
          width="100"
          title="退款方式"
          key="payType"
          dataIndex="payType"
          render={(payType) => <span>{payTypeDic[payType]}</span>}
        />
        <Column
          width="10%"
          title="退款账户"
          key="returnAccountName"
          dataIndex="returnAccountName"
          render={(returnAccountName) => (
            <span>{returnAccountName ? returnAccountName : '-'}</span>
          )}
        />
        {/*<Column
          width="10%"
          title="客户退款账户"
          key="customerAccountName"
          dataIndex="customerAccountName"
          render={customerAccountName => (
            <span>{customerAccountName ? customerAccountName : '-'}</span>
          )}
        />*/}
        <Column
          width="70"
          title="状态"
          key="refundStatus"
          dataIndex="refundStatus"
          render={(refundStatus) => (
            <span>{refundOrderStatusDic[refundStatus]}</span>
          )}
        />

        {/*<Column
          title="备注"
          key="comment"
          dataIndex="comment"
          render={comment => {
            return (
              <span>
                {comment ? (
                  <Tooltip title={this._renderComment(comment)} placement="top">
                    <a href="javascript:void(0);">查看</a>
                  </Tooltip>
                ) : (
                  '-'
                )}
              </span>
            );
          }}
        />*/}
        <Column
          width="80"
          title="操作"
          render={(rowInfo) => this._renderOperate(rowInfo)}
        />
      </DataGrid>
    );
  }

  _renderComment(comment) {
    return (
      <div style={{ wordBreak: 'break-all', wordWrap: 'break-word' }}>
        {comment}
      </div>
    );
  }

  _renderOperate(rowInfo) {
    const {
      refundStatus,
      refundId,
      customerId,
      payType,
      returnOrderCode,
      returnPrice
    } = rowInfo;
    const { onView } = this.props.relaxProps;
    //线下支付
    if (payType == 1) {
      //待退款
      if (refundStatus == 3) {
        return checkMenu('fetchRefundOrderList,rolf005') ? (
          <Dropdown
            getPopupContainer={() => document.getElementById('page-content')}
            overlay={this._renderOfflineMenu(
              refundId,
              customerId,
              returnOrderCode,
              returnPrice
            )}
            trigger={['click']}
          >
            <a className="ant-dropdown-link" href="#">
              操作 <Icon type="down" />
            </a>
          </Dropdown>
        ) : (
          <span>-</span>
        );
        //已退款
      } else if (refundStatus == 2) {
        return (
          <AuthWrapper functionName={'fetchRefundOrderList'}>
            <a href="javascript:void(0);" onClick={() => onView(refundId)}>
              查看
            </a>
          </AuthWrapper>
        );
        //已作废
      }
      //线上支付
    } else {
      if (refundStatus == 3) {
        return checkMenu('fetchRefundOrderList,rolf005') ? (
          this._renderOnlineMenu(refundId, customerId, returnOrderCode)
        ) : (
          <span>-</span>
        );
      } else if (refundStatus == 2) {
        return (
          <AuthWrapper functionName={'fetchRefundOrderList'}>
            <a href="javascript:void(0);" onClick={() => onView(refundId)}>
              查看
            </a>
          </AuthWrapper>
        );
      }
    }

    //已作废
    return (
      <AuthWrapper functionName={'fetchRefundOrderList'}>
        <a href="javascript:void(0);" onClick={() => onView(refundId)}>
          查看
        </a>
      </AuthWrapper>
    );
  }

  _renderOfflineMenu = (
    id: string,
    customerId: string,
    returnOrderCode: string,
    returnPrice: number
  ) => {
    const { onCreateRefund, onView } = this.props.relaxProps;

    return (
      <div className="operation-box">
        <AuthWrapper functionName={'fetchRefundOrderList'}>
          <a href="javascript:void(0);" onClick={() => onView(id)}>
            查看
          </a>
        </AuthWrapper>
        <AuthWrapper functionName={'rolf005'}>
          <a
            href="javascript:void(0);"
            onClick={() =>
              onCreateRefund(customerId, id, returnOrderCode, returnPrice)
            }
          >
            退款
          </a>
        </AuthWrapper>
      </div>
    );
  };

  _renderOnlineMenu = (
    id: string,
    _customerId: string,
    returnOrderCode: string
  ) => {
    const { onView } = this.props.relaxProps;
    return (
      <div className="operation-box">
        <AuthWrapper functionName={'fetchRefundOrderList'}>
          <a href="javascript:void(0);" onClick={() => onView(id)}>
            查看
          </a>
        </AuthWrapper>
        <AuthWrapper functionName={'rolf005'}>
          <a
            href="javascript:void(0);"
            onClick={() => this._onlineRefund(returnOrderCode)}
          >
            退款
          </a>
        </AuthWrapper>

        {/*<Menu.Item key="1">*/}
        {/*<a*/}
        {/*href="javascript:void(0);"*/}
        {/*onClick={async () => {*/}
        {/*const { checkRefundStatus } = this.props.relaxProps;*/}

        {/*const { res } = await checkRefundStatus(returnOrderCode);*/}

        {/*if (res.code === Const.SUCCESS_CODE) {*/}
        {/*onCreateRefuse(id);*/}
        {/*} else {*/}
        {/*message.error(res.message);*/}
        {/*}*/}
        {/*}}*/}
        {/*>*/}
        {/*拒绝退款*/}
        {/*</a>*/}
        {/*</Menu.Item>*/}
      </div>
    );
  };

  _renderAccountName(returnAccount) {
    const { offlineAccounts } = this.props.relaxProps;
    return offlineAccounts
      .find(
        (offlineAccount) => offlineAccount.get('accountId') == returnAccount
      )
      .get('bankNo');
  }

  async _onlineRefund(returnOrderCode: string) {
    const { onCreateOnlineRefund, checkRefundStatus } = this.props.relaxProps;

    const { res } = await checkRefundStatus(returnOrderCode);

    if (res.code === Const.SUCCESS_CODE) {
      confirm({
        title: '确认退款',
        content:
          '是否确认退款？退款后钱款将原路退回对方账户,使用积分将原路退回。',
        onOk() {
          return onCreateOnlineRefund(returnOrderCode);
        },
        onCancel() {}
      });
    } else {
      message.error(res.message);
    }
  }
}
