/**
 *财务-收款账户
 */
import React from 'react';
import { Tabs, Card, Button } from 'antd';
import { Headline,BreadCrumb } from 'qmkit';
import { StoreProvider } from 'plume2';
import AppStore from './store';
import AccountList from './components/account-list';
import AccountModal from './components/account-modal';
import PayModal from './components/pay-modal';
import UnionB2BModal from './components/union-b2b-modal';
import WxPayModal from './components/wx_pay_modal';
import AliPayModal from './components/alipay-modal';
import BalanceModal from './components/balance-model';
import { checkMenu, AuthWrapper } from '../../web_modules/qmkit/checkAuth';

const gateways_imgsrc = {
  PING: require('./img/ju01.png'),
  UNIONB2B: require('./img/union.png'),
  WECHAT: require('./img/WeChat.png'),
  ALIPAY: require('./img/zhifubao.png'),
  BALANCE: require('./img/balance_pay.png')
};

@StoreProvider(AppStore, { debug: __DEV__ })
export default class FinanceAccoutReceivable extends React.Component<any, any> {
  store: AppStore;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.store.init();
  }

  render() {
    const gatewaysList = this.store.state().get('gateways');

    return (
      <div>
        <BreadCrumb/>
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>财务</Breadcrumb.Item>
          <Breadcrumb.Item>收款账户</Breadcrumb.Item>
          <Breadcrumb.Item>平台收款账户</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className="container">
          <Headline title="收款账户" />

          <Tabs>
            <Tabs.TabPane tab="在线支付" key="1">
              <div style={styles.cardBox}>
                {gatewaysList.map((value, index) => {
                  return (
                    <Card
                      key={index}
                      style={styles.cardContent}
                      bodyStyle={{ padding: 0 }}
                    >
                      <div style={styles.methodItem}>
                        <div style={styles.imgBox}>
                          <img
                            src={gateways_imgsrc[value['name']]}
                            alt=""
                            width={210}
                          />
                        </div>
                      </div>
                      <div style={styles.bar}>
                        <div style={styles.status}>
                          {value['isOpen'] == 1 ? '已启用' : '未启用'}
                        </div>
                        <div>
                          {checkMenu('getTradeGateWays,onEditChannel') && (
                            <a
                              onClick={() =>
                                this.store.onEditChannel(value['id'])
                              }
                              style={styles.links}
                            >
                              编辑
                            </a>
                          )}
                          {/*<a
                            style={styles.links}
                            href="/pay-help-doc"
                            target="_blank"
                          >
                            帮助
                          </a>*/}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </Tabs.TabPane>

            <Tabs.TabPane tab="线下支付" key="2">
              <div className="handle-bar">
                <AuthWrapper functionName="editOfflineAccount">
                  <Button
                    type="primary"
                    onClick={() => this.store.onAdd()}
                    disabled={
                      this.store
                        .state()
                        .get('dataList')
                        .count() >= 50
                    }
                  >
                    新增
                  </Button>
                </AuthWrapper>
              </div>

              <AuthWrapper functionName={'fetchAllOfflineAccounts'}>
                <AccountList />
              </AuthWrapper>
            </Tabs.TabPane>
          </Tabs>

          <AccountModal />
          <PayModal />
          <UnionB2BModal />
          <WxPayModal />
          <AliPayModal />
          <BalanceModal />
        </div>
      </div>
    );
  }
}

const styles = {
  methodItem: {
    padding: 10,
    textAlign: 'center',
    paddingBottom: 0
  } as any,
  title: {
    color: '#ffffff',
    fontSize: 18,
    paddingTop: 15,
    paddingBottom: 15
  } as any,
  bar: {
    height: 38,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10
  } as any,
  status: {
    fontSize: 12,
    color: '#666'
  },
  links: {
    fontSize: 12,
    marginLeft: 10
  },
  imgBox: {
    width: '100%',
    textAlign: 'center',
    height: 150,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #f3f3f3'
  } as any,
  cardBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexWrap: 'wrap'
  } as any,
  cardContent: {
    width: 285,
    marginRight: 20,
    marginBottom: 20
  } as any
};
