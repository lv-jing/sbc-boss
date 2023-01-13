import React from 'react';
import { Form } from 'antd';
import { BreadCrumb, Headline } from 'qmkit';
import styled from 'styled-components';
import QQModal from './components/qq-modal';
import { StoreProvider } from 'plume2';
import AppStore from './store';
import AliyunModal from './components/aliyun-modal';

const QQForm = Form.create()(QQModal as any); //品牌弹框
const AliForm = Form.create()(AliyunModal as any);
const ContainerDiv = styled.div`
  .methodItem {
    width: 100%;
    border: 1px solid #f5f5f5;
    text-align: center;
    padding: 20px 0;
    img {
      width: 86px;
      height: 86px;
    }
    h4 {
      font-size: 14px;
      color: #333;
      margin-top: 5px;
    }
  }
  .bar {
    flex-direction: row;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 8px 0;
    .status {
      font-size: 12px;
      color: #666;
    }
    .links {
      font-size: 12px;
      margin-left: 15px;
    }
  }
  .cardBox{
    display: inline-block;
    border-radius: 2px;
    line-height: 1.5;
    margin-right: 20px;
    width: 300px;
    border: 1px solid #eee;
    padding: 10px;
  }
`;

@StoreProvider(AppStore, { debug: __DEV__ })
export default class OnlinelService extends React.Component<any, any> {
  store: AppStore;

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.store.init();
  }

  render() {
    const enableFlag = this.store.state().get('enableFlag');
    const smsVisible = this.store.state().get('smsVisible');
    const aliSmsVisible = this.store.state().get('aliSmsVisible');
    const aliyunServer = this.store.state().get('aliyunServer');

    return (
      <div>
        <BreadCrumb/>
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>设置</Breadcrumb.Item>
          <Breadcrumb.Item>客服设置</Breadcrumb.Item>
          <Breadcrumb.Item>在线客服</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className="container">
          <ContainerDiv>
            <Headline title="在线客服" />
            <div className="cardBox">
              <div className="methodItem">
                <img src={require('./img/qq.png')} />
                <h4>QQ客服</h4>
              </div>
              <div className="bar">
                <div className="status">{enableFlag ? '已启用' : '未启用'}</div>
                <div>
                  <a
                    onClick={() => this.store.onEditServer()}
                    className="links"
                  >
                    编辑
                  </a>
                </div>
              </div>
            </div>

            <div className="cardBox">
              <div className="methodItem">
                <img src={require('./img/aliyun.png')} />
                <h4>阿里云客服</h4>
              </div>
              <div className="bar">
                <div className="status">{aliyunServer.get('enableFlag') == 1 ? '已启用' : '未启用'}</div>
                <div>
                  <a
                    onClick={() => this.store.onAliEditServer()}
                    className="links"
                  >
                    编辑
                  </a>
                </div>
              </div>
            </div>
          </ContainerDiv>
          {smsVisible && <QQForm />}
          {aliSmsVisible && <AliForm />}
        </div>
      </div>
    );
  }
}
