import React from 'react';
import { Card, Modal } from 'antd';
import { Headline,BreadCrumb } from 'qmkit';
import EmailModal from './components/email-modal';
import { StoreProvider } from 'plume2';
import AppStore from './store';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class LoginInterface extends React.Component<any, any> {
  store: AppStore;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.store.emailFormInit();
  }

  render() {
    const emailConfig = this.store.state().get('emailConfig');
    return (
      <div>
        <BreadCrumb/>
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>设置</Breadcrumb.Item>
          <Breadcrumb.Item>接口管理</Breadcrumb.Item>
          <Breadcrumb.Item>邮箱接口</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className="container">
          <Headline title="邮箱接口" />
          <Card style={{ width: 300 }} bodyStyle={{ padding: 10 }}>
            <div style={styles.bar}>
              <div style={styles.status}>
                {emailConfig.get('status') == 1 ? '已启用' : '已停用'}
              </div>
              <div>
                <a
                  href="javascript:void(0);"
                  style={styles.links}
                  onClick={() => this.store.emailFormEdit()}
                >
                  编辑
                </a>
                <a
                  href="javascript:void(0);"
                  style={styles.links}
                  onClick={() => this._showHelpImg()}
                >
                  帮助
                </a>
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <img src={require('./img/email-logo.jpg')} />
            </div>
          </Card>
          <EmailModal />
        </div>
      </div>
    );
  }

  _showHelpImg = () => {
    const confirm = Modal.info;
    confirm({
      content: (
        <div style={{ fontSize: 18, color: '#333', lineHeight: 1.8 }}>
          <p>您需要登录腾讯企业邮箱后，在邮箱设置-客户端设置下开启SMTP服务</p>
          <img src={require('./img/help.png')} />
          <p>使用SSL的通用配置如下，可参照配置在系统后台</p>
          <p>SMTP服务器：smtp.exmail.qq.com</p>
          <p>SMTP端口号：465</p>
          <p>
            SMPT账号：您的腾讯企业邮箱账户名（账户名需要填写完整的邮件地址）
          </p>
          <p>SMTP密码：您的腾讯企业邮箱密码</p>
        </div>
      ),
      width: 900
    });
  };
}

const styles = {
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
