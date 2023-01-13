import React from 'react';
import {  Card } from 'antd';
import { Headline,BreadCrumb } from 'qmkit';
import PictureModal from './components/picture-modal';
import { StoreProvider } from 'plume2';
import AppStore from './store';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class PicturePort extends React.Component<any, any> {
  store: AppStore;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.store.init();
  }

  render() {
    return (
      <div>
        <BreadCrumb/>
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>设置</Breadcrumb.Item>
          <Breadcrumb.Item>接口管理</Breadcrumb.Item>
          <Breadcrumb.Item>图片服务器接口</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className="container">
          <Headline title="图片服务器接口" />
          <div style={styles.cardBox}>
            {this.store
              .state()
              .get('pictures')
              .toJS()
              .map((v) => {
                return (
                  <Card
                    style={{ width: 300, marginRight: 20 }}
                    bodyStyle={{ padding: 10 }}
                    key={v.id}
                  >
                    <div style={styles.bar}>
                      <div style={styles.status}>
                        {v.status ? '已启用' : '未启用'}
                      </div>
                      <div>
                        <a
                          style={styles.links}
                          onClick={() => this.store.onEdit(v.id)}
                        >
                          编辑
                        </a>
                      </div>
                    </div>
                    <div style={styles.methodItem}>
                      <h4 style={styles.title}>{v.configName}</h4>
                    </div>
                  </Card>
                );
              })}
          </div>

          <PictureModal />
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
    fontWeight: 'bold',
    fontSize: 18,
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
