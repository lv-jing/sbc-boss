import React from 'react';

import { Col, message, Row } from 'antd';
import { AuthWrapper, Headline, history, BreadCrumb } from 'qmkit';
import { StoreProvider } from 'plume2';
import AppStore from './store';

const images = {
  new_01: require('./imgs/new/01.png'),
  new_02: require('./imgs/new/02.png'),
  new_03: require('./imgs/new/03.png'),
  new_04: require('./imgs/new/04.png'),
  order_01: require('./imgs/order/01.png'),
  order_02: require('./imgs/order/02.png'),
  order_03: require('./imgs/order/03.png'),
  order_04: require('./imgs/order/04.png'),
  order_05: require('./imgs/order/05.png'),
  full_01: require('./imgs/full/01.png'),
  full_02: require('./imgs/full/02.png'),
  full_03: require('./imgs/full/03.png'),
  customer_01: require('./imgs/customer/grow2.png'),
  customer_02: require('./imgs/customer/level2.png'),
  customer_03: require('./imgs/customer/equities2.png'),
  customer_04: require('./imgs/customer/04.png'),
  customer_05: require('./imgs/customer/point2.png'),
  customer_06: require('./imgs/customer/points2.png'),
  customer_07: require('./imgs/customer/07.png'),
  sms: require('./imgs/sms/sms2.png'),
  crm: require('./imgs/crm/crm2.png'),
  apppush: require('./imgs/sms/app-push.png'),
  message: require('./imgs/sms/message.png')
};

@StoreProvider(AppStore, { debug: __DEV__ })
export default class LogisticsManage extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.checkIEP().then((res) =>
      this.setState({
        IEPEnable: res
      })
    );
  }

  constructor(props) {
    super(props);
    this.state = {
      IEPEnable: false
    };
  }

  render() {
    return (
      <div>
        <BreadCrumb />
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>营销</Breadcrumb.Item>
          <Breadcrumb.Item>平台营销管理</Breadcrumb.Item>
          <Breadcrumb.Item>营销中心</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className="container">
          <Headline title="应用中心" />
          <div className="appsMain">
            <h3>
              获客拉新<span>全渠道新用户</span>
            </h3>
            <Row>
              <Col span={6}>
                <a
                  className="createMarket"
                  onClick={() => history.push('/mini-interface')}
                >
                  <span className="left">
                    <img src={images.new_01} />
                  </span>
                  <div className="info">
                    <h5>小程序</h5>
                    <p>开启小程序，拓展推广路径</p>
                  </div>
                </a>
              </Col>

              <Col span={6}>
                <a
                  className="createMarket"
                  onClick={() => {
                    history.push('/groupon-setting');
                  }}
                >
                  <span className="left">
                    <img src={images.new_02} />
                  </span>
                  <div className="info">
                    <h5>拼团</h5>
                    <p>裂变传播拉新，邀请好友一起购买</p>
                  </div>
                </a>
              </Col>

              <Col span={6}>
                <a
                  className="createMarket"
                  onClick={() => history.push('/distribution-setting')}
                >
                  <span className="left">
                    <img src={images.new_03} />
                  </span>
                  <div className="info">
                    <h5>社交分销</h5>
                    <span className="miniTags">推荐</span>
                    <p>招募分销员，让分销员帮你卖货</p>
                  </div>
                </a>
              </Col>
            </Row>

            <h3>
              下单转化<span>更多订单和销量</span>
            </h3>
            <Row>
              <AuthWrapper functionName={'f_create_coupon'}>
                <Col span={6}>
                  <a
                    className="createMarket"
                    onClick={() =>
                      history.push({
                        pathname: 'coupon-add',
                        state: {
                          couponType: '0',
                          source: 'marketCenter'
                        }
                      })
                    }
                  >
                    <span className="left">
                      <img src={images.order_01} />
                    </span>
                    <div className="info">
                      <h5>优惠券</h5>
                      <span className="miniTags">推荐</span>
                      <p>优惠券抵扣，购物更优惠</p>
                    </div>
                  </a>
                </Col>
              </AuthWrapper>

              <AuthWrapper functionName={'f_create_all_coupon_activity'}>
                <Col span={6}>
                  <a
                    className="createMarket"
                    onClick={() =>
                      history.push({
                        pathname: 'coupon-activity-registered',
                        state: {
                          source: 'marketCenter'
                        }
                      })
                    }
                  >
                    <span className="left">
                      <img src={images.order_02} />
                    </span>
                    <div className="info">
                      <h5>注册赠券</h5>
                      <span className="miniTags">推荐</span>
                      <p>新人注册获得券礼包，提升转化</p>
                    </div>
                  </a>
                </Col>

                {this.state.IEPEnable && (
                  <Col span={6}>
                    <a
                      className="createMarket"
                      onClick={() =>
                        history.push({
                          pathname: 'coupon-activity-registered-qyg',
                          state: {
                            source: 'marketCenter'
                          }
                        })
                      }
                    >
                      <span className="left">
                        <img src={images.order_02} />
                      </span>
                      <div className="info">
                        <h5>企业注册赠券</h5>
                        <p>企业会员注册获得专属券礼包</p>
                      </div>
                    </a>
                  </Col>
                )}

                <Col span={6}>
                  <a
                    className="createMarket"
                    onClick={() =>
                      history.push({
                        pathname: 'coupon-activity-all-present',
                        state: {
                          source: 'marketCenter'
                        }
                      })
                    }
                  >
                    <span className="left">
                      <img src={images.order_03} />
                    </span>
                    <div className="info">
                      <h5>全场赠券</h5>
                      <p>全场发券活动，领券中心全员领券</p>
                    </div>
                  </a>
                </Col>

                <Col span={6}>
                  <a
                    className="createMarket"
                    onClick={() =>
                      history.push({
                        pathname: 'coupon-activity-specify',
                        state: {
                          source: 'marketCenter'
                        }
                      })
                    }
                  >
                    <span className="left">
                      <img src={images.order_04} />
                    </span>
                    <div className="info">
                      <h5>精准发券</h5>
                      <p>定向发券，精准触达会员</p>
                    </div>
                  </a>
                </Col>
              </AuthWrapper>
              <Col span={6}>
                <a
                  className="createMarket"
                  onClick={() => {
                    history.push('/flash-sale');
                  }}
                >
                  <span className="left">
                    <img src={images.order_05} />
                  </span>
                  <div className="info">
                    <h5>秒杀</h5>
                    <p>限时特价促销，刺激消费</p>
                  </div>
                </a>
              </Col>
            </Row>

            <h3>
              提高客单<span>更高销售和利润</span>
            </h3>
            <Row>
              <Col span={6}>
                <a className="createMarket" onClick={this._pleaseGoSupplier}>
                  <span className="left">
                    <img src={images.full_01} />
                  </span>
                  <div className="info">
                    <h5>满减</h5>
                    <p>满足指定条件享受减价</p>
                  </div>
                </a>
              </Col>

              <Col span={6}>
                <a className="createMarket" onClick={this._pleaseGoSupplier}>
                  <span className="left">
                    <img src={images.full_02} />
                  </span>
                  <div className="info">
                    <h5>满折</h5>
                    <p>满足指定条件享受折扣</p>
                  </div>
                </a>
              </Col>

              <Col span={6}>
                <a className="createMarket" onClick={this._pleaseGoSupplier}>
                  <span className="left">
                    <img src={images.full_03} />
                  </span>
                  <div className="info">
                    <h5>满赠</h5>
                    <p>满足指定条件获得赠品</p>
                  </div>
                </a>
              </Col>
            </Row>

            <h3>
              留存复购<span>维护老客不流失</span>
            </h3>
            <Row>
              <Col span={6}>
                <a
                  className="createMarket"
                  onClick={() => history.push('/growth-value-setting')}
                >
                  <span className="left">
                    <img src={images.customer_01} />
                  </span>
                  <div className="info">
                    <h5>会员成长值</h5>
                    <p>会员成长体系搭建</p>
                  </div>
                </a>
              </Col>
              <Col span={6}>
                <a
                  className="createMarket"
                  onClick={() => history.push('/customer-grade')}
                >
                  <span className="left">
                    <img src={images.customer_02} />
                  </span>
                  <div className="info">
                    <h5>会员等级</h5>
                    <p>会员等级体系管理，差异化服务</p>
                  </div>
                </a>
              </Col>

              <Col span={6}>
                <a
                  className="createMarket"
                  onClick={() => history.push('/customer-equities')}
                >
                  <span className="left">
                    <img src={images.customer_03} />
                  </span>
                  <div className="info">
                    <h5>会员权益</h5>
                    <p>等级专属权益，会员关系维护</p>
                  </div>
                </a>
              </Col>

              <Col span={6}>
                <a
                  className="createMarket"
                  onClick={() => history.push('/points-setting')}
                >
                  <span className="left">
                    <img src={images.customer_05} />
                  </span>
                  <div className="info">
                    <h5>会员积分</h5>
                    <p>赚积分当钱花，活跃客户</p>
                  </div>
                </a>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <a
                  className="createMarket"
                  onClick={() => history.push('/points-goods-list')}
                >
                  <span className="left">
                    <img src={images.customer_06} />
                  </span>
                  <div className="info">
                    <h5>积分商城</h5>
                    <span className="miniTags">推荐</span>
                    <p>小积分大价值，礼品随心兑</p>
                  </div>
                </a>
              </Col>
              <Col span={6}>
                <a
                  className="createMarket"
                  onClick={() => history.push('/customer-group')}
                >
                  <span className="left">
                    <img src={images.crm} />
                  </span>
                  <div className="info">
                    <h5>CRM</h5>
                    <span className="miniTags orange">付费</span>
                    <p>会员分群与精准营销</p>
                  </div>
                </a>
              </Col>
            </Row>

            <h3>实用工具</h3>
            <Row>
              <Col span={6}>
                <a
                  className="createMarket"
                  onClick={() => history.push('/sms-reach')}
                >
                  <span className="left">
                    <img src={images.sms} />
                  </span>
                  <div className="info">
                    <h5>短信触达</h5>
                    <p>短信通知，无门槛直达受众</p>
                  </div>
                </a>
              </Col>
              <Col span={6}>
                <a
                  className="createMarket"
                  onClick={() => history.push('/app-push')}
                >
                  <span className="left">
                    <img src={images.apppush} />
                  </span>
                  <div className="info">
                    <h5>APP Push</h5>
                    <p>免费消息通知，直达App商城</p>
                  </div>
                </a>
              </Col>
              <Col span={6}>
                <a
                  className="createMarket"
                  onClick={() => history.push('/station-message')}
                >
                  <span className="left">
                    <img src={images.message} />
                  </span>
                  <div className="info">
                    <h5>站内信</h5>
                    <p>站内消息与通讯大本营</p>
                  </div>
                </a>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    );
  }

  _pleaseGoSupplier = () => {
    message.success('请到商家端创建满系营销');
  };

  _pleaseWait = () => {
    message.success('即将上线，敬请期待');
  };
}
