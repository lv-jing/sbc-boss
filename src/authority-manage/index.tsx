import React from 'react';
import {  Col, Row,Breadcrumb } from 'antd';
import { StoreProvider } from 'plume2';
import AppStore from './store';
import TypeTab from './components/type-tab';
import EditMenuModal from './components/edit-menu-modal';
import EditFuncModal from './components/edit-func-modal';
import EditAuthModal from './components/edit-auth-modal';

import { Headline, AuthWrapper } from 'qmkit';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class AuthorityManage extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.init();
  }

  render() {
    return (
      <AuthWrapper functionName="fetchRoles">
        <div>
          {/* <BreadCrumb/> */}
          <Breadcrumb separator=">">
            <Breadcrumb.Item>设置</Breadcrumb.Item>
            <Breadcrumb.Item>员工管理</Breadcrumb.Item>
            <Breadcrumb.Item>权限管理</Breadcrumb.Item>
          </Breadcrumb>
          <div className="container" style={{ paddingBottom: 50 }}>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <Headline title="权限管理" />
            </div>

            <Row>
              <Col style={{ color: '#999', marginBottom: '10px' }}>
                说明：
                <ul>
                  <li>
                    1、默认建议菜单应该有3级，功能挂在3级菜单上，权限挂在功能上；
                  </li>
                  <li>
                    2、调整任意菜单/功能/权限后，所有包含此菜单/功能/权限的员工都需要重新登录；{' '}
                  </li>
                </ul>
              </Col>
            </Row>

            {/*不同端的菜单/功能/权限*/}
            <TypeTab />
          </div>

          {/* 菜单/功能/权限的新增/编辑弹窗 */}
          <EditMenuModal />
          <EditFuncModal />
          <EditAuthModal />
        </div>
      </AuthWrapper>
    );
  }
}
