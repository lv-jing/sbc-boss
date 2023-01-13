import React from 'react';
import {  Card } from 'antd';
import { AuthWrapper, Headline,BreadCrumb } from 'qmkit';
import ExpressModal from './components/express-modal';
import { StoreProvider } from 'plume2';
import AppStore from './store';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class ExpressPort extends React.Component<any, any> {
  store: AppStore;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.store.init();
  }

  render() {
    const portObj = this.store.state().get('portObj');
    return (
      <div>
        <BreadCrumb/>
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>设置</Breadcrumb.Item>
          <Breadcrumb.Item>接口管理</Breadcrumb.Item>
          <Breadcrumb.Item>物流接口</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className="container">
          <Headline title="物流接口" />
          <div style={styles.cardBox}>
            <Card
              style={{ width: 300, marginRight: 20 }}
              bodyStyle={{ padding: 10 }}
            >
              <div style={styles.bar}>
                <div style={styles.status}>
                  {portObj.status == 1 ? '已启用' : '已停用'}
                </div>
                <div>
                  <a
                    href="javascript:void(0);"
                    style={styles.links}
                    onClick={() => this.store.onEdit()}
                  >
                    编辑
                  </a>
                  <AuthWrapper functionName={'f_expressPort_1'}>
                    <a
                      href="javascript:void(0);"
                      style={styles.links}
                      onClick={() =>
                        this.store.changeStatus(Number(!portObj.status))
                      }
                    >
                      {portObj.status == 1 ? '停用' : '启用'}
                    </a>
                  </AuthWrapper>
                </div>
              </div>
              <div style={styles.methodItem}>
                <h4 style={styles.title}>快递100企业版</h4>
              </div>
            </Card>
          </div>

          <ExpressModal />
        </div>
      </div>
    );
  }
}

const styles = {
  methodItem: {
    textAlign: 'left'
  } as any,
  title: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    paddingTop: 15,
    paddingBottom: 5
  } as any,
  bar: {
    paddingBottom: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #eee'
  } as any,
  status: {
    fontSize: 12,
    color: '#666'
  },
  links: {
    fontSize: 12,
    marginLeft: 10
  },
  cardBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  } as any
};
