import React from 'react';
import {  Card } from 'antd';
import { Headline,BreadCrumb } from 'qmkit';
import ErpModal from './components/erp-modal';
import { StoreProvider } from 'plume2';
import AppStore from './store';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class ErpPort extends React.Component<any, any> {
  store: AppStore;

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <BreadCrumb/>
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>设置</Breadcrumb.Item>
          <Breadcrumb.Item>接口管理</Breadcrumb.Item>
          <Breadcrumb.Item>ERP接口</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className="container">
          <Headline title="ERP接口" />
          <div style={styles.cardBox}>
            <Card
              style={{ width: 300, marginRight: 20 }}
              bodyStyle={{ padding: 10 }}
            >
              <div style={styles.bar}>
                <div style={styles.status}>已启用</div>
                <div>
                  <a
                    href="javascript:;"
                    style={styles.links}
                    onClick={() => this.store.onEdit()}
                  >
                    编辑
                  </a>
                </div>
              </div>
              <div style={styles.methodItem}>
                <h4 style={styles.title}>E店宝</h4>
              </div>
            </Card>
          </div>

          <ErpModal />
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
