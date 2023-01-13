import React from 'react';
import { Card } from 'antd';
import { Headline,BreadCrumb } from 'qmkit';
import styled from 'styled-components';
import MiniModal from './components/mini-modal';
import { StoreProvider } from 'plume2';
import AppStore from './store';
const ContainerDiv = styled.div`
  .methodItem {
    width: 100%;
    border: 1px solid #f5f5f5;
    text-align: center;
    padding: 30px 0;
    img {
      width: 86px;
      height: 86px;
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
`;

@StoreProvider(AppStore, { debug: __DEV__ })
export default class MiniInterface extends React.Component<any, any> {
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
          <Breadcrumb.Item>小程序接口</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className="container">
          <ContainerDiv>
            <Headline title="小程序接口" />
            <Card style={{ width: 300 }} bodyStyle={{ padding: 10 }}>
              <div className="methodItem">
                <img src={require('./img/mini.png')} />
              </div>
              <div className="bar">
                <div className="status" />
                <div>          
                  <a onClick={() => this.store.wxFormEdit()} className="links">
                    编辑
                  </a>                                 
                </div>
              </div>
            </Card>
          </ContainerDiv>
          <MiniModal />
        </div>
      </div>
    );
  }
}
