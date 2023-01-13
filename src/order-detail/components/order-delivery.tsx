import React from 'react';
import { Relax } from 'plume2';
import { fromJS } from 'immutable';
import {
  Table,
  Button,
  InputNumber,
  Modal,
  Form,
  Spin,
  Row,
  Timeline,
  Icon
} from 'antd';
import { IMap, IList } from 'typings/globalType';
import { noop, Const, AuthWrapper, Logistics } from 'qmkit';
import DeliveryForm from './delivery-form';
import Moment from 'moment';
import { FormattedMessage, injectIntl } from 'react-intl';
import { debug } from 'console';
import moment from 'moment';

const DeliveryFormDetail = Form.create({})(DeliveryForm);

/**
 * 订单发货记录
 */
@Relax
class OrderDelivery extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      logistics: [],
      loading: false
    };
  }

  props: {
    intl?: any;
    relaxProps?: {
      detail: IMap;
      deliver: Function;
      confirm: Function;
      changeDeliverNum: Function;
      showDeliveryModal: Function;
      modalVisible: boolean;
      formData: IMap;
      hideDeliveryModal: Function;
      saveDelivery: Function;
      obsoleteDeliver: Function;
      refresh: IMap;
      onRefresh: Function;
      isFetchingLogistics: boolean;
      isSavingShipment: boolean;
      logisticsLoading: boolean;
    };
  };

  static relaxProps = {
    detail: 'detail',
    deliver: noop,
    confirm: noop,
    changeDeliverNum: noop,
    showDeliveryModal: noop,
    modalVisible: 'modalVisible',
    formData: 'formData',
    hideDeliveryModal: noop,
    saveDelivery: noop,
    obsoleteDeliver: noop,
    refresh: 'refresh',
    onRefresh: noop,
    isFetchingLogistics: 'isFetchingLogistics',
    isSavingShipment: 'isSavingShipment',
    logisticsLoading: 'logisticsLoading'
  };

  /*static getDerivedStateFromProps(nextProps, prevState) {
    const { refresh } = nextProps.relaxProps;
    // 当传入的type发生变化的时候，更新state
    if (refresh != prevState.loading) {
      return {

      };
    }

    // 否则，对于state不进行任何操作
    return null;
  }*/

  render() {
    const {
      detail,
      deliver,
      modalVisible,
      saveDelivery,
      refresh,
      onRefresh,
      isFetchingLogistics,
      isSavingShipment,
      logisticsLoading
    } = this.props.relaxProps;

    const refreshList = fromJS(refresh);
    const tradeDelivers =
      refreshList && refreshList.toJS().length > 0
        ? fromJS(refresh)
        : (detail.get('tradeDelivers') as IList);
    const flowState = detail.getIn(['tradeState', 'flowState']);
    const payState = detail.getIn(['tradeState', 'payState']);
    const deliverStatus = detail.getIn(['tradeState', 'deliverStatus']);

    //处理赠品
    const gifts = (detail.get('gifts') ? detail.get('gifts') : fromJS([])).map(
      (gift) =>
        gift
          .set('skuName', `【Giveaway】${gift.get('skuName')}`)
          .set('levelPrice', 0)
          .set('isGift', true)
    );

    return (
      <div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            wordBreak: 'break-word'
          }}
        >
          <Table
            rowKey={(_record, index) => index.toString()}
            columns={this._deliveryColumns()}
            dataSource={detail.get('tradeItems').concat(gifts).toJS()}
            pagination={false}
            bordered
          />
          {/* {(flowState === 'TO_BE_DELIVERED' ||
            flowState === 'PARTIALLY_SHIPPED') &&
          (deliverStatus == 'NOT_YET_SHIPPED' ||
            deliverStatus === 'PART_SHIPPED') &&
          (payState === 'PAID' || payState === 'AUTHORIZED') ? (
            <div style={styles.buttonBox as any}>
              <AuthWrapper functionName="fOrderDetail002">
                <Button
                  type="primary"
                  loading={isFetchingLogistics}
                  onClick={() => deliver()}
                >
                  {<FormattedMessage id="Order.ship" />}
                </Button>
              </AuthWrapper>
            </div>
          ) : null} */}
        </div>
        <Spin spinning={logisticsLoading}>
          {tradeDelivers.count() > 0
            ? tradeDelivers &&
              tradeDelivers.map((v, i) => {
                const logistic = v.get('logistics');
                const tradeLogisticsData = v.get('tradeLogisticsDetails')
                  ? v.get('tradeLogisticsDetails').toJS()
                  : [];
                const tradeLogisticsDetails = tradeLogisticsData
                  .filter((x) => x.shown)
                  .sort((a, b) => {
                    return (
                      new Date(b.timestamp).getTime() -
                      new Date(a.timestamp).getTime()
                    );
                  });
                const deliverTime = v.get('deliverTime')
                  ? Moment(v.get('deliverTime')).format(Const.DAY_FORMAT)
                  : null;
                //处理赠品
                const deliversGifts = (
                  v.get('giftItemList') ? v.get('giftItemList') : fromJS([])
                ).map((gift) =>
                  gift.set(
                    'itemName',
                    `${(window as any).RCi18n({
                      id: 'Order.Giveaway'
                    })}${gift.get('itemName')}`
                  )
                );
                return (
                  <div
                    key={i}
                    style={{ display: 'flex', flexDirection: 'column' }}
                  >
                    <label style={styles.title}>
                      {<FormattedMessage id="Order.DeliveryRecord" />}
                    </label>
                    <Table
                      rowKey={(_record, index) => index.toString()}
                      columns={this._deliveryRecordColumns()}
                      dataSource={v
                        .get('shippingItems')
                        .concat(deliversGifts)
                        .toJS()}
                      pagination={false}
                      bordered
                    />

                    <div style={styles.expressBox as any}>
                      <div style={styles.stateBox}>
                        {logistic ? (
                          <div>
                            <label
                              style={styles.information}
                              className="flex-start-align"
                            >
                              【
                              <FormattedMessage id="Product.logisticsInformation" />
                              】
                              <FormattedMessage id="Order.deliveryDate" />：
                              {deliverTime}
                              &nbsp;&nbsp;{' '}
                              <FormattedMessage id="Order.logisticsCompany" />：
                              {logistic.get('logisticCompanyName')} &nbsp;&nbsp;
                              <FormattedMessage id="Order.logisticsSingleNumber" />
                              ：{logistic.get('logisticNo')}&nbsp;&nbsp;
                              {/* <Logistics companyInfo={logistic}  deliveryTime={deliverTime}/> */}
                              {/* <Button type="primary" shape="round" style={{ marginLeft: 15 }} onClick={() => onRefresh()}>
                            Refresh
                          </Button> */}
                              {v.get('trackingUrl') ? (
                                <Button
                                  type="primary"
                                  shape="round"
                                  style={{ marginLeft: 15 }}
                                  href={v.get('trackingUrl')}
                                  target="_blank"
                                  rel="noopener"
                                >
                                  <FormattedMessage id="Order.Trackdelivery" />
                                </Button>
                              ) : (
                                <Button
                                  type="primary"
                                  shape="round"
                                  style={{ marginLeft: 15 }}
                                  onClick={() => onRefresh()}
                                >
                                  <FormattedMessage id="Order.Refresh" />
                                </Button>
                              )}
                            </label>
                            <div style={{ marginTop: 20 }}>
                              <Timeline>
                                {tradeLogisticsDetails.map((item, index) => {
                                  let color = index === 0 ? 'red' : 'gray';
                                  return (
                                    <Timeline.Item color={color}>
                                      <p>
                                        {moment(item.timestamp).format(
                                          'YYYY-MM-DD HH:mm'
                                        )}{' '}
                                        {item.longDescription}
                                      </p>
                                    </Timeline.Item>
                                  );
                                })}
                              </Timeline>
                            </div>
                          </div>
                        ) : (
                          ''
                        )}
                      </div>
                      {/*{flowState === 'CONFIRMED' || flowState === 'COMPLETED' || flowState === 'VOID' ? null : (
                      <AuthWrapper functionName="fOrderDetail002">
                        <a style={{ color: 'blue' }} href="#" onClick={() => this._showCancelConfirm(v.get('deliverId'))}>
                          Invalid
                        </a>
                      </AuthWrapper>
                    )}*/}
                    </div>
                  </div>
                );
              })
            : null}
        </Spin>

        <div style={styles.expressBox as any}>
          <div style={styles.stateBox} />
          <div style={styles.expressOp}>
            {flowState === 'DELIVERED' ? (
              <AuthWrapper functionName="fOrderList003">
                <Button
                  type="primary"
                  onClick={() => {
                    this._showConfirm();
                  }}
                >
                  <FormattedMessage id="Order.confirmReceipt" />
                </Button>
              </AuthWrapper>
            ) : null}
          </div>
        </div>

        <Modal
          maskClosable={false}
          title={<FormattedMessage id="Order.DeliverGoods" />}
          visible={modalVisible}
          confirmLoading={isSavingShipment}
          onCancel={this._hideDeliveryModal}
          onOk={() => {
            this['_receiveAdd'].validateFields(null, (errs, values) => {
              //如果校验通过
              if (!errs) {
                if (values.deliverNo) {
                  values.deliverTime = values.deliverTime.format(
                    Const.DAY_FORMAT
                  );
                } else {
                  values.deliverNo = null;
                }
                saveDelivery(values);
              }
            });
          }}
        >
          {modalVisible && (
            <DeliveryFormDetail
              ref={(_receiveAdd) => (this['_receiveAdd'] = _receiveAdd)}
            />
          )}
        </Modal>
      </div>
    );
  }

  _deliveryColumns = () => {
    const { changeDeliverNum } = this.props.relaxProps;

    return [
      {
        title: <FormattedMessage id="Order.No." />,
        key: 'index',
        render: (_text, _row, index) => index + 1
      },
      {
        title: <FormattedMessage id="Order.SKUCode" />,
        dataIndex: 'skuNo',
        key: 'skuNo'
      },
      {
        title: <FormattedMessage id="Order.Productname" />,
        dataIndex: 'skuName',
        key: 'skuName',
        width: '50%'
      },
      {
        title: <FormattedMessage id="Order.Weight" />,
        dataIndex: 'specDetails',
        key: 'specDetails'
      },
      {
        title: <FormattedMessage id="Order.Quantity" />,
        dataIndex: 'num',
        key: 'num'
      },
      {
        title: <FormattedMessage id="Order.Shipped" />,
        dataIndex: 'deliveredNum',
        key: 'deliveredNum',
        render: (deliveredNum) => (deliveredNum ? deliveredNum : 0)
      },
      {
        title: <FormattedMessage id="Order.ThisShipment" />,
        key: 'deliveringNum',
        render: (_, row) => (<span>{row.deliveringNum ? row.deliveringNum : 0}</span>)
        // render: (_, row) => {
        //   return (
        //     <InputNumber
        //       min={0}
        //       max={row.num - row.deliveredNum}
        //       value={row.deliveringNum ? row.deliveringNum : 0}
        //       onChange={(value) => {
        //         changeDeliverNum(_.skuId, _.isGift, value);
        //       }}
        //     />
        //   );
        // }
      }
    ];
  };

  _deliveryRecordColumns = () => {
    return [
      {
        title: <FormattedMessage id="Order.No." />,
        key: 'index',
        render: (_text, _row, index) => index + 1
      },
      {
        title: <FormattedMessage id="Order.SKUCode" />,
        dataIndex: 'skuNo',
        key: 'skuNo'
      },
      {
        title: <FormattedMessage id="Order.Productname" />,
        dataIndex: 'itemName',
        key: 'itemName'
      },
      {
        title: <FormattedMessage id="Order.Weight" />,
        dataIndex: 'specDetails',
        key: 'specDetails'
      },
      {
        title: <FormattedMessage id="Order.ThisShipment" />,
        dataIndex: 'itemNum',
        key: 'itemNum'
      }
    ];
  };

  /**
   * 显示发货弹框
   */
  _showDeliveryModal = () => {
    const { showDeliveryModal } = this.props.relaxProps;
    showDeliveryModal();
  };

  /**
   * 关闭发货modal
   * @private
   */
  _hideDeliveryModal = () => {
    const { hideDeliveryModal } = this.props.relaxProps;
    hideDeliveryModal();
  };

  /**
   * 作废发货记录提示
   * @private
   */
  _showCancelConfirm = (tdId: string) => {
    const { obsoleteDeliver } = this.props.relaxProps;

    const confirm = Modal.confirm;
    const title = (window as any).RCi18n({ id: 'Order.prompt' });
    const content = (window as any).RCi18n({ id: 'Order.Whethertoinvalidate' });
    confirm({
      title: title,
      content: content,
      onOk() {
        obsoleteDeliver(tdId);
      },
      onCancel() {}
    });
  };

  /**
   * 确认收货确认提示
   * @param tdId
   * @private
   */
  _showConfirm = () => {
    const { confirm, detail } = this.props.relaxProps;
    const tid = detail.get('id');
    const confirmModal = Modal.confirm;
    const title = (window as any).RCi18n({ id: 'Order.confirmReceipt' });
    const content = (window as any).RCi18n({
      id: 'Order.Confirmreceiptofallitems'
    });
    confirmModal({
      title: title,
      content: content,
      onOk() {
        confirm(tid);
      },
      onCancel() {}
    });
  };
}

export default injectIntl(OrderDelivery);

const styles = {
  buttonBox: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: 10
  },
  title: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 5,
    padding: '10px 0'
  },
  expressBox: {
    paddingTop: 10,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },
  expressOp: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  stateBox: {
    display: 'flex',
    flexDirection: 'column'
  },
  information: {
    marginBottom: 10
  }
} as any;
