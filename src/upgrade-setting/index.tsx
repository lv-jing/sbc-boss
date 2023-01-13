import React from 'react';
import { StoreProvider } from 'plume2';
import { Form, Alert } from 'antd';
import { AuthWrapper, Headline,BreadCrumb } from 'qmkit';

import AppStore from './store';
import InfoForm from './components/info-form';

const InfoFormDetail = Form.create()(InfoForm as any);

@StoreProvider(AppStore, { debug: __DEV__ })
export default class CompanyInformation extends React.Component<any, any> {
  store: AppStore;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.store.init();
  }

  render() {
    return (
      <AuthWrapper functionName={'f_check_update'}>
        <div>
          <BreadCrumb/>
          {/* <Breadcrumb separator=">">
            <Breadcrumb.Item>设置</Breadcrumb.Item>
            <Breadcrumb.Item>App设置</Breadcrumb.Item>
            <Breadcrumb.Item>App更新</Breadcrumb.Item>
          </Breadcrumb> */}
          <div className="container">
            <Headline title="App更新" />
            <Alert
              message={
                <div>适用于用户使用APP时，对用户进行新版本APP更新提醒</div>
              }
              type="info"
            />

            <InfoFormDetail />
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
