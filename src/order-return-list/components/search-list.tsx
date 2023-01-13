import React from 'react';
import { IMap, Relax } from 'plume2';
import { List, fromJS } from 'immutable';
import momnet from 'moment';
import { Link } from 'react-router-dom';
import { Checkbox, Modal, Pagination, Spin, message, Tooltip } from 'antd';
import { Const, noop, history, checkAuth, AuthWrapper } from 'qmkit';
import { RefundModal, RejectModal } from 'biz';
import { allCheckedQL } from '../ql';

const defaultImg = require('../img/none.png');

const confirm = Modal.confirm;
type TList = List<any>;

@Relax
export default class SearchList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      loading: boolean;
      selected: TList;
      total: number;
      pageSize: number;
      currentPage: number;
      dataList: TList;
      //驳回／拒绝收货 modal状态
      rejectModalData: IMap;
      // 填写物流 modal状态
      deliverModalData: IMap;
      // 线下退款 modal状态
      refundModalData: IMap;
      init: Function;
      onCheckedAll: Function;
      onChecked: Function;
      onRejectModalChange: Function;
      onRejectModalHide: Function;
      onDeliverModalChange: Function;
      onDeliverModalHide: Function;
      onRefundModalChange: Function;
      onRefundModalHide: Function;
      onAudit: Function;
      onReject: Function;
      onDeliver: Function;
      onReceive: Function;
      onRejectReceive: Function;
      onOnlineRefund: Function;
      onOfflineRefund: Function;
      onRejectRefund: Function;
      onCloseRefund: Function;
      getCanRefundPrice: Function;
      checkRefundStatus: Function;
      onCheckFunAuth: Function;
      allChecked: boolean;
      queryCustomerOfflineAccount: Function;
    };
  };

  static relaxProps = {
    loading: 'loading',
    total: 'total',
    selected: 'selected',
    pageSize: 'pageSize',
    currentPage: 'currentPage',
    dataList: 'dataList',
    rejectModalData: 'rejectModalData',
    deliverModalData: 'deliverModalData',
    refundModalData: 'refundModalData',
    queryCustomerOfflineAccount: noop,
    init: noop,
    onCheckedAll: noop,
    onChecked: noop,
    onRejectModalChange: noop,
    onRejectModalHide: noop,
    onDeliverModalChange: noop,
    onDeliverModalHide: noop,
    onRefundModalChange: noop,
    onRefundModalHide: noop,
    onAudit: noop,
    onReject: noop,
    onDeliver: noop,
    onReceive: noop,
    onRejectReceive: noop,
    onOnlineRefund: noop,
    onOfflineRefund: noop,
    onRejectRefund: noop,
    onCloseRefund: noop,
    getCanRefundPrice: noop,
    checkRefundStatus: noop,
    onCheckFunAuth: noop,
    allChecked: allCheckedQL
  };

  render() {
    const {
      loading,
      total,
      pageSize,
      currentPage,
      init,
      allChecked,
      dataList,
      onCheckedAll,
      rejectModalData,
      onRejectModalHide,
      refundModalData,
      onRefundModalHide
    } = this.props.relaxProps;

    return (
      <div>
        <div className="ant-table-wrapper">
          <div className="ant-table ant-table-large ant-table-scroll-position-left">
            <div className="ant-table-content">
              <div className="ant-table-body">
                <table
                  style={{ borderCollapse: 'separate', borderSpacing: '0 1em' }}
                >
                  <thead className="ant-table-thead">
                    <tr>
                      <th
                        style={{
                          width: '0.5%'
                        }}
                      >
                        <Checkbox
                          checked={allChecked}
                          onChange={(e) => {
                            const checked = (e.target as any).checked;
                            onCheckedAll(checked);
                          }}
                        />
                      </th>
                      <th>商品</th>
                      <th style={{ width: '10%' }}> 订单号</th>
                      <th style={{ width: '98px' }}> 退单时间</th>
                      <th style={{ width: '10%' }}> 客户名称</th>
                      <th style={{ width: '10%' }}> 商家</th>
                      <th style={{ width: '12%' }}> 应退金额</th>
                      <th style={{ width: '10%' }}> 退单状态</th>
                      <th style={{ width: '12%' }}> 实退金额</th>
                    </tr>
                  </thead>
                  <tbody className="ant-table-tbody">
                    {loading
                      ? this._renderLoading()
                      : this._renderContent(dataList)}
                  </tbody>
                </table>
              </div>
              {total == 0 ? (
                <div className="ant-table-placeholder">
                  <span>
                    <i className="anticon anticon-frown-o" />
                    暂无数据
                  </span>
                </div>
              ) : null}
            </div>
          </div>
          {total > 0 ? (
            <Pagination
              current={currentPage}
              total={total}
              pageSize={pageSize}
              onChange={(pageNum, pageSize) => {
                init({
                  pageNum: pageNum - 1,
                  pageSize: pageSize,
                  flushSelected: false
                });
              }}
            />
          ) : null}
        </div>
        <RejectModal
          data={rejectModalData}
          onHide={onRejectModalHide}
          handleOk={rejectModalData.get('onOk')}
        />
        <RefundModal
          data={refundModalData}
          onHide={onRefundModalHide}
          handleOk={refundModalData.get('onOk')}
        />
      </div>
    );
  }

  _renderLoading() {
    return (
      <tr style={styles.loading}>
        <td colSpan={9}>
          <Spin />
        </td>
      </tr>
    );
  }

  _renderContent(dataList) {
    const {
      onChecked,
      onOnlineRefund,
      onOfflineRefund,
      onCloseRefund
    } = this.props.relaxProps;

    return dataList.map((v, index) => {
      const rid = v.get('id');
      const customerId = v.getIn(['buyer', 'id']);
      // 支付方式 0在线 1线下
      const payType = v.get('payType') === 0 ? 0 : 1;
      // 支付渠道
      const payWay = v.get('payWay');
      // 退单类型 RETURN退货 REFUND退款
      const returnType = v.get('returnType') || 'RETURN';
      // 退单状态
      const returnFlowState = v.get('returnFlowState');

      //退款单状态
      const refundStatus = v.get('refundStatus');

      //退单赠品
      const returnGifts = v.get('returnGifts')
        ? v.get('returnGifts')
        : fromJS([]);

      // 总额
      const totalPrice = v.getIn(['returnPrice', 'totalPrice']);
      // 改价金额
      const applyPrice = v.getIn(['returnPrice', 'applyPrice']);

      const applyStatus = v.getIn(['returnPrice', 'applyStatus']);
      // 应退金额，如果对退单做了改价，使用applyPrice，否则，使用总额totalPrice
      const payPrice = totalPrice;
      const actualReturnPrice = applyStatus
        ? applyPrice
        : v.getIn(['returnPrice', 'actualReturnPrice']);

      const fourthImg =
        v
          .get('returnItems')
          .concat(returnGifts)
          .get(4) &&
        v
          .get('returnItems')
          .concat(returnGifts)
          .get(4)
          .get('pic');

      return (
        <tr
          className="ant-table-row  ant-table-row-level-0"
          key={Math.random()}
        >
          <td colSpan={9} style={{ padding: 0 }}>
            <table
              className="ant-table-self"
              style={{ border: '1px solid #ddd' }}
            >
              <thead>
                <tr>
                  <td
                    colSpan={12}
                    style={{
                      marginTop: 12,
                      borderBottom: '1px solid #f5f5f5',
                      height: 36
                    }}
                  >
                    <span style={{ marginLeft: '16px' }}>
                      <Checkbox
                        checked={v.get('checked')}
                        onChange={(e) => {
                          const checked = (e.target as any).checked;
                          onChecked(index, checked);
                        }}
                      />
                    </span>
                    <span style={{ marginLeft: 20, color: '#000000' }}>
                      {rid}
                    </span>
                    {v.get('platform') != 'CUSTOMER' && (
                      <span style={styles.platform}>代退单</span>
                    )}
                    <span style={{ marginRight: 0, float: 'right' }}>
                      {(returnFlowState === 'RECEIVED' ||
                        (returnType == 'REFUND' &&
                          returnFlowState === 'AUDIT')) &&
                        refundStatus === 3 && (
                          <AuthWrapper functionName="rodf002">
                            <a
                              href="javascript:void(0)"
                              style={{ marginLeft: 20 }}
                              onClick={async () => {
                                // 校验是否有退款权限, rodf002 为退款权限的功能编号
                                const haveAuth = checkAuth('rodf002');
                                if (haveAuth) {
                                  if (payType == 1) {
                                    this._showOfflineRefund(
                                      onOfflineRefund,
                                      rid,
                                      customerId,
                                      payPrice
                                    );
                                  } else {
                                    this._showOnlineRefund(
                                      onOnlineRefund,
                                      rid,
                                      payWay
                                    );
                                  }
                                } else {
                                  message.error('此功能您没有权限访问');
                                }
                              }}
                            >
                              退款
                            </a>
                          </AuthWrapper>
                        )}

                      {returnFlowState === 'REFUND_FAILED' && [
                        <AuthWrapper functionName="rodf002">
                          <a
                            href="javascript:void(0)"
                            style={{ marginLeft: 20 }}
                            onClick={async () => {
                              // 校验是否有退款权限, rodf002 为退款权限的功能编号
                              const haveAuth = checkAuth('rodf002');
                              if (haveAuth) {
                                if (payType == 1) {
                                  this._showOfflineRefund(
                                    onOfflineRefund,
                                    rid,
                                    customerId,
                                    payPrice
                                  );
                                } else {
                                  this._showOnlineRefund(
                                    onOnlineRefund,
                                    rid,
                                    payWay
                                  );
                                }
                              } else {
                                message.error('此功能您没有权限访问');
                              }
                            }}
                          >
                            退款
                          </a>
                          <a
                            href="javascript:void(0)"
                            style={{ marginLeft: 20 }}
                            onClick={async () => {
                              // 校验是否有关闭退款权限
                              const haveAuth = checkAuth('rodf002');
                              if (haveAuth) {
                                this._showCloseRefund(onCloseRefund, rid);
                              } else {
                                message.error('此功能您没有权限访问');
                              }
                            }}
                          >
                            关闭退款
                          </a>
                        </AuthWrapper>
                      ]}

                      <AuthWrapper functionName={'rodf001'}>
                        <Link
                          style={{ marginLeft: 20, marginRight: 20 }}
                          to={`/order-return-detail/${rid}`}
                        >
                          查看详情
                        </Link>
                      </AuthWrapper>
                    </span>
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ width: '3%' }} />
                  <td colSpan={2} style={{ paddingTop: 14, paddingBottom: 16 }}>
                    {/*商品图片*/}
                    {v
                      .get('returnItems')
                      .concat(returnGifts)
                      .map((v, k) => {
                        const img = v.get('pic') ? v.get('pic') : defaultImg;
                        return k < 4 ? (
                          <img
                            //ts-ignore
                            style={styles.listImages}
                            src={img}
                            title={v.get('skuName')}
                            key={k}
                          />
                        ) : null;
                      })}

                    {/*第4张特殊处理*/
                    v.get('returnItems').concat(returnGifts).size > 3 ? (
                      //@ts-ignore
                      <div style={styles.imgBg}>
                        <img
                          //@ts-ignore
                          src={fourthImg ? fourthImg : defaultImg}
                          //@ts-ignore
                          style={styles.imgFourth}
                        />
                        //@ts-ignore
                        <div style={styles.imgNum}>
                          共 {v.get('returnItems').concat(returnGifts).size}件
                        </div>
                      </div>
                    ) : null}
                  </td>
                  <td
                    style={{
                      width: '10%'
                    }}
                  >
                    {/*订单编号*/}
                    {v.get('tid')}
                  </td>
                  <td
                    style={{
                      width: '98px'
                    }}
                  >
                    {/*退单时间*/}
                    {v.get('createTime')
                      ? momnet(v.get('createTime'))
                          .format(Const.TIME_FORMAT)
                          .toString()
                      : ''}
                  </td>
                  <td
                    style={{
                      width: '10%'
                    }}
                  >
                    {/*客户名称*/}
                    {v.getIn(['buyer', 'name'])}
                  </td>
                  <td
                    style={{
                      width: '10%'
                    }}
                  >
                    {/*商家*/}
                    {v.getIn(['company', 'supplierName'])}
                    <br />
                    {v.getIn(['company', 'companyCode'])}
                  </td>
                  <td
                    style={{
                      width: '12%'
                    }}
                  >
                    {'￥' + parseFloat(payPrice).toFixed(2)}
                  </td>
                  {/*状态*/}
                  <td style={{ width: '10%' }}>
                    {returnType == 'RETURN'
                      ? Const.returnGoodsState[returnFlowState]
                      : Const.returnMoneyState[returnFlowState] || ''}
                    {returnFlowState == 'REFUND_FAILED' && (
                      <Tooltip title={v.get('refundFailedReason')}>
                        <a style={{ display: 'block' }}>原因</a>
                      </Tooltip>
                    )}
                  </td>
                  {/*实退金额*/}
                  <td style={{ width: '12%' }}>
                    {returnFlowState == 'COMPLETED'
                      ? '￥' + parseFloat(actualReturnPrice).toFixed(2)
                      : '-'}
                    &nbsp;&nbsp;&nbsp;
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      );
    });
  }

  // 审核
  async _showAudit(
    onAudit: Function,
    rid: string,
    payPrice: number,
    online: boolean
  ) {
    // 剩余可退金额
    let remainPrice = payPrice;
    const { getCanRefundPrice } = this.props.relaxProps;
    const { res } = await getCanRefundPrice(rid);
    if (res.code === Const.SUCCESS_CODE) {
      remainPrice = res.context;
    }

    if (remainPrice < payPrice) {
      // 在线，不能审核通过，只能去修改
      if (online) {
        confirm({
          title: `该订单剩余可退金额为：￥${remainPrice.toFixed(2)}`,
          content: '退款金额不可大于可退金额，请修改后再审核',
          okText: '去修改',
          cancelText: '关闭',
          onOk() {
            history.push(`/order-return-edit/${rid}`);
          }
        });
      } else {
        if (remainPrice < 0) {
          remainPrice = 0;
        }
        // 线下，给出提示，可以审核
        confirm({
          title: `该订单剩余可退金额为：￥${remainPrice.toFixed(2)}`,
          content: '当前退款金额超出了可退金额，是否继续？',
          onOk() {
            return onAudit(rid);
          },
          onCancel() {},
          okText: '继续',
          cancelText: '关闭'
        });
      }
    } else {
      confirm({
        title: '审核通过',
        content: '是否确认审核通过？',
        onOk() {
          return onAudit(rid);
        },
        onCancel() {}
      });
    }
  }

  // 驳回
  _showReject(onReject: Function, rid: string) {
    this.props.relaxProps.onRejectModalChange({
      visible: true,
      type: '驳回',
      onOk: onReject,
      rid: rid
    });
  }

  // 填写物流
  _showDeliver(onDeliver: Function, rid: string) {
    this.props.relaxProps.onDeliverModalChange({
      visible: true,
      onOk: onDeliver,
      rid: rid
    });
  }

  // 收货
  _showReceive(onReceive: Function, rid: string) {
    confirm({
      title: '确认收货',
      content: '是否确认收货？',
      onOk() {
        return onReceive(rid);
      },
      onCancel() {}
    });
  }

  // 拒绝收货
  _showRejectReceive(onRejectReceive: Function, rid: string) {
    this.props.relaxProps.onRejectModalChange({
      visible: true,
      type: '拒绝收货',
      onOk: onRejectReceive,
      rid: rid
    });
  }

  // 在线退款
  async _showOnlineRefund(onOnlineRefund: Function, rid: string, payWay) {
    const {
      checkRefundStatus,
      init,
      currentPage,
      pageSize
    } = this.props.relaxProps;
    const { res } = await checkRefundStatus(rid);

    let confirmContent = [
      <div>是否确认退款？退款后钱款将原路退回对方账户,使用积分将原路退回。</div>
    ];
    if (payWay) {
      confirmContent.push(<div>退款渠道：{Const.payWay[payWay]}</div>);
    }
    if (res.code === Const.SUCCESS_CODE) {
      confirm({
        title: '确认退款',
        content: confirmContent,
        onOk() {
          return onOnlineRefund(rid);
        },
        onCancel() {}
      });
    } else {
      message.error(res.message);
      setTimeout(
        () =>
          init({
            pageNum: currentPage - 1 < 0 ? 0 : currentPage - 1,
            pageSize: pageSize
          }),
        2000
      );
    }
  }

  // 线下退款
  async _showOfflineRefund(
    onOfflineRefund: Function,
    rid: string,
    customerId: string,
    refundAmount: number
  ) {
    const { queryCustomerOfflineAccount } = this.props.relaxProps;
    queryCustomerOfflineAccount(rid);
    this.props.relaxProps.onRefundModalChange({
      visible: true,
      onOk: onOfflineRefund,
      rid: rid,
      customerId: customerId,
      refundAmount: refundAmount
    });
  }

  // 拒绝退款
  async _showRejectRefund(
    onRejectRefund: Function,
    rid: string,
    online: boolean
  ) {
    const { onCheckFunAuth } = this.props.relaxProps;
    const { res } = await onCheckFunAuth('/return/refund/*/reject', 'POST');
    if (res.context) {
      // 在线退款需要校验是否已在退款处理中
      if (online) {
        const {
          checkRefundStatus,
          init,
          currentPage,
          pageSize
        } = this.props.relaxProps;
        const { res } = await checkRefundStatus(rid);
        if (res.code !== Const.SUCCESS_CODE) {
          message.error(res.message);
          setTimeout(
            () =>
              init({
                pageNum: currentPage - 1 < 0 ? 0 : currentPage - 1,
                pageSize: pageSize
              }),
            2000
          );
          return;
        }
      }

      this.props.relaxProps.onRejectModalChange({
        visible: true,
        type: '拒绝退款',
        onOk: onRejectRefund,
        rid: rid
      });
    } else {
      message.error('此功能您没有权限访问');
      return;
    }
  }

  // 关闭退款
  async _showCloseRefund(onCloseRefund: Function, rid: string) {
    const {
      checkRefundStatus,
      init,
      currentPage,
      pageSize
    } = this.props.relaxProps;
    const { res } = await checkRefundStatus(rid);

    if (res.code === Const.SUCCESS_CODE) {
      confirm({
        title: '关闭退款',
        content: '请确认是否已完成退款。',
        onOk() {
          return onCloseRefund(rid);
        },
        onCancel() {}
      });
    } else {
      message.error(res.message);
      setTimeout(
        () =>
          init({
            pageNum: currentPage - 1 < 0 ? 0 : currentPage - 1,
            pageSize: pageSize
          }),
        2000
      );
    }
  }
}

const styles = {
  loading: {
    textAlign: 'center',
    height: 300
  },
  modalTextArea: {
    width: 250,
    height: 60
  },
  listImages: {
    width: 60,
    height: 60,
    float: 'left',
    padding: 5,
    background: '#fff',
    border: '1px solid #ddd',
    marginRight: 10,
    borderRadius: 3
  },
  imgFourth: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 60,
    height: 60,
    borderRadius: 3
  },
  imgBg: {
    position: 'relative',
    width: 60,
    height: 60,
    padding: 5,
    border: '1px solid #ddd',
    float: 'left',
    marginRight: 10,
    borderRadius: 3
  },
  imgNum: {
    position: 'absolute',
    top: 0,
    left: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    background: 'rgba(0,0,0,0.6)',
    fontSize: 9,
    color: '#fff',
    borderRadius: 3
  },
  platform: {
    fontSize: 12,
    padding: '1px 3px',
    display: 'inline-block',
    marginLeft: 5,
    border: ' 1px solid #F56C1D',
    color: '#F56C15',
    borderRadius: 5
  }
};
