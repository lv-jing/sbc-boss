import React from 'react';
import { Link } from 'react-router-dom';
import { Pagination, Spin, Row, Col, Empty } from 'antd';
import { FormattedMessage } from 'react-intl';
import { getSubscriptionList } from '../../subscription/webapi';
import moment from 'moment';
import { Const, RCi18n } from 'qmkit';
const defaultImg = require('../../goods-list/img/none.png');

interface Iprop {
  startDate: string;
  endDate: string;
  customerAccount: string;
}

interface Istyle {
  [key: string]: React.CSSProperties;
}

export default class SubscribInformation extends React.Component<Iprop, any> {
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
    this.getSubscriptionList();
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.startDate !== prevProps.startDate ||
      this.props.endDate !== prevProps.endDate
    ) {
      this.getSubscriptionList();
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
      () => this.getSubscriptionList()
    );
  };

  getSubscriptionList = () => {
    const { pagination } = this.state;
    const { customerAccount, startDate, endDate } = this.props;
    this.setState({
      loading: true
    });
    getSubscriptionList({
      startTime: startDate,
      endTime: endDate,
      customerAccount,
      pageNum: pagination.current - 1,
      pageSize: pagination.pageSize
    })
      .then((data) => {
        this.setState({
          loading: false,
          orderList: data.res.context.subscriptionResponses,
          pagination: {
            ...pagination,
            total: data.res.context.total
          }
        });
      })
      .catch(() => {
        this.setState({
          loading: false
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
                        to={'/subscription-detail/' + item.subscribeId}
                        style={styles.orderId}
                      >
                        {item.subscribeId}
                      </Link>
                      <span style={styles.orderTime}>
                        <FormattedMessage id="PetOwner.SubscriptionTime" />:{' '}
                        {moment(item.createTime).format(Const.TIME_FORMAT)}
                      </span>
                    </div>
                  </td>
                </tr>
              </thead>
              <tbody>
                {item.goodsInfo && item.goodsInfo.length ? (
                  item.goodsInfo.map((v, k) => (
                    <>
                      <tr key={k}>
                        <td style={{ width: '30%' }}>
                          <img
                            src={v.goodsPic ? v.goodsPic : defaultImg}
                            className="img-item"
                          />
                        </td>
                        <td style={{ width: '15%' }}>
                          {item.subscriptionType === 'Individualization'
                            ? "Your pet's personalized subscription"
                            : v.goodsName}
                        </td>
                        {k === 0 && (
                          <>
                            <td
                              rowSpan={item.goodsInfo.length}
                              style={{ width: '10%' }}
                            >
                              {item.subscriptionType}
                            </td>
                            <td
                              rowSpan={item.goodsInfo.length}
                              style={{ width: '25%' }}
                            >
                              {item.petsInfo && item.petsInfo.petsId
                                ? item.petsInfo.petsId
                                : ''}
                            </td>
                            <td
                              rowSpan={item.goodsInfo.length}
                              style={{ width: '10%' }}
                            >
                              {item.petsInfo && item.petsInfo.petsName
                                ? item.petsInfo.petsName
                                : ''}
                            </td>
                            <td
                              rowSpan={item.goodsInfo.length}
                              style={{ width: '10%' }}
                            >
                              {item.subscribeStatus === '0'
                                ? RCi18n({ id: 'Subscription.Active' })
                                : item.subscribeStatus === '1'
                                ? RCi18n({ id: 'Subscription.Pause' })
                                : RCi18n({ id: 'Subscription.Inactive' })}
                            </td>
                          </>
                        )}
                      </tr>
                    </>
                  ))
                ) : (
                  <tr>
                    <td style={{ width: '30%' }}></td>
                    <td style={{ width: '15%' }}></td>
                    <td style={{ width: '10%' }}>{item.subscriptionType}</td>
                    <td style={{ width: '25%' }}>
                      {item.petsInfo && item.petsInfo.petsId
                        ? item.petsInfo.petsId
                        : ''}
                    </td>
                    <td style={{ width: '10%' }}>
                      {item.petsInfo && item.petsInfo.petsName
                        ? item.petsInfo.petsName
                        : ''}
                    </td>
                    <td style={{ width: '10%' }}>
                      {item.subscribeStatus === '0'
                        ? RCi18n({ id: 'Subscription.Active' })
                        : item.subscribeStatus === '1'
                        ? RCi18n({ id: 'Subscription.Pause' })
                        : RCi18n({ id: 'Subscription.Inactive' })}
                    </td>
                  </tr>
                )}
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
                      <th style={{ width: '30%' }}>
                        <FormattedMessage id="PetOwner.Product" />
                      </th>
                      <th style={{ width: '15%' }}>
                        <FormattedMessage id="PetOwner.ProductName" />
                      </th>
                      <th style={{ width: '10%' }}>
                        <FormattedMessage id="PetOwner.subscriptionType" />
                      </th>
                      <th style={{ width: '25%' }}>
                        <FormattedMessage id="PetOwner.petID" />
                      </th>
                      <th style={{ width: '10%' }}>
                        <FormattedMessage id="PetOwner.PetName" />
                      </th>
                      <th style={{ width: '10%', textAlign: 'left' }}>
                        <FormattedMessage id="PetOwner.SubscriptionStatus" />
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
    width: '50%'
  },
  orderTime: {
    display: 'inline-block',
    width: '50%',
    fontSize: 14,
    textAlign: 'right',
    color: '#999'
  }
};
