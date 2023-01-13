import React from 'react';
import { Breadcrumb, Tabs, Card, Dropdown, Icon, Menu, Row, Col, Button, Input, Select, message, DatePicker, Table, InputNumber, Modal, Popconfirm, Radio, Collapse, Spin, Tooltip } from 'antd';
import { StoreProvider } from 'plume2';
import { Link } from 'react-router-dom';
import FeedBack from './component/feedback';
import { Headline, BreadCrumb, SelectGroup, Const, cache, AuthWrapper, getOrderStatusValue, RCi18n } from 'qmkit';
import { FormattedMessage, injectIntl } from 'react-intl';
import './index.less';
import * as webapi from './webapi';
const Panel = Collapse.Panel;

import moment from 'moment';
import { FORMERR } from 'dns';

const { Search } = Input;

const { Option } = Select;
const { TabPane } = Tabs;

const deliverStatus = (status) => {
  if (status == 'NOT_YET_SHIPPED') {
    return <FormattedMessage id="Subscription.notShipped" />;
  } else if (status == 'SHIPPED') {
    return <FormattedMessage id="Subscription.allShipments" />;
  } else if (status == 'PART_SHIPPED') {
    return <FormattedMessage id="Subscription.partialShipment" />;
  } else if (status == 'VOID') {
    return <FormattedMessage id="Subscription.invalid" />;
  } else {
    return <FormattedMessage id="Subscription.unknown" />;
  }
};
/**
 * 订单详情
 */
class SubscriptionDetail extends React.Component<any, any> {
  props: {
    intl;
    match: any;
  };
  constructor(props) {
    super(props);
    this.state = {
      title: 'Subscription details',
      subscriptionId: null,
      loading: true,
      orderInfo: {},
      subscriptionInfo: {},
      recentOrderList: [],
      goodsInfo: [],
      petsId: '',
      petsInfo: {},
      paymentInfo: {},
      deliveryAddressId: '',
      deliveryAddressInfo: {},
      billingAddressId: '',
      billingAddressInfo: {},
      countryArr: [],
      operationLog: [],
      promotionCode: '',
      deliveryPrice: '',
      taxFeePrice: '',
      discountsPrice: '',
      freeShippingFlag: false,
      freeShippingDiscountPrice: 0,
      subscriptionDiscountPrice: 0,
      promotionVOList: [],
      individualFrequencyList: [],
      frequencyList: [],
      frequencyClubList: [],
      promotionDesc: 'Promotion',
      noStartOrder: [],
      completedOrder: [],
      billingCityName: '',
      deliveryCityName: '',
      currencySymbol: '',
      isActive: false,
    };
  }

  componentDidMount() {
    this.setState(
      {
        subscriptionId: this.props.match && this.props.match.params ? this.props.match.params.subId : null
      },
      () => {
        this.getCurrencySymbol();
        this.getDict();
        this.getSubscriptionDetail(this.state.subscriptionId);
        this.getBySubscribeId(this.state.subscriptionId);
      }
    );
  }

  //查询frequency
  // querySysDictionary = (type: String) => {
  //   webapi
  //     .querySysDictionary({ type: type })
  //     .then((data) => {
  //       const { res } = data;
  //       if (res.code === Const.SUCCESS_CODE) {
  //         this.setState({
  //           frequencyList: res.context.sysDictionaryVOS
  //         });
  //       } else {
  //         message.error('Unsuccessful');
  //       }
  //     })
  //     .catch((err) => {
  //       message.error('Unsuccessful');
  //     });
  // };

  getSubscriptionDetail = (id: String) => {
    this.setState({
      loading: true
    });
    webapi
      .getSubscriptionDetail(id)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          let subscriptionDetail = res.context;
          let subscriptionInfo = {
            deliveryTimes: subscriptionDetail.deliveryTimes,
            subscriptionStatus: subscriptionDetail.subscribeStatus === '0' ? <FormattedMessage id="Subscription.Active" /> : subscriptionDetail.subscribeStatus === '1' ? <FormattedMessage id="Subscription.Pause" /> : <FormattedMessage id="Subscription.Inactive" />,
            subscriptionNumber: subscriptionDetail.subscribeId,
            subscriptionTime: subscriptionDetail.createTime,
            presciberID: subscriptionDetail.prescriberId,
            presciberName: subscriptionDetail.prescriberName,
            consumer: subscriptionDetail.customerName,
            consumerAccount: subscriptionDetail.customerAccount,
            consumerType: subscriptionDetail.customerType,
            phoneNumber: subscriptionDetail.customerPhone,
            frequency: subscriptionDetail.cycleTypeId,
            frequencyName: subscriptionDetail.frequency,
            nextDeliveryTime: moment(new Date(subscriptionDetail.nextDeliveryTime)).format('MMMM Do YYYY'),
            promotionCode: subscriptionDetail.promotionCode,
            subscriptionType: subscriptionDetail.subscriptionType,
            subscriptionPlanType: subscriptionDetail.subscriptionPlanType
          };
          let orderInfo = {
            recentOrderId: subscriptionDetail.trades ? subscriptionDetail.trades[0].id : '',
            orderStatus: subscriptionDetail.trades ? subscriptionDetail.trades[0].tradeState.flowState : ''
          };
          let recentOrderList = [];
          if (subscriptionDetail.trades) {
            for (let i = 0; i < subscriptionDetail.trades.length; i++) {
              let recentOrder = {
                recentOrderId: subscriptionDetail.trades[i].id,
                orderStatus: subscriptionDetail.trades[i].tradeState.flowState
              };
              recentOrderList.push(recentOrder);
            }
          }

          let goodsInfo = subscriptionDetail.goodsInfo;
          let paymentInfo = subscriptionDetail.payPaymentInfo;

          this.setState(
            {
              subscriptionInfo: subscriptionInfo,
              orderInfo: orderInfo,
              recentOrderList: recentOrderList,
              goodsInfo: goodsInfo,
              paymentInfo: paymentInfo,
              petsId: subscriptionDetail.petsId,
              deliveryAddressId: subscriptionDetail.deliveryAddressId,
              deliveryAddressInfo: subscriptionDetail.consignee,
              billingAddressId: subscriptionDetail.billingAddressId,
              billingAddressInfo: subscriptionDetail.invoice,
              promotionCode: subscriptionDetail.promotionCode,
              noStartOrder: subscriptionDetail.noStartTradeList,
              completedOrder: subscriptionDetail.completedTradeList,
              isActive: subscriptionDetail.subscribeStatus === "0"
            },
            () => {
              this.applyPromationCode(this.state.promotionCode);
            }
          );
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
      });
  };
  skipNextDelivery = (id: String) => {
    this.setState({
      loading: true
    });
    webapi
      .cancelNextSubscription({ subscribeId: id })
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          this.getSubscriptionDetail(this.state.subscriptionId);
          message.success(<FormattedMessage id="Subscription.OperateSuccessfully" />);
        } else {
          this.setState({
            loading: false
          });
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
      });
  };

  orderNow = (id: String) => {
    this.setState({
      loading: true
    });
    webapi
      .orderNow({ subscribeId: id })
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          this.getSubscriptionDetail(this.state.subscriptionId);
          message.success(<FormattedMessage id="Subscription.OperateSuccessfully" />);
        } else {
          this.setState({
            loading: false
          });
        }
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
      });
  };

  petsById = (id: String) => {
    let params = {
      petsId: id
    };
    webapi
      .petsById(params)
      .then((data) => {
        const res = data.res;
        if (res.code === Const.SUCCESS_CODE) {
          let petsInfo = res.context.context;
          this.setState({
            petsInfo: petsInfo
          });
        }
      })
      .catch((err) => { });
  };
  addressById = (id: String, type: String) => {
    webapi.addressById(id).then((data) => {
      const { res } = data;
      if (res.code === Const.SUCCESS_CODE) {
        if (type === 'delivery') {
          let info = res.context;
          let deliveryAddressInfo = {
            countryId: info.countryId,
            cityId: info.cityId,
            address1: info.address1,
            address2: info.address2
          };
          setTimeout(() => {
            this.setState(
              {
                deliveryAddressInfo: deliveryAddressInfo
              },
              () => {
                if (this.state.deliveryAddressId === this.state.billingAddressId) {
                  this.setState({
                    billingAddressInfo: deliveryAddressInfo
                  });
                } else {
                  this.addressById(this.state.billingAddressId, 'billing');
                }
              }
            );
          }, 100);
        }
        if (type === 'billing') {
          let info = res.context;
          let billingAddressInfo = {
            countryId: info.countryId,
            cityId: info.cityId,
            address1: info.address1,
            address2: info.address2
          };
          setTimeout(() => {
            this.setState({
              billingAddressInfo: billingAddressInfo
            });
          }, 100);
        }
      }
    });
  };

  getDict = () => {
    if (JSON.parse(sessionStorage.getItem('dict-country'))) {
      let countryArr = JSON.parse(sessionStorage.getItem('dict-country'));
      this.setState({
        countryArr: countryArr
      });
    } else {
      this.querySysDictionary('country');
    }
    if (JSON.parse(sessionStorage.getItem('dict-city'))) {
      let cityArr = JSON.parse(sessionStorage.getItem('dict-city'));
      this.setState({
        cityArr: cityArr
      });
    } else {
      this.querySysDictionary('city');
    }
    this.querySysDictionary('Frequency_day');
    this.querySysDictionary('Frequency_day_club');

    this.querySysDictionary('Frequency_day_individual');
  };
  querySysDictionary = (type: String) => {
    webapi
      .querySysDictionary({
        type: type
      })
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          // Individualization Frequency
          if (type == 'Frequency_day_individual') {
            // Frequency_month_individual
            let frequencyList = [...res.context.sysDictionaryVOS];
            this.setState({
              individualFrequencyList: frequencyList
            });
          }

          if (type === 'country') {
            this.setState({
              countryArr: res.context.sysDictionaryVOS
            });
            sessionStorage.setItem('dict-country', JSON.stringify(res.context.sysDictionaryVOS));
          }
          if (type === 'Frequency_day') {
            let frequencyList = [...res.context.sysDictionaryVOS];
            this.setState(
              {
                frequencyList: frequencyList
              },
              () => this.querySysDictionary('Frequency_week')
            );
          }
          if (type === 'Frequency_day_club') {
            let frequencyClubList = [...res.context.sysDictionaryVOS];
            this.setState(
              {
                frequencyClubList: frequencyClubList
              },
              () => this.querySysDictionary('Frequency_week_club')
            );
          }
          if (type === 'Frequency_week') {
            let frequencyList = [...this.state.frequencyList, ...res.context.sysDictionaryVOS];
            this.setState(
              {
                frequencyList: frequencyList
              },
              () => this.querySysDictionary('Frequency_month')
            );
          }
          if (type === 'Frequency_week_club') {
            let frequencyClubList = [...this.state.frequencyClubList, ...res.context.sysDictionaryVOS];
            this.setState(
              {
                frequencyClubList: frequencyClubList
              },
              () => this.querySysDictionary('Frequency_month_club')
            );
          }
          if (type === 'Frequency_month') {
            let frequencyList = [...this.state.frequencyList, ...res.context.sysDictionaryVOS];
            this.setState({
              frequencyList: frequencyList
            });
          }
          if (type === 'Frequency_month_club') {
            let frequencyClubList = [...this.state.frequencyClubList, ...res.context.sysDictionaryVOS];
            this.setState({
              frequencyClubList: frequencyClubList
            });
          }
          // if (type === 'Frequency') {
          //   this.setState({
          //     frequencyList: res.context.sysDictionaryVOS
          //   });
          // }
        }
      })
      .catch((err) => { });
  };

  getDictValue = (list, id) => {
    if (list && list.length > 0) {
      let item = list.find((item) => {
        return item.id === id;
      });
      if (item) {
        return item.name;
      } else {
        return id;
      }
    } else {
      return id;
    }
  };
  getBySubscribeId = (id: String) => {
    let params = {
      subscribeId: id
    };
    webapi.getBySubscribeId(params).then((data) => {
      const { res } = data;
      if (res.code === Const.SUCCESS_CODE) {
        let operationLog = res.context.subscriptionLogsVOS;
        this.setState({
          operationLog: operationLog
        });
      }
    });
  };
  subTotal = () => {
    const { goodsInfo } = this.state;
    let sum = 0;
    for (let i = 0; i < (goodsInfo ? goodsInfo.length : 0); i++) {
      if (goodsInfo[i].subscribeNum && goodsInfo[i].originalPrice) {
        sum += +goodsInfo[i].subscribeNum * +goodsInfo[i].originalPrice;
      }
    }
    return sum;
  };
  applyPromationCode = (promotionCode?: String) => {
    const { goodsInfo, subscriptionInfo } = this.state;
    let goodsInfoList = [];
    for (let i = 0; i < (goodsInfo ? goodsInfo.length : 0); i++) {
      let goods = {
        goodsInfoId: goodsInfo[i].skuId,
        buyCount: goodsInfo[i].subscribeNum,
        goodsInfoFlag: 1
      };
      goodsInfoList.push(goods);
    }
    let params = {
      goodsInfoList: goodsInfoList,
      promotionCode: promotionCode,
      isAutoSub: true,
      deliveryAddressId: this.state.deliveryAddressId,
      customerAccount: subscriptionInfo.consumerAccount,
    };
    this.setState({ loading: true });
    webapi
      .getPromotionPrice(params)
      .then((data) => {
        const { res } = data;
        if (res.code === Const.SUCCESS_CODE) {
          this.setState({
            deliveryPrice: res.context.deliveryPrice,
            discountsPrice: res.context.discountsPrice,
            promotionCodeShow: res.context.promotionCode,
            promotionDesc: res.context.promotionDesc,
            taxFeePrice: res.context.taxFeePrice ? res.context.taxFeePrice : 0,
            freeShippingFlag: res.context.freeShippingFlag ?? false,
            freeShippingDiscountPrice: res.context.freeShippingDiscountPrice ?? 0,
            subscriptionDiscountPrice: res.context.subscriptionDiscountPrice ?? 0,
            promotionVOList: res.context.promotionVOList ?? [],
            loading: false
          });
        } else {
          this.setState({ loading: false });
        }
      })
      .catch((err) => {
        this.setState({ loading: false });
      });
  };
  handleYearChange = (value) => { };
  tabChange = (key) => { };

  getCurrencySymbol = () => {
    let currencySymbol = sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) ? sessionStorage.getItem(cache.SYSTEM_GET_CONFIG) : '';
    this.setState({
      currencySymbol
    });
  };

  // 设置价格长度
  getSubscriptionPrice = (num: any) => {
    const { subscriptionInfo } = this.state;
    if (num > 0) {
      let nlen = num.toString().split('.')[1]?.length;
      // subscriptionInfo.subscriptionType == 'Individualization' ? nlen = 4 : nlen = 2;
      isNaN(nlen) ? 2 : nlen;
      nlen > 4 ? nlen = 4 : nlen = nlen;
      return num.toFixed(nlen);
    } else {
      return num;
    }
  }

  render() {
    const { title, orderInfo, recentOrderList, subscriptionInfo, goodsInfo, paymentInfo, deliveryAddressInfo, billingAddressInfo, countryArr, operationLog, individualFrequencyList, frequencyList, frequencyClubList, noStartOrder, completedOrder, currencySymbol, isActive } = this.state;
    const cartTitle = (
      <div className="cart-title">
        <span>
          <FormattedMessage id="Subscription.SubscriptionDetails" />
        </span>
        <span className="order-time">{'#' + subscriptionInfo.deliveryTimes}</span>
      </div>
    );
    // const cartExtra = (
    //   <div>
    //     <Popconfirm placement="topRight" title="Are you sure skip next delivery?" onConfirm={() => this.skipNextDelivery(subscriptionInfo.subscriptionNumber)} okText="Confirm" cancelText="Cancel">
    //       <Tooltip placement="top" title="Skip Next Delivery">
    //         <Button type="link" style={{ fontSize: 16 }}>
    //           <FormattedMessage id="Subscription.SkipNextDelivery"/>
    //         </Button>
    //       </Tooltip>
    //     </Popconfirm>
    //     {/* <Popconfirm
    //       placement="topRight"
    //       title="Are you sure order now?"
    //       onConfirm={() => this.orderNow(subscriptionInfo.subscriptionNumber)}
    //       okText="Confirm"
    //       cancelText="Cancel"
    //     >
    //       <Button type="link" style={{ fontSize: 16 }}>
    //         Order Now
    //       </Button>
    //     </Popconfirm> */}
    //   </div>
    // );
    const columns = [
      {
        title: (
          <span className="subscription_product" style={{ color: '#8E8E8E', fontWeight: 500 }}>
            <FormattedMessage id="Subscription.Product" />
          </span>
        ),
        key: 'Product',
        width: '40%',
        render: (text, record) => (
          <div style={{ display: 'flex' }}>
            <img src={record.goodsPic} className="img-item" style={styles.imgItem} alt="" />
            <span style={{ margin: 'auto 10px' }}>{record.goodsName === 'individualization' ? record.petsName + '\'s personalized subscription' : record.goodsName}</span>
          </div>
        )
      },
      {
        title: (
          <span style={{ color: '#8E8E8E', fontWeight: 500 }}>
            <FormattedMessage id="Subscription.Price" />
          </span>
        ),
        key: 'Price',
        width: '15%',
        render: (text, record) => (
          <div>
            {subscriptionInfo.subscriptionType == 'Individualization' ? null : (
              <p style={{ textDecoration: 'line-through' }}>
                {currencySymbol + this.getSubscriptionPrice(record.originalPrice)}
              </p>
            )}
            <p>
              {currencySymbol + ' '}
              {subscriptionInfo.subscriptionType == 'Individualization' ? this.getSubscriptionPrice((+record.subscribeNum * +record.subscribePrice)) : this.getSubscriptionPrice((+record.subscribeNum * +record.subscribePrice))}
              {/* {currencySymbol + this.getSubscriptionPrice(record.subscribePrice)} */}
            </p>
          </div>
        )
      },
      {
        title: (
          <span className="subscription_quantity" style={{ color: '#8E8E8E', fontWeight: 500 }}>
            <FormattedMessage id="Subscription.Quantity" />
          </span>
        ),
        dataIndex: 'subscribeNum',
        key: 'subscribeNum',
        width: '15%',
        render: (text: any) => (
          <>
            {subscriptionInfo.subscriptionType == 'Individualization' ? 1 : (text)}
          </>
        )
      },
      {
        title: (
          <span className="subscription_delivery_frequency" style={{ color: '#8E8E8E', fontWeight: 500 }}>
            <FormattedMessage id="Subscription.DeliveryFrequency" />
          </span>
        ),
        dataIndex: 'frequency',
        key: 'frequency',
        width: '15%',
        render: (text, record) => (
          <div className="subscription_delivery_frequency">

            <Select style={{ width: '70%' }} value={record.periodTypeId} disabled>
              {/* {((record.goodsInfoVO?.promotions ?? record.goodsVO?.promotions) === 'club' ? frequencyClubList : frequencyList).map((item) => (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              ))} */}

              {/* individualFrequencyList */}
              {subscriptionInfo.subscriptionType == 'Individualization' ? (
                individualFrequencyList.map((item: any) => (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                ))
              ) : (
                ((record.goodsInfoVO?.promotions ?? record.goodsVO?.promotions) === 'club' ? frequencyClubList : frequencyList).map((item) => (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                ))
              )}
            </Select>
          </div>
        )
      },
      {
        title: (
          <span style={{ color: '#8E8E8E', fontWeight: 500 }}>
            <FormattedMessage id="Subscription.Total" />
          </span>
        ),
        dataIndex: 'Total',
        key: 'Total',
        width: '15%',
        render: (text, record) => (
          <div>
            <span>{currencySymbol + this.getSubscriptionPrice(+record.subscribeNum * +record.subscribePrice)}</span>
          </div>
        )
      }
    ];

    const operatorColumns = [
      {
        title: RCi18n({ id: 'Order.OperatorType' }),
        dataIndex: 'operatorType',
        key: 'operatorType'
      },
      {
        title: RCi18n({ id: 'Order.Operator' }),
        dataIndex: 'operator',
        key: 'operator'
      },
      {
        title: RCi18n({ id: 'Order.Time' }),
        dataIndex: 'time',
        key: 'time',
        render: (time: any) => time && moment(time).format(Const.TIME_FORMAT).toString()
      },
      {
        title: RCi18n({
          id: 'Order.OperationCategory'
        }),
        dataIndex: 'operationCategory',
        key: 'operationCategory'
      },
      {
        title: RCi18n({
          id: 'Order.OperationLog'
        }),
        dataIndex: 'operationLog',
        key: 'operationLog',
        width: '50%',
        render: (text: any, record: any) => (
          <div>
            {text}
          </div>
        )
      }
    ];

    // 翻译title
    operatorColumns.forEach((obj) => {
      (obj.title as any) = <FormattedMessage id={`Order.${obj.title}`} />;
    });

    const columns_completed = [
      {
        title: (
          <span style={{ color: '#8E8E8E', fontWeight: 500 }}>
            <FormattedMessage id="Subscription.Product" />
          </span>
        ),
        key: 'Product',
        width: '30%',
        render: (text, record) => (
          <div>
            {record.tradeItems &&
              record.tradeItems.map((item, index) => (
                <div style={{ display: 'flex' }} key={index}>
                  <img src={item.pic} style={styles.imgItem} className="img-item" alt="" />
                  <div style={{ margin: 'auto 10px' }}>
                    <p>{item.skuName === 'individualization' ? item.petsName + '\'s personalized subscription' : item.skuName}</p>
                    <p>{item.specDetails}</p>
                  </div>
                </div>
              ))}
          </div>
        )
      },
      {
        title: (
          <span className="subscription_quantity2" style={{ color: '#8E8E8E', fontWeight: 500 }}>
            <FormattedMessage id="Subscription.Quantity" />
          </span>
        ),
        key: 'subscribeNum',
        width: '10%',
        render: (text, record) => (
          <div>
            {subscriptionInfo.subscriptionType == 'Individualization' ? 1 : (
              record.tradeItems &&
              record.tradeItems.map((item, index) => (
                <div style={{ height: 80 }} key={index}>
                  <p style={{ paddingTop: 30 }}>X {item.num}</p>
                </div>
              ))
            )}
          </div>
        )
      },
      {
        title: (
          <span style={{ color: '#8E8E8E', fontWeight: 500 }}>
            <FormattedMessage id="Subscription.EnjoyDiscount" />
          </span>
        ),
        key: 'discount',
        width: '10%',
        render: (text, record) => <div style={{ color: '#e2001a' }}>{record.tradePrice && record.tradePrice.discountsPrice ? currencySymbol + ' ' + '-' + record.tradePrice.discountsPrice : '-'}</div>
      },
      {
        title: (
          <span style={{ fontWeight: 500 }}>
            <FormattedMessage id="Subscription.Amount" />
          </span>
        ),
        key: 'amount',
        width: '10%',
        render: (text, record) => <div>{record.tradePrice && record.tradePrice.totalPrice ? currencySymbol + ' ' + record.tradePrice.totalPrice : '-'}</div>
      },
      {
        title: (
          <span style={{ color: '#8E8E8E', fontWeight: 500 }}>
            <FormattedMessage id="order.orderId" />
          </span>
        ),
        key: 'id',
        width: '10%',
        dataIndex: 'id',
      },
      {
        title: (
          <span style={{ color: '#8E8E8E', fontWeight: 500 }}>
            <FormattedMessage id="Order.OrderTime" />
          </span>
        ),
        key: 'shipmentDate',
        dataIndex: 'shipmentDate',
        width: '10%',
        render: (text, record) => <div>{record.tradeState && record.tradeState.createTime ? moment(record.tradeState.createTime).format('YYYY-MM-DD') : '-'}</div>
      },
      {
        title: (
          <span style={{ color: '#8E8E8E', fontWeight: 500 }}>
            <FormattedMessage id="Subscription.OrderStatus" />
          </span>
        ),
        key: 'shipmentStatus',
        dataIndex: 'shipmentStatus',
        width: '10%',
        render: (text, record) => (
          <div>
            {!record.id ? (
              'Autoship skiped'
            ) : record.tradeState && record.tradeState.flowState ? (
              <FormattedMessage id={getOrderStatusValue('OrderStatus', record.tradeState.flowState)} />
            ) : (
              // deliverStatus(record.tradeItems[0].deliverStatus)
              '-'
            )}
          </div>
        )
      },
      {
        title: <FormattedMessage id="Subscription.Operation" />,
        dataIndex: '',
        key: 'x',
        width: '10%',
        render: (text, record) => (
          <>
            {record.id ? (
              <Link to={'/order-detail/' + record.id}>
                <Tooltip placement="top" title={<FormattedMessage id="Subscription.Detail" />}>
                  <a style={styles.edit} className="iconfont iconDetails"></a>
                </Tooltip>
              </Link>
            ) : null}
          </>
        )
      }
    ];

    const columns_foodDispenser_no_start = [
      {
        title: <FormattedMessage id="Subscription.noStar.DeliveryDate" />,
        key: 'shipmentDate',
        dataIndex: 'shipmentDate',
        render: (text, record) => <div>{record.tradeItems && record.tradeItems.length > 0 && record.tradeItems[0]['nextDeliveryTime'] ? moment(record.tradeItems[0]['nextDeliveryTime']).format('YYYY-MM-DD') : '-'}</div>
      },
      {
        title: <FormattedMessage id="Subscription.noStar.Product" />,
        key: 'Product',
        render: (text, record) => (
          <div>
            {record.tradeItems &&
              record.tradeItems.map((item, index) => (
                <div style={{ display: 'flex' }} key={index}>
                  <img src={item.pic} style={{ width: 60, height: 80 }} alt="" />
                  <div style={{ margin: 'auto 10px' }}>
                    <p>{item.skuName === 'individualization' ? item.petsName + '\'s personalized subscription' : item.skuName}</p>
                    <p>{item.specDetails}</p>
                  </div>
                </div>
              ))}
          </div>
        )
      },
      {
        title: ' ' // cover last th text align right
      }
    ];

    const styles = {
      backItem: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: 10,
        marginBottom: 20
      }
    } as any;

    const storeId = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA) || '{}').storeId || '';

    return (
      <div>
        <Breadcrumb>
          <Breadcrumb.Item>
            <a href="/subscription-list">
              <FormattedMessage id="Subscription.Subscription" />
            </a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a href="/subscription-list">
              <FormattedMessage id="Subscription.SubscriptionList" />
            </a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{<FormattedMessage id="Subscription.detail" />}</Breadcrumb.Item>
        </Breadcrumb>
        <Spin spinning={this.state.loading}>
          {' '}
          <div className="container-search">
            <Headline title={<FormattedMessage id="Subscription.detail" />} />
            <Row className="subscription-basic-info">
              <Col span={24}>
                <span style={{ fontSize: '16px', color: '#3DB014' }}>{subscriptionInfo.subscriptionStatus}</span>
              </Col>
              <Col span={11} className="basic-info">
                <p>
                  <FormattedMessage id="Subscription.SubscriptionNumber" /> : <span>{subscriptionInfo.subscriptionNumber}</span>
                </p>
                <p>
                  <FormattedMessage id="Subscription.SubscriptionDate" /> :<span>{moment(new Date(subscriptionInfo.subscriptionTime)).format('YYYY-MM-DD HH:mm:ss')}</span>
                </p>
                <p>
                  <FormattedMessage id="Subscription.AuditorID" /> : <span>{subscriptionInfo.presciberID}</span>
                </p>
                <p>
                  <FormattedMessage id="Subscription.AuditorName" /> : <span>{subscriptionInfo.presciberName}</span>
                </p>
                <p>
                  <FormattedMessage id="Order.subscriptionType" /> : <span>{subscriptionInfo.subscriptionType}</span>
                </p>
                <p>
                  <FormattedMessage id="Order.subscriptionPlanType" /> : <span>{subscriptionInfo.subscriptionPlanType}</span>
                </p>
              </Col>
              <Col span={11} className="basic-info">
                <p>
                  <FormattedMessage id="Subscription.PetOwnerName" /> : <span>{subscriptionInfo.consumer}</span>
                </p>
                <p>
                  <FormattedMessage id="Subscription.ConsumerAccount" /> : <span>{subscriptionInfo.consumerAccount}</span>
                </p>
                <p>
                  <FormattedMessage id="Subscription.ConsumerType" /> : <span>{subscriptionInfo.consumerType}</span>
                </p>
                <p>
                  <FormattedMessage id="Subscription.PhoneNumber" /> : <span>{subscriptionInfo.phoneNumber}</span>
                </p>
              </Col>
            </Row>
            {/* subscription 和 total */}
            <Row style={{ marginTop: 20 }} gutter={16}>
              <Col span={24}>
                <Table rowKey={(record, index) => index.toString()} columns={columns} dataSource={goodsInfo} pagination={false}></Table>
              </Col>

              <Col span={8} offset={16}>
                <div className="flex-between">
                  <span>
                    <FormattedMessage id="Subscription.Subtotal" />
                  </span>
                  <span style={styles.priceStyle}>{currencySymbol + this.getSubscriptionPrice(this.subTotal())}</span>
                </div>

                <div className="flex-between">
                  {/* <span>{this.state.promotionDesc ? this.state.promotionDesc : 'Promotion'}</span> */}
                  <span>
                    <FormattedMessage id="Order.subscriptionDiscount" />
                  </span>
                  <span style={styles.priceStyle}>{currencySymbol + '  -' + this.getSubscriptionPrice(this.state.subscriptionDiscountPrice ? this.state.subscriptionDiscountPrice : 0)}</span>
                </div>

                {this.state.promotionVOList.map((pvo, idx) => (
                  <div key={idx} className="flex-between">
                    <span>{pvo.marketingName}</span>
                    <span style={styles.priceStyle}>{currencySymbol + ' -' + this.getSubscriptionPrice(pvo.discountPrice ? pvo.discountPrice : 0)}</span>
                  </div>
                ))}

                <div className="flex-between">
                  <span>
                    <FormattedMessage id="Subscription.Shipping" />
                  </span>
                  <span style={styles.priceStyle}>{currencySymbol + this.getSubscriptionPrice(this.state.deliveryPrice ? this.state.deliveryPrice : 0)}</span>
                </div>
                {this.state.freeShippingFlag && <div className="flex-between">
                  <span><FormattedMessage id="Order.shippingFeesDiscount" /></span>
                  <span style={styles.priceStyle}>{currencySymbol + ' -' + this.getSubscriptionPrice(this.state.freeShippingDiscountPrice ? this.state.freeShippingDiscountPrice : 0)}</span>
                </div>}
                {+sessionStorage.getItem(cache.TAX_SWITCH) === 1 ? (
                  <div className="flex-between">
                    <span>
                      <FormattedMessage id="Subscription.Tax" />
                    </span>
                    <span style={styles.priceStyle}>{currencySymbol + this.getSubscriptionPrice(this.state.taxFeePrice ? this.state.taxFeePrice : 0)}</span>
                  </div>
                ) : null}

                <div className="flex-between">
                  <span>
                    <span>
                      <FormattedMessage id="Subscription.Total" />
                    </span>{' '}
                    (<FormattedMessage id="Subscription.IVAInclude" />
                    ):
                  </span>
                  <span style={styles.priceStyle}>{currencySymbol + this.getSubscriptionPrice(this.subTotal() - +this.state.discountsPrice + +this.state.deliveryPrice + +this.state.taxFeePrice - +this.state.freeShippingDiscountPrice)}</span>
                </div>
              </Col>
            </Row>
            <Row className="consumer-info" style={{ marginTop: 20 }}>
              <Col span={8}>
                <Row>
                  <Col span={12}>
                    <label className="info-title">
                      <FormattedMessage id="Subscription.DeliveryAddress" />
                    </label>
                  </Col>

                  <Col span={24}>
                    <p style={{ width: 140 }}>
                      <FormattedMessage id="Subscription.Name" />:{' '}
                    </p>
                    <p>{deliveryAddressInfo ? deliveryAddressInfo.firstName + ' ' + deliveryAddressInfo.lastName : ''}</p>
                  </Col>
                  <Col span={24}>
                    <p style={{ width: 140 }}>
                      <FormattedMessage id="Subscription.City" />:{' '}
                    </p>
                    <p>{deliveryAddressInfo.city}</p>
                  </Col>
                  {deliveryAddressInfo.province ? (
                    <Col span={24}>
                      <p style={{ width: 140 }}>
                        <FormattedMessage id="Subscription.State" />:{' '}
                      </p>
                      <p>{deliveryAddressInfo.province}</p>
                    </Col>
                  ) : null}

                  <Col span={24}>
                    <p style={{ width: 140 }}>
                      <FormattedMessage id="Subscription.Country" />:{' '}
                    </p>
                    <p>{this.getDictValue(countryArr, deliveryAddressInfo.countryId)}</p>
                  </Col>
                  <Col span={24}>
                    <p style={{ width: 140 }}>
                      <FormattedMessage id="Subscription.Address1" />:{' '}
                    </p>
                    <p>{deliveryAddressInfo ? deliveryAddressInfo.address1 : ''}</p>
                  </Col>
                </Row>
                <Col span={24}>
                  <p style={{ width: 140 }}>
                    <FormattedMessage id="Subscription.Address2" />:{' '}
                  </p>
                  <p>{deliveryAddressInfo ? deliveryAddressInfo.address2 : ''}</p>
                </Col>
              </Col>
              <Col span={8}>
                {storeId === 123457907 || storeId === 123457910 ? null : (
                  <Row>
                    <Col span={12}>
                      <label className="info-title">
                        <FormattedMessage id="Subscription.BillingAddress" />
                      </label>
                    </Col>

                    <Col span={24}>
                      <p style={{ width: 140 }}>
                        <FormattedMessage id="Subscription.Name" />:{' '}
                      </p>
                      <p>{billingAddressInfo ? billingAddressInfo.firstName + ' ' + billingAddressInfo.lastName : ''}</p>
                    </Col>
                    <Col span={24}>
                      <p style={{ width: 140 }}>
                        <FormattedMessage id="Subscription.City" />:{' '}
                      </p>
                      <p>{billingAddressInfo.city}</p>
                    </Col>
                    {billingAddressInfo.province ? (
                      <Col span={24}>
                        <p style={{ width: 140 }}>
                          <FormattedMessage id="Subscription.State" />:{' '}
                        </p>
                        <p>{billingAddressInfo.province}</p>
                      </Col>
                    ) : null}

                    <Col span={24}>
                      <p style={{ width: 140 }}>
                        <FormattedMessage id="Subscription.Country" />:{' '}
                      </p>
                      <p>{this.getDictValue(countryArr, billingAddressInfo.countryId)}</p>
                    </Col>

                    <Col span={24}>
                      <p style={{ width: 140 }}>
                        <FormattedMessage id="Subscription.Address1" />:{' '}
                      </p>
                      <p>{billingAddressInfo ? billingAddressInfo.address1 : ''}</p>
                    </Col>

                    <Col span={24}>
                      <p style={{ width: 140 }}>
                        <FormattedMessage id="Subscription.Address2" />:{' '}
                      </p>
                      <p>{billingAddressInfo ? billingAddressInfo.address2 : ''}</p>
                    </Col>
                  </Row>
                )}
              </Col>
              <Col span={8}>
                <Row>
                  <Col span={24}>
                    <label className="info-title">
                      <FormattedMessage id="Subscription.PaymentMethod" />
                    </label>
                  </Col>

                  {paymentInfo ?
                    <>
                      <Col span={24}>
                        <p style={{ width: 140 }}>
                          <FormattedMessage id="Subscription.PaymentMethod" />:{' '}
                        </p>
                        <p>{paymentInfo && paymentInfo.paymentVendor ? paymentInfo.paymentVendor : ''}</p>
                      </Col>
                      <Col span={24}>
                        <p style={{ width: 140 }}>
                          <FormattedMessage id="Subscription.CardNumber" />:{' '}
                        </p>
                        <p>{paymentInfo && paymentInfo.lastFourDigits ? '**** **** **** ' + paymentInfo.lastFourDigits : ''}</p>
                      </Col>
                    </>
                    :
                    <Col span={24}>
                      <p style={{ width: 140 }}><FormattedMessage id="Subscription.PaymentMethod" />: </p>
                      <p><FormattedMessage id="Subscription.CashOnDelivery" /></p>
                    </Col>}

                </Row>
              </Col>
            </Row>
          </div>
          <div className="container-search" style={{paddingBottom:40}}>
            <Headline
              title={<FormattedMessage id="Subscription.AutoshipOrder" />}
            // extra={
            //   <div>
            //     <Select defaultValue="2020" style={{ width: 150 }} onChange={this.handleYearChange}>
            //       <Option value="2020">2020</Option>
            //       <Option value="2019">2019</Option>
            //       <Option value="2018">2018</Option>
            //     </Select>
            //   </div>
            // }
            />
            <Tabs defaultActiveKey="1" onChange={this.tabChange}>
              <TabPane tab={<FormattedMessage id="Subscription.NoStart" />} key="noStart">
                <Table rowKey={(record, index) => index.toString()} columns={columns_foodDispenser_no_start} dataSource={noStartOrder} pagination={false}></Table>
              </TabPane>
              <TabPane tab={<FormattedMessage id="Subscription.Completed" />} key="completed">
                <Table
                  rowKey={(record, index) => index.toString()}
                  rowClassName={(record, index) => {
                    let className = 'normal-row';
                    if (!record.id) className = 'disable-row';
                    return className;
                  }}
                  columns={columns_completed}
                  dataSource={completedOrder}
                  pagination={false}
                ></Table>
              </TabPane>
            </Tabs>
            <Row style={styles.backItem}>
              <Collapse>
                <Panel header={<FormattedMessage id="Subscription.operationLog" />} key="1" style={{ paddingRight: 10 }}>
                  <Row>
                    <Col span={24}>
                      <Table rowKey={(record, index) => index.toString()} columns={operatorColumns} dataSource={operationLog} bordered pagination={false} />
                    </Col>
                  </Row>
                </Panel>
              </Collapse>
            </Row>
          </div>
          <AuthWrapper functionName="f_subscription_feedback">
            {this.state.subscriptionId ? <FeedBack subscriptionId={this.state.subscriptionId} /> : null}
          </AuthWrapper>
        </Spin>
        <div className="bar-button">
          {/* {isActive ? <Button type="primary" style={{ marginRight: 10 }}>
            <Link to={'/subscription-edit/' + this.state.subscriptionId}>
              {<FormattedMessage id="Subscription.Edit" />}
            </Link>
          </Button> : null
          } */}

          <Button onClick={() => (history as any).go(-1)}>{<FormattedMessage id="Subscription.back" />}</Button>
        </div>
      </div>
    );
  }
}
export default injectIntl(SubscriptionDetail);
const styles = {
  priceStyle: {
    marginRight: 15
  },
  edit: {
    paddingRight: 10
  },
  imgItem: {
    width: 60,
    height: 60,
    padding: 5,
    border: '1px solid #ddd',
    float: 'left',
    marginRight: 10,
    background: '#fff',
    borderRadius: 3
  }
};
