import React from 'react';
import { Pagination, Spin, Empty } from 'antd';
import { FormattedMessage } from 'react-intl';
import { fetchOrderList } from '../../order-list/webapi';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Const, cache, getOrderStatusValue, RCi18n } from 'qmkit';
const defaultImg = require('../../goods-list/img/none.png');

interface Iprop {
  startDate: string;
  endDate: string;
  customerId: string;
}

interface Istyle {
  [key: string]: React.CSSProperties;
}

export default class OrderInformation extends React.Component<Iprop, any> {
  constructor(props: Iprop) {
    super(props);
    this.state = {
      loading: false,
      orderList: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      }
    };
  }

  componentDidMount() {
    this.getOrderList();
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.startDate !== prevProps.startDate ||
      this.props.endDate !== prevProps.endDate
    ) {
      this.getOrderList();
    }
  }

  onPageChange = (page) => {
    const { pagination } = this.state;
    this.setState(
      {
        pagination: {
          ...pagination,
          current: page
        }
      },
      () => this.getOrderList()
    );
  };

  getOrderList = () => {
    const { startDate, endDate, customerId } = this.props;
    const { pagination } = this.state;
    this.setState({ loading: true });
    fetchOrderList({
      orderType: 'ALL_ORDER',
      buyerId: customerId,
      beginTime: startDate,
      endTime: endDate,
      pageNum: pagination.current - 1,
      pageSize: pagination.pageSize
    })
      .then((data) => {
        this.setState({
          loading: false,
          orderList: data.res.context.content,
          pagination: {
            ...pagination,
            total: data.res.context.total
          }
        });
      })
      .catch(() => {
        this.setState({
          loading: false,
          orderList: []
        });
      });
  };

  _renderLoading = () => {
    return (
      <tr style={styles.loading}>
        <td colSpan={7}>
          <Spin />
        </td>
      </tr>
    );
  };

  _renderContent = (dataList) => {
    return dataList.map((item, idx) => {
      const imgList = (item.tradeItems || []).concat(item.gifts || []);
      const tradePrice = item.tradePrice.totalPrice || 0;
      const num = imgList.reduce(
        (prev: number, curr: any) => prev + curr.num,
        0
      );
      return (
        <tr className="ant-table-row  ant-table-row-level-0" key={idx}>
          <td colSpan={7} style={{ padding: 0 }}>
            <table
              className="ant-table-self"
              style={{ border: '1px solid #ddd' }}
            >
              <thead>
                <tr>
                  <td colSpan={7}>
                    <div style={styles.orderCon}>
                      <Link
                        to={`/order-detail/${item.id}`}
                        style={styles.orderId}
                      >
                        {item.id}
                      </Link>
                      {item.isAutoSub && (
                        <span key="2" style={styles.orderNo}>
                          <span style={styles.platform}>S</span>
                          {(item.subIdList || []).join(',')}
                        </span>
                      )}
                      <span key="3" style={styles.orderTime}>
                        <FormattedMessage id="Order.OrderTime" />:{' '}
                        {moment(item.tradeState.createTime).format(
                          Const.TIME_FORMAT
                        )}
                      </span>
                    </div>
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td key="1" style={{ width: '30%' }}>
                    <div
                      style={{
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'flex-end',
                        flexWrap: 'wrap',
                        padding: '16px 0'
                      }}
                    >
                      {/*商品图片*/}
                      {imgList.map((v: any, k: number) =>
                        k < 4 ? (
                          <img
                            src={v.pic ? v.pic : defaultImg}
                            className="img-item"
                            key={k}
                          />
                        ) : null
                      )}
                      {
                        /*最后一张特殊处理*/
                        //@ts-ignore
                        imgList.length > 4 ? (
                          <div style={styles.imgBg}>
                            <img
                              //@ts-ignore
                              src={
                                imgList[3]['pic']
                                  ? imgList[3]['pic']
                                  : defaultImg
                              }
                              style={styles.imgFourth}
                            />
                            //@ts-ignore
                            <div style={styles.imgNum}>
                              <FormattedMessage id="total" /> {imgList.length}
                              <FormattedMessage id="items" />
                            </div>
                          </div>
                        ) : null
                      }
                    </div>
                  </td>
                  <td key="2" style={{ width: '10%' }}>
                    {item.consignee ? item.consignee.name : ''}
                  </td>
                  <td key="3" style={{ width: '10%' }}>
                    {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}{' '}
                    {tradePrice.toFixed(2)}
                  </td>
                  <td key="4" style={{ width: '10%' }}>
                    {num}
                  </td>
                  <td key="5" style={{ width: '20%' }}>
                    {item.buyer ? item.buyer.name : ''}
                  </td>
                  <td key="6" style={{ width: '10%' }}>
                    <FormattedMessage
                      id={getOrderStatusValue(
                        'ShippStatus',
                        item.tradeState.deliverStatus
                      )}
                    />
                  </td>
                  <td key="7" style={{ width: '10%' }}>
                    <FormattedMessage
                      id={getOrderStatusValue(
                        'OrderStatus',
                        item.tradeState.flowState
                      )}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      );
    });
  };

  render() {
    const { loading, pagination, orderList } = this.state;

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
                      <th key="1" style={{ width: '30%' }}>
                        {RCi18n({ id: 'PetOwner.Product' })}
                      </th>
                      <th key="2" style={{ width: '10%' }}>
                        {RCi18n({ id: 'PetOwner.Recipient' })}
                      </th>
                      <th key="3" style={{ width: '10%' }}>
                        {RCi18n({ id: 'PetOwner.Amount' })}
                      </th>
                      <th key="4" style={{ width: '10%' }}>
                        {RCi18n({ id: 'PetOwner.Quantity' })}
                      </th>
                      <th key="5" style={{ width: '20%' }}>
                        {RCi18n({ id: 'PetOwner.PrescriberName' })}
                      </th>
                      <th key="6" style={{ width: '10%' }}>
                        {RCi18n({ id: 'PetOwner.ShippingStatus' })}
                      </th>
                      <th key="7" style={{ width: '10%' }}>
                        {RCi18n({ id: 'PetOwner.OrderStatus' })}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="ant-table-tbody">
                    {loading
                      ? this._renderLoading()
                      : this._renderContent(orderList)}
                  </tbody>
                </table>
              </div>
              {!loading && pagination.total === 0 ? (
                <div className="ant-table-placeholder">
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                </div>
              ) : null}
            </div>
          </div>
          {pagination.total > 0 ? (
            <Pagination
              current={pagination.current}
              total={pagination.total}
              pageSize={pagination.pageSize}
              onChange={this.onPageChange}
            />
          ) : null}
        </div>
      </div>
    );
  }
}

const styles: Istyle = {
  loading: {
    textAlign: 'center',
    height: 300
  },
  orderCon: {
    fontSize: 0,
    padding: '10px 20px'
  },
  orderId: {
    display: 'inline-block',
    fontSize: 14,
    width: '15%'
  },
  orderNo: {
    display: 'inline-block',
    width: '60%',
    fontSize: 14,
    color: '#666'
  },
  orderTime: {
    display: 'inline-block',
    width: '25%',
    fontSize: 14,
    textAlign: 'right',
    color: '#999'
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
    borderRadius: 3,
    fontSize: 9,
    color: '#fff'
  },
  platform: {
    fontSize: 12,
    padding: '1px 3px',
    display: 'inline-block',
    marginLeft: 5,
    border: ' 1px solid var(--primary-color)',
    color: 'var(--primary-color)',
    borderRadius: 5
  }
};
