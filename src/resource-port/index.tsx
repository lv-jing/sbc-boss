import React from 'react';
import { Card, Modal } from 'antd';
import { AuthWrapper, BreadCrumb, Headline } from 'qmkit';
import ResourceModal from './components/resource-modal';
import { StoreProvider } from 'plume2';
import AppStore from './store';

const confirm = Modal.confirm;

@StoreProvider(AppStore, { debug: __DEV__ })
export default class ResourcePort extends React.Component<any, any> {
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
        <BreadCrumb />
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>设置</Breadcrumb.Item>
          <Breadcrumb.Item>接口管理</Breadcrumb.Item>
          <Breadcrumb.Item>对象存储</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className="container">
          <Headline title="对象存储接口" />
          <div style={styles.cardBox}>
            {this.store
              .state()
              .get('resources')
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
                        {v.status == 1 ? '已启用' : '已停用'}
                      </div>
                      <AuthWrapper functionName={'f_resourcePort_1'}>
                        <div>
                          <a
                            href="javascript:void(0);"
                            style={styles.links}
                            onClick={() => this.store.onEdit(v.id)}
                          >
                            编辑
                          </a>
                          {v.status == 0 ? (
                            <a
                              href="javascript:void(0);"
                              style={styles.links}
                              onClick={() => this._changeStatus(v.id)}
                            >
                              启用
                            </a>
                          ) : null}
                        </div>
                      </AuthWrapper>
                    </div>
                    <div style={styles.methodItem}>
                      <h4 style={styles.title}>{v.configName}</h4>
                    </div>
                  </Card>
                );
              })}
          </div>

          <ResourceModal />
        </div>
      </div>
    );
  }

  /**
   * 启用
   */
  _changeStatus = (id) => {
    const { changeStatus } = this.store;
    confirm({
      title: '提示',
      content:
        '更换对象存储服务将导致已有图片、视频等资源无法获取，请谨慎操作。',
      onOk() {
        changeStatus(id);
      }
    });
  };
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
