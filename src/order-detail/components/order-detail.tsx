import React from 'react';
import { IMap, Relax } from 'plume2';
import {
  Button,
  Col,
  Form,
  Icon,
  Input,
  Modal,
  Popover,
  Row,
  Table,
  Tag,
  Tooltip
} from 'antd';
import {
  AuthWrapper,
  Const,
  noop,
  cache,
  util,
  getOrderStatusValue,
  getFormatDeliveryDateStr,
  RCi18n
} from 'qmkit';
import { fromJS, Map, List } from 'immutable';
import FormItem from 'antd/lib/form/FormItem';

import moment from 'moment';
import { FormattedMessage, injectIntl } from 'react-intl';
import PetItem from '../../../src/customer-details/component/pet-item';

import './style.less';
import OrderMoreFields from './order_more_field';

const orderTypeList = [
  { value: 'SINGLE_PURCHASE', name: 'Single purchase' },
  { value: 'SUBSCRIPTION', name: 'Subscription' },
  { value: 'MIXED_ORDER', name: 'Mixed Order' }
];

const showRealStock = false; //增加变量控制要不要显示商品实时库存

/**
 * 拒绝表单，只为校验体验
 */
class RejectForm extends React.Component<any, any> {
  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form>
        <FormItem>
          {getFieldDecorator('comment', {
            rules: [
              {
                required: true,
                message: <FormattedMessage id="Order.rejectionReasonTip" />
              },
              {
                max: 100,
                message: <FormattedMessage id="Order.100charactersLimitTip" />
              }
              // { validator: this.checkComment }
            ]
          })(
            <Input.TextArea
              placeholder={(window as any).RCi18n({
                id: 'Order.RejectionReasonTip'
              })}
              autosize={{ minRows: 4, maxRows: 4 }}
            />
          )}
        </FormItem>
      </Form>
    );
  }

  checkComment = (_rule, value, callback) => {
    if (!value) {
      callback();
      return;
    }

    if (value.length > 100) {
      callback(
        new Error((window as any).RCi18n({ id: 'Order.100charactersLimitTip' }))
      );
      return;
    }
    callback();
  };
}

const WrappedRejectForm = Form.create()(injectIntl(RejectForm));

/**
 * 订单详情
 */
@Relax
class OrderDetailTab extends React.Component<any, any> {
  onAudit: any;
  _rejectForm;

  props: {
    intl?: any;
    relaxProps?: {
      detail: IMap;
      countryDict: List<any>;
      onAudit: Function;
      confirm: Function;
      retrial: Function;
      remedySellerRemark: Function;
      setSellerRemark: Function;
      verify: Function;
      onDelivery: Function;
      orderRejectModalVisible: boolean;
      showRejectModal: Function;
      hideRejectModal: Function;
      refreshGoodsRealtimeStock: Function;
    };
  };

  static relaxProps = {
    detail: 'detail',
    countryDict: 'countryDict',
    onAudit: noop,
    confirm: noop,
    retrial: noop,

    orderRejectModalVisible: 'orderRejectModalVisible',
    remedySellerRemark: noop,
    setSellerRemark: noop,
    verify: noop,
    onDelivery: noop,
    showRejectModal: noop,
    hideRejectModal: noop,
    refreshGoodsRealtimeStock: noop
  };
  state = {
    visiblePetDetails: false,
    moreData: [],
    visibleMoreFields: false,
    currentPet: {},
    tableLoading: false
  };

  render() {
    const { currentPet } = this.state;
    const { detail, countryDict, orderRejectModalVisible } =
      this.props.relaxProps;
    const storeId =
      JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA)).storeId || '';
    //当前的订单号
    const tid = detail.get('id');
    let orderSource = detail.get('orderSource');
    let orderType = '';
    if (orderSource == 'WECHAT') {
      orderType = 'H5 Order';
    } else if (orderSource == 'APP') {
      orderType = 'APP Order';
    } else if (orderSource == 'PC') {
      orderType = 'PC Order';
    } else if (orderSource == 'LITTLEPROGRAM') {
      orderType = '小程序订单';
    } else {
      orderType = '代客下单';
    }
    const tradeItems = detail.get('tradeItems')
      ? detail.get('tradeItems').toJS()
      : [];
    //订阅赠品信息
    let giftList = detail.get('subscriptionPlanGiftList')
      ? detail.get('subscriptionPlanGiftList').toJS()
      : [];
    giftList = giftList.map((gift) => {
      let tempGift = {
        skuNo: gift.goodsInfoNo,
        skuName: gift.goodsInfoName,
        num: gift.quantity,
        originalPrice: 0,
        price: 0,
        isGift: true
      };
      return tempGift;
    });

    //满赠赠品信息
    let gifts = detail.get('gifts') ? detail.get('gifts') : fromJS([]);
    gifts = gifts
      .map((gift) =>
        gift.set(
          'skuName',
          '[' + RCi18n({ id: 'Order.gift' }) + ']' + gift.get('skuName')
        )
      )
      .toJS();

    const tradePrice = detail.get('tradePrice')
      ? (detail.get('tradePrice').toJS() as any)
      : {};

    //收货人信息
    const consignee = detail.get('consignee')
      ? (detail.get('consignee').toJS() as {
          detailAddress: string;
          name: string;
          phone: string;
          countryId: string;
          city: string;
          province: string;
          cityId: number;
          address: string;
          detailAddress1: string;
          detailAddress2: string;
          rfc: string;
          postCode: string;
          firstName: string;
          lastName: string;
          comment: string;
          entrance: string;
          apartment: string;
          area: string;
          timeSlot: string;
          deliveryDate: string;
          workTime: string;
        } | null)
      : null;

    //发票信息
    const invoice = detail.get('invoice')
      ? (detail.get('invoice').toJS() as {
          open: boolean; //是否需要开发票
          type: number; //发票类型
          title: string; //发票抬头
          projectName: string; //开票项目名称
          generalInvoice: IMap; //普通发票
          specialInvoice: IMap; //增值税专用发票
          address: string;
          address1: string;
          address2: string;
          contacts: string; //联系人
          phone: string; //联系方式
          provinceId: number;
          cityId: number;
          province: string;
          countryId: number;
          // city:string;
          // province:string;
          firstName: string;
          lastName: string;
          postCode: string;
          city: string;
          comment: string;
          entrance: string;
          apartment: string;
          area: string;
        } | null)
      : null;

    //附件信息
    const encloses = detail.get('encloses')
      ? detail.get('encloses').split(',')
      : [];
    //交易状态
    const tradeState = detail.get('tradeState');

    //满减、满折金额
    tradePrice.discountsPriceDetails =
      tradePrice.discountsPriceDetails || fromJS([]);
    const discount = tradePrice.discountsPriceDetails.find(
      (item) => item.marketingType == 1
    );
    tradeItems.forEach((tradeItems) => {
      if (tradeItems.isFlashSaleGoods) {
        tradeItems.levelPrice = tradeItems.price;
      }
    });
    let firstTradeItems =
      tradeItems && tradeItems.length > 0 ? tradeItems[0] : {};
    const installmentPrice = tradePrice.installmentPrice;

    const SYSTEM_GET_CONFIG = sessionStorage.getItem(cache.SYSTEM_GET_CONFIG);
    const deliverWay = detail.get('deliverWay');
    const deliveryMethod =
      deliverWay === 1
        ? 'Home Delivery'
        : deliverWay === 2
        ? 'Pickup Delivery'
        : '';
    const address1 =
      consignee.detailAddress1 +
      ' ' +
      (deliverWay === 1
        ? consignee.timeSlot
        : deliverWay === 2
        ? consignee.workTime
        : '');

    const columns = [
      {
        title: <FormattedMessage id="Order.SKUcode" />,
        dataIndex: 'skuNo',
        key: 'skuNo',
        render: (text) => text,
        width: '11%'
      },
      {
        title: <FormattedMessage id="Order.externalSKuCode" />,
        dataIndex: 'externalSkuNo',
        key: 'externalSkuNo',
        render: (text) => text,
        width: '11%'
      },
      {
        title: <FormattedMessage id="Order.Productname" />,
        dataIndex: 'skuName',
        key: 'skuName',
        width: '9%',
        render: (text, record) => {
          const productName =
            text === 'individualization'
              ? record.petsName + "'s personalized subscription"
              : text;
          return (
            <Tooltip
              overlayStyle={{
                overflowY: 'auto'
              }}
              placement="bottomLeft"
              title={<div>{productName}</div>}
            >
              <p className="overFlowtext" style={{ width: 100 }}>
                {productName}
              </p>
            </Tooltip>
          );
        }
      },
      {
        title: <FormattedMessage id="Order.Weight" />,
        dataIndex: 'specDetails',
        key: 'specDetails',
        width: '8%'
      },
      // {
      //   title: 'Price',
      //   dataIndex: 'levelPrice',
      //   key: 'levelPrice',
      //   render: (levelPrice) => (
      //     <span>
      //       {SYSTEM_GET_CONFIG}
      //       {levelPrice && levelPrice.toFixed(2)}
      //     </span>
      //   )
      // },
      {
        title: showRealStock ? (
          <FormattedMessage
            id="Order.realTimeQuantity"
            values={{ br: <br /> }}
          />
        ) : (
          <FormattedMessage id="Order.Quantity" values={{ br: <br /> }} />
        ),
        dataIndex: 'num',
        key: 'num',
        width: '8%',
        render: (text, record) =>
          showRealStock ? record.quantityAndRealtimestock : text
      },
      {
        title: <FormattedMessage id="Order.Price" />,
        dataIndex: 'originalPrice',
        key: 'originalPrice',
        width: '9%',
        render: (originalPrice, record) =>
          record.subscriptionPrice > 0 &&
          record.subscriptionStatus === 1 &&
          record.isSuperimposeSubscription === 1 ? (
            <div>
              <span>
                {SYSTEM_GET_CONFIG}
                {record.subscriptionPrice.toFixed(
                  detail.get('subscriptionType') === 'Individualization' ? 4 : 2
                )}
              </span>
              <br />
              <span style={{ textDecoration: 'line-through' }}>
                {SYSTEM_GET_CONFIG}
                {originalPrice &&
                  originalPrice.toFixed(
                    detail.get('subscriptionType') === 'Individualization'
                      ? 4
                      : 2
                  )}
              </span>
            </div>
          ) : (
            <span>
              {SYSTEM_GET_CONFIG}
              {originalPrice &&
                originalPrice.toFixed(
                  detail.get('subscriptionType') === 'Individualization' ? 4 : 2
                )}
            </span>
          )
      },
      {
        title: <FormattedMessage id="Order.Subtotal" />,
        width: '9%',
        render: (row) => (
          <span>
            {SYSTEM_GET_CONFIG}
            {row.price && row.price.toFixed(2)}
            {/*{(row.num * (row.subscriptionPrice > 0 ? row.subscriptionPrice : row.levelPrice)).toFixed(2)}*/}
          </span>
        )
      },
      {
        title: <FormattedMessage id="Order.purchaseType" />,
        dataIndex: 'goodsInfoFlag',
        key: 'goodsInfoFlag',
        width: '9%',
        render: (text) => {
          switch (text) {
            case 0:
              return <FormattedMessage id="Order.SinglePurchase" />;
            case 1:
              return <FormattedMessage id="Order.autoship" />;
            case 2:
              return <FormattedMessage id="Order.club" />;
          }
        }
      },
      {
        title: <FormattedMessage id="Order.Subscriptionumber" />,
        dataIndex: 'subscriptionSourceList',
        key: 'subscriptionSourceList',
        width: '11%',
        render: (text, record) =>
          record.subscriptionSourceList &&
          record.subscriptionSourceList.length > 0
            ? record.subscriptionSourceList.map((x) => x.subscribeId).join(',')
            : null
      },

      // {
      //   title: <FormattedMessage id="Order.petName" />,
      //   dataIndex: 'petsName',
      //   key: 'petsName',
      //   width: '7%',
      //   render: (text, record) => (
      //     <a onClick={() => this._openPetDetails(record.petsInfo)}>
      //       {record.petsInfo ? record.petsInfo.petsName : ''}
      //     </a>
      //   )
      // },
      {
        title: '',
        width: '6%',
        render: (text, record) => {
          return record.isGift ? null : (
            <a onClick={() => this._openMoreFields(record)}>
              {' '}
              <FormattedMessage id="more" />
            </a>
          );
        }
      }
    ];

    let orderDetailType = orderTypeList.find(
      (x) => x.value === detail.get('orderType')
    );

    return (
      <div className="orderDetail">
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            marginBottom: 20,
            justifyContent: 'space-between'
          }}
        >
          <label style={styles.greenText}>
            <FormattedMessage
              id={getOrderStatusValue(
                'OrderStatus',
                detail.getIn(['tradeState', 'flowState'])
              )}
            />
          </label>

          {this._renderBtnAction(tid)}
        </div>
        <Row gutter={30}>
          <Col span={12}>
            <div className="headBox">
              <h4>
                <FormattedMessage id="Order.delivery.Order" />
              </h4>
              <Row>
                <Col span={12}>
                  <Tooltip
                    overlayStyle={{
                      overflowY: 'auto'
                    }}
                    placement="bottomLeft"
                    title={<div>{detail.get('id')}</div>}
                  >
                    <p className="overFlowtext">
                      {<FormattedMessage id="Order.OrderNumber" />}:{' '}
                      {detail.get('id')}
                    </p>
                  </Tooltip>
                  <p>
                    <FormattedMessage id="Order.ExternalOrderId" />:{' '}
                    {detail.getIn(['tradeOms', 'orderNo'])}
                  </p>
                  <p>
                    <FormattedMessage id="Order.OrderStatus" />:{' '}
                    <FormattedMessage
                      id={getOrderStatusValue(
                        'OrderStatus',
                        detail.getIn(['tradeState', 'flowState'])
                      )}
                    />
                  </p>
                  <p>
                    <FormattedMessage id="Order.orderType" />:{' '}
                    {orderDetailType ? orderDetailType.name : ''}
                  </p>
                </Col>
                <Col span={12}>
                  <p>
                    <FormattedMessage id="Order.OrderTime" />:{' '}
                    {moment(tradeState.get('createTime')).format(
                      Const.TIME_FORMAT
                    )}
                  </p>
                  <p>
                    <FormattedMessage id="Order.orderSource" />:{' '}
                    {detail.get('orderSource')}
                  </p>
                  <p>
                    <FormattedMessage id="Order.createBy" />:{' '}
                    {detail.get('orderCreateBy')}
                  </p>
                  <p>
                    <FormattedMessage id="Order.paymentMethod" />:{' '}
                    {detail.get('paymentMethodNickName')}
                  </p>
                </Col>
              </Row>
            </div>
          </Col>
          <Col span={12}>
            <div className="headBox">
              <h4>
                <FormattedMessage id="Order.PetOwner" />
              </h4>
              <p>
                <FormattedMessage id="Order.Petownername" />:{' '}
                {detail.getIn(['buyer', 'name'])}
              </p>
              <p>
                <FormattedMessage id="Order.petOwnerType" />:{' '}
                {detail.getIn(['buyer', 'levelName'])}
              </p>
              <p>
                <FormattedMessage id="Order.Petowneraccount" />:{' '}
                {detail.getIn(['buyer', 'account'])}
              </p>
            </div>
          </Col>
        </Row>
        {detail.get('subscribeId') ||
        detail.get('clinicsId') ||
        firstTradeItems.recommendationId ? (
          <Row gutter={30} style={{ display: 'flex', alignItems: 'flex-end' }}>
            {detail.get('subscribeId') ? (
              <Col span={12} style={{ alignSelf: 'flex-start' }}>
                <div className="headBox" style={{ height: 120 }}>
                  <h4>
                    <FormattedMessage id="Order.subscription" />
                  </h4>
                  <p>
                    <FormattedMessage id="Order.subscriptionType" />:{' '}
                    {detail.get('subscriptionTypeQuery')
                      ? detail.get('subscriptionTypeQuery').replace('_', ' & ')
                      : ''}
                  </p>
                  <p>
                    <FormattedMessage id="Order.subscriptionPlanType" />:{' '}
                    {detail.get('subscriptionPlanType')}
                  </p>
                </div>
              </Col>
            ) : null}

            {detail.get('clinicsId') || firstTradeItems.recommendationId ? (
              <Col span={12}>
                <div className="headBox">
                  <h4>
                    <FormattedMessage id="Order.partner" />
                  </h4>
                  <p>
                    <FormattedMessage id="Order.Auditorname" />:{' '}
                    {detail.get('clinicsName')}
                  </p>
                  <p>
                    <FormattedMessage id="Order.Auditorid" />:{' '}
                    {detail.get('clinicsId')}
                  </p>
                  <p>
                    <FormattedMessage id="Order.Recommenderid" />:{' '}
                    {firstTradeItems.recommendationId}
                  </p>
                  <p>
                    <FormattedMessage id="Order.Recommendername" />:{' '}
                    {firstTradeItems.recommendationName}
                  </p>
                </div>
              </Col>
            ) : null}

            {((detail.get('subscribeId') &&
              !(detail.get('clinicsId') || firstTradeItems.recommendationId)) ||
              (!detail.get('subscribeId') &&
                (detail.get('clinicsId') ||
                  firstTradeItems.recommendationId))) &&
            showRealStock ? (
              <Col span={12}>
                <AuthWrapper functionName="fOrderDetail001">
                  <div
                    style={{
                      color: '#E1021A',
                      display: 'flex',
                      justifyContent: 'flex-end',
                      textDecoration: 'underline',
                      cursor: 'pointer'
                    }}
                    onClick={() => this._refreshRealtimeStock(tid)}
                  >
                    Real-time stock
                  </div>
                </AuthWrapper>
              </Col>
            ) : null}
          </Row>
        ) : null}

        {((detail.get('subscribeId') &&
          (detail.get('clinicsId') || firstTradeItems.recommendationId)) ||
          (!detail.get('subscribeId') &&
            !(detail.get('clinicsId') || firstTradeItems.recommendationId))) &&
        showRealStock ? (
          <Row gutter={30} style={{ display: 'flex', alignItems: 'flex-end' }}>
            <Col span={24}>
              <AuthWrapper functionName="fOrderDetail001">
                <div
                  style={{
                    color: '#E1021A',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    textDecoration: 'underline',
                    cursor: 'pointer'
                  }}
                  onClick={() => this._refreshRealtimeStock(tid)}
                >
                  Real-time stock
                </div>
              </AuthWrapper>
            </Col>
          </Row>
        ) : null}

        <div
          style={{
            display: 'flex',
            marginTop: 20,
            marginBottom: 20,
            flexDirection: 'column',
            wordBreak: 'break-word'
          }}
        >
          <Table
            rowKey={(_record, index) => index.toString()}
            columns={columns}
            dataSource={tradeItems.concat(gifts, giftList)}
            pagination={false}
            bordered
          />

          <Modal
            title={<FormattedMessage id="Order.moreFields" />}
            width={600}
            visible={this.state.visibleMoreFields}
            onOk={() => {
              this.setState({
                visibleMoreFields: false
              });
            }}
            onCancel={() => {
              this.setState({
                visibleMoreFields: false
              });
            }}
          >
            <Row>
              <OrderMoreFields data={this.state.moreData} />
            </Row>
          </Modal>
          <Modal
            title={<FormattedMessage id="PetOwner.PetInformation" />}
            width={1100}
            visible={this.state.visiblePetDetails}
            onOk={() => {
              this.setState({
                visiblePetDetails: false
              });
            }}
            onCancel={() => {
              this.setState({
                visiblePetDetails: false
              });
            }}
          >
            <Row>
              <PetItem petsInfo={currentPet} />
            </Row>
          </Modal>

          <div style={styles.detailBox as any}>
            <div style={styles.inputBox as any} />

            <div style={styles.priceBox}>
              <label style={styles.priceItem as any}>
                <span style={styles.name}>
                  {<FormattedMessage id="Order.Productamount" />}:
                </span>
                <strong>
                  {SYSTEM_GET_CONFIG}
                  {(tradePrice.goodsPrice || 0).toFixed(2)}
                </strong>
              </label>

              {/* {discount && (
                <label style={styles.priceItem as any}>
                  <span style={styles.name}>{<FormattedMessage id="promotionAmount" />}:</span>
                  <strong>
                    -{SYSTEM_GET_CONFIG}
                    {discount.discounts.toFixed(2)}
                  </strong>
                </label>
              )} */}

              {/* {tradePrice.firstOrderOnThePlatformDiscountPrice ? (
                <label style={styles.priceItem as any}>
                  <span style={styles.name}>First Order Discount:</span>
                  <strong>
                    -{SYSTEM_GET_CONFIG}
                    {tradePrice.firstOrderOnThePlatformDiscountPrice.toFixed(2)}
                  </strong>
                </label>
              ) : null} */}

              {tradePrice.promotionVOList &&
              tradePrice.promotionVOList.length > 0
                ? tradePrice.promotionVOList.map((promotion) => (
                    <label style={styles.priceItem as any}>
                      <span style={styles.name}>{promotion.marketingName}</span>
                      <strong>
                        -{SYSTEM_GET_CONFIG}
                        {(promotion.discountPrice || 0).toFixed(2)}
                      </strong>
                    </label>
                  ))
                : null}

              {tradePrice.subscriptionDiscountPrice ? (
                <label style={styles.priceItem as any}>
                  <span style={styles.name}>
                    <FormattedMessage id="Order.subscriptionDiscount" />:
                  </span>
                  <strong>
                    -{SYSTEM_GET_CONFIG}
                    {(tradePrice.subscriptionDiscountPrice || 0).toFixed(2)}
                  </strong>
                </label>
              ) : null}

              <label style={styles.priceItem as any}>
                <span style={styles.name}>
                  {<FormattedMessage id="Order.shippingFees" />}:{' '}
                </span>
                <strong>
                  {SYSTEM_GET_CONFIG}
                  {(tradePrice.deliveryPrice || 0).toFixed(2)}
                </strong>
              </label>
              {tradePrice.freeShippingFlag ? (
                <label style={styles.priceItem as any}>
                  <span style={styles.name}>
                    {<FormattedMessage id="Order.shippingFeesDiscount" />}:{' '}
                  </span>
                  <strong>
                    -{SYSTEM_GET_CONFIG}
                    {(tradePrice.freeShippingDiscountPrice || 0).toFixed(2)}
                  </strong>
                </label>
              ) : null}
              {+sessionStorage.getItem(cache.TAX_SWITCH) === 1 ? (
                <label style={styles.priceItem as any}>
                  <span style={styles.name}>
                    {<FormattedMessage id="Order.Tax" />}:{' '}
                  </span>
                  <strong>
                    {SYSTEM_GET_CONFIG}
                    {(tradePrice.taxFeePrice || 0).toFixed(2)}
                  </strong>
                </label>
              ) : null}

              <label style={styles.priceItem as any}>
                <span style={styles.name}>
                  {<FormattedMessage id="Order.Total" />}:{' '}
                </span>
                <strong>
                  {SYSTEM_GET_CONFIG}
                  {(tradePrice.totalPrice || 0).toFixed(2)}
                  {installmentPrice && installmentPrice.additionalFee
                    ? ' +(' +
                      SYSTEM_GET_CONFIG +
                      (installmentPrice.additionalFee || 0).toFixed(2) +
                      ')'
                    : null}
                </strong>
              </label>
            </div>
          </div>
        </div>

        <Row gutter={30}>
          <Col span={12}>
            <div className="headBox" style={{ height: 250 }}>
              <h4>
                <FormattedMessage id="Order.deliveryAddress" />
              </h4>
              <Row>
                <Col span={12}>
                  <Tooltip
                    overlayStyle={{
                      overflowY: 'auto'
                    }}
                    placement="bottomLeft"
                    title={<div>{consignee.firstName}</div>}
                  >
                    <p className="overFlowtext">
                      <FormattedMessage id="Order.FirstName" />:{' '}
                      {consignee.firstName}
                    </p>
                  </Tooltip>
                  <Tooltip
                    overlayStyle={{
                      overflowY: 'auto'
                    }}
                    placement="bottomLeft"
                    title={<div>{consignee.lastName}</div>}
                  >
                    <p className="overFlowtext">
                      <FormattedMessage id="Order.LastName" />:{' '}
                      {consignee.lastName}
                    </p>
                  </Tooltip>
                  <Tooltip
                    overlayStyle={{
                      overflowY: 'auto'
                    }}
                    placement="bottomLeft"
                    title={<div>{address1}</div>}
                  >
                    <p className="overFlowtext">
                      <FormattedMessage id="Order.address1" />: {address1}
                    </p>
                  </Tooltip>
                  <Tooltip
                    overlayStyle={{
                      overflowY: 'auto'
                    }}
                    placement="bottomLeft"
                    title={<div>{consignee.detailAddress2}</div>}
                  >
                    <p className="overFlowtext">
                      <FormattedMessage id="Order.address2" />:{' '}
                      {consignee.detailAddress2}
                    </p>
                  </Tooltip>
                  <p>
                    <FormattedMessage id="Order.country" />:{' '}
                    {countryDict
                      ? countryDict.find((c) => c.id == consignee.countryId)
                        ? countryDict.find((c) => c.id == consignee.countryId)
                            .name
                        : consignee.countryId
                      : ''}
                  </p>
                  <p>
                    <FormattedMessage id="Order.Entrance" />:{' '}
                    {consignee.entrance}
                  </p>
                  <p>
                    <FormattedMessage id="Order.timeSlot" />:{' '}
                    {consignee.timeSlot}
                  </p>
                  <Tooltip
                    overlayStyle={{
                      overflowY: 'auto'
                    }}
                    placement="bottomLeft"
                    title={<div>{consignee.comment}</div>}
                  >
                    <p className="overFlowtext">
                      <FormattedMessage id="Order.Comment" />:{' '}
                      {consignee.comment}
                    </p>
                  </Tooltip>
                </Col>

                <Col span={12}>
                  <Tooltip
                    overlayStyle={{
                      overflowY: 'auto'
                    }}
                    placement="bottomLeft"
                    title={<div>{consignee.city}</div>}
                  >
                    <p className="overFlowtext">
                      <FormattedMessage id="Order.city" />: {consignee.city}
                    </p>
                  </Tooltip>
                  <p>
                    <FormattedMessage id="Order.Postalcode" />:{' '}
                    {consignee.postCode}
                  </p>
                  <p>
                    <FormattedMessage id="Order.phoneNumber" />:{' '}
                    {consignee.phone}
                  </p>
                  <p>
                    <FormattedMessage id="Order.state" />: {consignee.province}
                  </p>
                  <p>
                    <FormattedMessage id="Order.region" />: {consignee.area}
                  </p>
                  <p>
                    <FormattedMessage id="Order.Apartment" />:{' '}
                    {consignee.apartment}
                  </p>
                  <Tooltip
                    overlayStyle={{
                      overflowY: 'auto'
                    }}
                    placement="bottomLeft"
                    title={
                      <div>
                        {getFormatDeliveryDateStr(consignee.deliveryDate)}
                      </div>
                    }
                  >
                    <p className="overFlowtext">
                      <FormattedMessage id="Order.deliveryDate" />:{' '}
                      {getFormatDeliveryDateStr(consignee.deliveryDate)}
                    </p>
                  </Tooltip>
                  {storeId === 123457907 && (
                    <Tooltip
                      overlayStyle={{
                        overflowY: 'auto'
                      }}
                      placement="bottomLeft"
                      title={<div>{deliveryMethod}</div>}
                    >
                      <p className="overFlowtext">
                        <FormattedMessage id="Order.workTime" />:{' '}
                        {deliveryMethod}
                      </p>
                    </Tooltip>
                  )}
                </Col>
                {storeId === 123457907 ? (
                  <Col span={24}>
                    <p>
                      <FormattedMessage id="Order.estimatedDeliveryDate" />:
                      {detail.get('minDeliveryTime') &&
                      detail.get('maxDeliveryTime') ? (
                        detail.get('minDeliveryTime') !==
                        detail.get('maxDeliveryTime') ? (
                          <FormattedMessage
                            id="Order.estimatedDeliveryDateDesc"
                            values={{
                              minDay: detail.get('minDeliveryTime'),
                              maxDay: detail.get('maxDeliveryTime')
                            }}
                          />
                        ) : (
                          <FormattedMessage
                            id="Order.estimatedDeliveryDateDescEqual"
                            values={{ day: detail.get('minDeliveryTime') }}
                          />
                        )
                      ) : null}
                    </p>
                  </Col>
                ) : null}
              </Row>
            </div>
          </Col>
          {storeId !== 123457907 ? (
            <Col span={12}>
              <div className="headBox" style={{ height: 220 }}>
                <h4>
                  <FormattedMessage id="Order.billingAddress" />
                </h4>
                <Row>
                  <Col span={12}>
                    <Tooltip
                      overlayStyle={{
                        overflowY: 'auto'
                      }}
                      placement="bottomLeft"
                      title={<div>{invoice.firstName}</div>}
                    >
                      <p className="overFlowtext">
                        <FormattedMessage id="Order.FirstName" />:{' '}
                        {invoice.firstName}
                      </p>
                    </Tooltip>
                    <Tooltip
                      overlayStyle={{
                        overflowY: 'auto'
                      }}
                      placement="bottomLeft"
                      title={<div>{invoice.lastName}</div>}
                    >
                      <p className="overFlowtext">
                        <FormattedMessage id="Order.LastName" />:{' '}
                        {invoice.lastName}
                      </p>
                    </Tooltip>
                    <Tooltip
                      overlayStyle={{
                        overflowY: 'auto'
                      }}
                      placement="bottomLeft"
                      title={<div>{invoice.address1}</div>}
                    >
                      <p className="overFlowtext">
                        <FormattedMessage id="Order.address1" />:{' '}
                        {invoice.address1}
                      </p>
                    </Tooltip>
                    <Tooltip
                      overlayStyle={{
                        overflowY: 'auto'
                      }}
                      placement="bottomLeft"
                      title={<div>{invoice.address2}</div>}
                    >
                      <p className="overFlowtext">
                        <FormattedMessage id="Order.address2" />:{' '}
                        {invoice.address2}
                      </p>
                    </Tooltip>
                    <p>
                      <FormattedMessage id="Order.country" />:{' '}
                      {countryDict.find((c) => c.id == invoice.countryId)
                        ? countryDict.find((c) => c.id == invoice.countryId)
                            .name
                        : invoice.countryId}
                    </p>
                    <p>
                      <FormattedMessage id="Order.Entrance" />:{' '}
                      {invoice.entrance}
                    </p>
                  </Col>
                  <Col span={12}>
                    <p>
                      <FormattedMessage id="Order.city" />: {invoice.city}
                    </p>
                    <p>
                      <FormattedMessage id="Order.Postalcode" />:{' '}
                      {invoice.postCode}
                    </p>
                    <p>
                      <FormattedMessage id="Order.phoneNumber" />:{' '}
                      {invoice.phone}
                    </p>
                    <p>
                      <FormattedMessage id="Order.state" />: {invoice.province}
                    </p>
                    <p>
                      <FormattedMessage id="Order.region" />: {invoice.area}
                    </p>
                    <p>
                      <FormattedMessage id="Order.Apartment" />:{' '}
                      {invoice.apartment}
                    </p>
                  </Col>
                  <Col span={24}>
                    <Tooltip
                      overlayStyle={{
                        overflowY: 'auto'
                      }}
                      placement="bottomLeft"
                      title={<div>{invoice.comment}</div>}
                    >
                      <p className="overFlowtext">
                        <FormattedMessage id="Order.Comment" />:{' '}
                        {invoice.comment}
                      </p>
                    </Tooltip>
                  </Col>
                </Row>
              </div>
            </Col>
          ) : null}
        </Row>

        <Modal
          maskClosable={false}
          title={<FormattedMessage id="Order.rejectionReasonTip" />}
          visible={orderRejectModalVisible}
          okText={<FormattedMessage id="Order.save" />}
          onOk={() => this._handleOK(tid)}
          onCancel={() => this._handleCancel()}
        >
          <WrappedRejectForm
            ref={(form) => {
              this._rejectForm = form;
            }}
          />
        </Modal>
      </div>
    );
  }

  //刷新商品实时库存
  _refreshRealtimeStock = async (tid: string) => {
    // this.setState({ tableLoading: true });
    const { refreshGoodsRealtimeStock } = this.props.relaxProps;
    await refreshGoodsRealtimeStock(tid);
    this.setState({ tableLoading: false });
  };

  //附件
  _renderEncloses(encloses) {
    if (encloses.size == 0 || encloses[0] === '') {
      return <span>{<FormattedMessage id="none" />}</span>;
    }

    return encloses.map((v, k) => {
      return (
        <Popover
          key={'pp-' + k}
          placement="topRight"
          title={''}
          trigger="click"
          content={
            <img
              key={'p-' + k}
              style={styles.attachmentView}
              src={v.get('url')}
            />
          }
        >
          <a href="#">
            <img key={k} style={styles.attachment} src={v.get('url')} />
          </a>
        </Popover>
      );
    });
  }

  _renderBtnAction(tid: string) {
    const { detail, verify, onDelivery } = this.props.relaxProps;
    const flowState = detail.getIn(['tradeState', 'flowState']);
    const payState = detail.getIn(['tradeState', 'payState']);
    const deliverStatus = detail.getIn(['tradeState', 'deliverStatus']);
    const paymentOrder = detail.get('paymentOrder');

    //修改状态的修改
    //创建订单状态
    if (flowState === 'INIT' || flowState === 'AUDIT') {
      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {payState === 'NOT_PAID' &&
            // <AuthWrapper functionName="edit_order_f_001">
            //   <Tooltip placement="top" title="Modify">
            //     <a
            //       style={styles.pr20}
            //       onClick={() => {
            //         verify(tid);
            //       }}
            //     >
            //       Modify
            //     </a>
            //   </Tooltip>
            // </AuthWrapper>
            null}
          {flowState === 'AUDIT' && (
            <div>
              {payState === 'PAID' || payState === 'UNCONFIRMED'
                ? null
                : // <AuthWrapper functionName="fOrderList002">
                  //   <Tooltip placement="top" title="Re-review">
                  //     <a
                  //       onClick={() => {
                  //         this._showRetrialConfirm(tid);
                  //       }}
                  //       href="javascript:void(0)"
                  //       style={styles.pr20}
                  //     >
                  //       Re-review
                  //     </a>
                  //   </Tooltip>
                  // </AuthWrapper>
                  null}
              {!(paymentOrder == 'PAY_FIRST' && payState != 'PAID') && (
                <AuthWrapper functionName="fOrderDetail002">
                  <Tooltip
                    placement="top"
                    title={<FormattedMessage id="Order.ship" />}
                  >
                    <a
                      href="javascript:void(0);"
                      style={styles.pr20}
                      onClick={() => {
                        onDelivery();
                      }}
                      className="iconfont iconbtn-shipping"
                    >
                      {/*{<FormattedMessage id="Order.ship" />}*/}
                    </a>
                  </Tooltip>
                </AuthWrapper>
              )}
            </div>
          )}
        </div>
      );
    } else if (
      (flowState === 'TO_BE_DELIVERED' || flowState === 'PARTIALLY_SHIPPED') &&
      (deliverStatus == 'NOT_YET_SHIPPED' ||
        deliverStatus === 'PART_SHIPPED') &&
      payState === 'PAID'
    ) {
      return (
        <div>
          <AuthWrapper functionName="fOrderDetail002">
            <Tooltip
              placement="top"
              title={<FormattedMessage id="Order.ship" />}
            >
              <a
                href="javascript:void(0);"
                style={styles.pr20}
                onClick={() => {
                  onDelivery();
                }}
                className="iconfont iconbtn-shipping"
              >
                {/*{<FormattedMessage id="Order.ship" />}*/}
              </a>
            </Tooltip>
          </AuthWrapper>
        </div>
      );
    } else if (flowState === 'DELIVERED') {
      return (
        <div>
          <AuthWrapper functionName="fOrderList003">
            <Tooltip
              placement="top"
              title={<FormattedMessage id="Order.confirmReceipt" />}
            >
              <a
                onClick={() => {
                  this._showConfirm(tid);
                }}
                href="javascript:void(0)"
                style={styles.pr20}
              >
                <FormattedMessage id="Order.confirmReceipt" />
              </a>
            </Tooltip>
          </AuthWrapper>
        </div>
      );
    }

    return null;
  }

  /**
   * 处理成功
   */
  _handleOK = (tdId) => {
    const { onAudit } = this.props.relaxProps;
    this._rejectForm.validateFields(null, (errs, values) => {
      //如果校验通过
      if (!errs) {
        onAudit(tdId, 'REJECTED', values.comment);
        this._rejectForm.setFieldsValue({ comment: '' });
      }
    });
  };

  /**
   * 处理取消
   */
  _handleCancel = () => {
    const { hideRejectModal } = this.props.relaxProps;
    hideRejectModal();
    this._rejectForm.setFieldsValue({ comment: '' });
  };

  /**
   * 回审订单确认提示
   * @param tdId
   * @private
   */
  _showRetrialConfirm = (tdId: string) => {
    const { retrial } = this.props.relaxProps;

    const confirm = Modal.confirm;
    const title = (window as any).RCi18n({ id: 'Order.Re-review' });
    const content = (window as any).RCi18n({
      id: 'Order.Confirmtoreturntheselected'
    });
    confirm({
      title: title,
      content: content,
      onOk() {
        retrial(tdId);
      },
      onCancel() {}
    });
  };

  /**
   * 确认收货确认提示
   * @param tdId
   * @private
   */
  _showConfirm = (tdId: string) => {
    const { confirm } = this.props.relaxProps;

    const confirmModal = Modal.confirm;
    const title = (window as any).RCi18n({ id: 'Order.ConfirmReceipt' });
    const content = (window as any).RCi18n({
      id: 'Order.ConfirmThatAllProducts'
    });
    confirmModal({
      title: title,
      content: content,
      onOk() {
        confirm(tdId);
      },
      onCancel() {}
    });
  };
  _openPetDetails = (petsInfo) => {
    this.setState({
      visiblePetDetails: true,
      currentPet: petsInfo ? petsInfo : {}
    });
  };

  _openMoreFields = (recored) => {
    const data = [{ ...recored }];
    this.setState({
      visibleMoreFields: true,
      moreData: data
    });
  };
}

export default injectIntl(OrderDetailTab);

const styles = {
  greenText: {
    color: '#339966'
  },
  greyText: {
    marginLeft: 20
  },
  pr20: {
    paddingRight: 20
  },
  detailBox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    border: '1px solid #e9e9e9',
    borderTop: 0,
    marginTop: -4,
    borderRadius: 4
  },
  priceBox: {
    display: 'flex',
    flexDirection: 'column'
  },
  name: {
    width: 140,
    textAlign: 'right',
    display: 'inline-block'
  },
  priceItem: {
    width: 300,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10
  },
  inputBox: {
    display: 'flex',
    flexDirection: 'column',
    height: 70,
    justifyContent: 'space-between'
  },
  inforItem: {
    paddingTop: 10,
    marginLeft: 20
  } as any,

  imgItem: {
    width: 40,
    height: 40,
    border: '1px solid #ddd',
    display: 'inline-block',
    marginRight: 10,
    background: '#fff'
  },
  attachment: {
    maxWidth: 40,
    maxHeight: 40,
    marginRight: 5
  },
  attachmentView: {
    maxWidth: 400,
    maxHeight: 400
  },
  platform: {
    fontSize: 12,
    color: '#fff',
    padding: '1px 3px',
    background: '#F56C1D',
    display: 'inline-block',
    marginLeft: 5
  }
} as any;
