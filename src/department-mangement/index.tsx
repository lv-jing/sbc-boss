import React from 'react';
import { Breadcrumb, Alert } from 'antd';
import { StoreProvider } from 'plume2';

import { AuthWrapper, BreadCrumb, Headline } from 'qmkit';
import AppStore from './store';
import DepartmentList from './component/department-list';
import DepartmentModal from './component/department-modal';
import Tool from './component/tool';
import LeaderModal from './component/leader-modal';
import { FormattedMessage } from 'react-intl';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class GoodsCate extends React.Component<any, any> {
  store: AppStore;

  componentWillMount() {
    this.store.init();
  }

  render() {
    return (
      <div>
        <BreadCrumb />
        <div className="container">
          <Headline title={<FormattedMessage id="Setting.DepartmentManagement" />} />
          <div style={{ marginBottom: 16 }}>
            <Alert
              message=""
              description={
                <div>
                  <p>{<FormattedMessage id="Setting.During" />}</p>
                  <p>{<FormattedMessage id="Setting.Support" />}</p>
                  <p>{<FormattedMessage id="Setting.Each" />}</p>
                </div>
              }
              type="info"
            />
          </div>

          <AuthWrapper functionName={'f_department_add_root'}>
            {/*工具条*/}
            <Tool />
          </AuthWrapper>

          <AuthWrapper functionName={'f_department_list'}>
            {/*列表*/}
            <DepartmentList />
          </AuthWrapper>

          {/*弹框*/}
          <DepartmentModal />

          <LeaderModal />
        </div>
      </div>
    );
  }
}
