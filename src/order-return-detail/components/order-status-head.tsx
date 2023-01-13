import React from 'react';
import { Relax } from 'plume2';
import moment from 'moment';
import { Col, message, Modal, Row } from 'antd';
import { IMap } from 'typings/globalType';
import { AuthWrapper, checkAuth, Const, history, noop } from 'qmkit';
import { RefundModal, RejectModal } from 'biz';

const confirm = Modal.confirm;

@Relax
export default class OrderStatusHead extends React.Component<any, any> {
  props: {
    relaxProps?: {
      detail: IMap;
      //驳回／拒绝收货 modal状态
      rejectModalData: IMap;
      // 填写物流 modal状态
      deliverModalData: IMap;
      // 线下退款 modal状态
      refundModalData: IMap;
      init: Function;
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
      queryCustomerOfflineAccount: Function;
      customerOfflineAccount: string;
      refundRecord: IMap;
    };
  };

  static relaxProps = {
    detail: 'detail',
    rejectModalData: 'rejectModalData',
    deliverModalData: 'deliverModalData',
    refundModalData: 'refundModalData',
    init: noop,
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
    queryCustomerOfflineAccount: noop,
    customerOfflineAccount: 'customerOfflineAccount',
    refundRecord: 'refundRecord'
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {
      detail,
      onOnlineRefund,
      onOfflineRefund,
      onCloseRefund,
      rejectModalData,
      onRejectModalHide,
      refundModalData,
      onRefundModalHide,
      refundRecord
    } = this.props.relaxProps;

    const rid = detail.get('id');
    const customerId = detail.getIn(['buyer', 'id']);
    // 支付方式 0在线 1线下
    const payType = detail.get('payType') === 0 ? 0 : 1;
    // 支付渠道
    // 退单类型 RETURN 退货, REFUND 退款
    const returnType = detail.get('returnType') || 'RETURN';
    const returnFlowState = detail.get('returnFlowState');
    // 总额
    const totalPrice = detail.getIn(['returnPrice', 'totalPrice']);
    // 改价金额
    const applyPrice = detail.getIn(['returnPrice', 'applyPrice']);
    // 应退金额，如果对退单做了改价，使用applyPrice，否则，使用总额totalPrice
    const payPrice = applyPrice || totalPrice;

    return (
      <div style={styles.container as any}>
        <div style={styles.headBox as any}>
          <div style={styles.head}>
            <h4 style={styles.greenText}>
              {returnType == 'RETURN'
                ? Const.returnGoodsState[returnFlowState]
                : Const.returnMoneyState[returnFlowState] || ''}
            </h4>
            <div>
              {/*已收货状态 或者 退款单的已审核状态*/}
              {(returnFlowState === 'RECEIVED' ||
                (returnType == 'REFUND' && returnFlowState === 'AUDIT')) &&
                refundRecord.get('refundStatus') === 3 && (
                  <AuthWrapper functionName="rodf002">
                    <a
                      style={styles.pr20}
                      href="javascript:;"
                      type="primary"
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
                            this._showOnlineRefund(onOnlineRefund, rid);
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
              {/*退款失败状态*/}
              {returnFlowState === 'REFUND_FAILED' && [
                <AuthWrapper functionName="rodf002">
                  <a
                    href="javascript:;"
                    type="primary"
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
                          this._showOnlineRefund(onOnlineRefund, rid);
                        }
                      } else {
                        message.error('此功能您没有权限访问');
                      }
                    }}
                  >
                    退款
                  </a>
                </AuthWrapper>,
                <AuthWrapper functionName="rodf003">
                  <a
                    href="javascript:void(0)"
                    style={{ marginLeft: 30 }}
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
            </div>
          </div>

          <Row>
            <Col span={8}>
              <p style={styles.darkText}>
                退单号：{detail.get('id')}{' '}
                {detail.get('platform') != 'CUSTOMER' && (
                  <span style={styles.platform}>代退单</span>
                )}
              </p>
              <p style={styles.darkText}>
                申请时间：{moment(detail.get('createTime')).format(
                  Const.TIME_FORMAT
                )}
              </p>
              <p style={styles.darkText}>订单号：{detail.get('tid')}</p>
            </Col>
            <Col span={8}>
              <p style={styles.darkText}>
                商家：{detail.getIn(['company', 'supplierName'])}
              </p>
              <p style={styles.darkText}>
                商家编号：{detail.getIn(['company', 'companyCode'])}
              </p>
            </Col>
            <Col span={8}>
              <p style={styles.darkText}>
                客户：{detail.getIn(['buyer', 'name'])}
              </p>
              <p style={styles.darkText}>
                客户账号：{this._parsePhone(detail.getIn(['buyer', 'account']))}
              </p>
              {detail.getIn(['buyer', 'customerFlag']) && (
                <p style={styles.darkText}>
                  客户等级：{detail.getIn(['buyer', 'levelName'])}
                </p>
              )}
            </Col>
          </Row>
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
  async _showOnlineRefund(onOnlineRefund: Function, rid: string) {
    const { checkRefundStatus, init, detail } = this.props.relaxProps;
    let confirmContent = [<div>
        是否确认退款？退款后钱款将原路退回对方账户,使用积分将原路退回。
      </div>];
    // 支付渠道
    const payWay = detail.get('payWay');
    //ts-ignore
    payWay && confirmContent.push(<div>退款渠道：{Const.payWay[payWay]}</div>);
    const { res } = await checkRefundStatus(rid);
    if (res.code === Const.SUCCESS_CODE) {
      confirm({
        title: '在线退款',
        content: confirmContent,
        okText: '退款',
        onOk() {
          return onOnlineRefund(rid);
        },
        onCancel() {}
      });
    } else {
      message.error(res.message);
      setTimeout(() => init(rid), 2000);
    }
  }

  // 线下退款
  _showOfflineRefund(
    onOfflineRefund: Function,
    rid: string,
    customerId: string,
    refundAmount: number
  ) {
    const { queryCustomerOfflineAccount } = this.props.relaxProps;
    queryCustomerOfflineAccount();
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
    // 在线退款需要校验是否已在退款处理中
    if (online) {
      const { checkRefundStatus, init } = this.props.relaxProps;
      const { res } = await checkRefundStatus(rid);
      if (res.code !== Const.SUCCESS_CODE) {
        message.error(res.message);
        setTimeout(() => init(rid), 2000);
        return;
      }
    }

    this.props.relaxProps.onRejectModalChange({
      visible: true,
      type: '拒绝退款',
      onOk: onRejectRefund,
      rid: rid
    });
  }

  // 关闭退款
  async _showCloseRefund(onCloseRefund: Function, rid: string) {
    const { checkRefundStatus, init } = this.props.relaxProps;
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
      setTimeout(() => init(rid), 2000);
    }
  }

  /**
   * 解析phone
   * @param phone
   */
  _parsePhone(phone: string) {
    if (phone && phone.length == 11) {
      return `${phone.substring(0, 3)}****` + `${phone.substring(7, 11)}`;
    } else {
      return phone;
    }
  }
}

const styles = {
  container: {
    backgroundColor: '#f5f5f5',
    padding: 15
  },
  orderEnd: {
    display: 'flex',
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'flex-end'
  } as any,
  pr20: {
    paddingRight: 20
  },
  headBox: {},
  greenText: {
    color: '#339966',
    display: 'block',
    marginBottom: 5
  },
  darkText: {
    color: '#333333',
    lineHeight: '24px'
  },
  platform: {
    fontSize: 12,
    color: '#fff',
    padding: '1px 3px',
    background: '#F56C1D',
    display: 'inline-block',
    marginLeft: 5
  },
  head: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  } as any
};
