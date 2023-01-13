import React from 'react';
import { Alert } from 'antd';
import { Headline,BreadCrumb } from 'qmkit';
import CompanyList from './components/company-list';
import CompanyModal from './components/company-modal';
import { StoreProvider } from 'plume2';
import AppStore from './store';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class LogisticsManage extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.init();
  }

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <BreadCrumb/>
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>设置</Breadcrumb.Item>
          <Breadcrumb.Item>物流设置</Breadcrumb.Item>
          <Breadcrumb.Item>物流公司设置</Breadcrumb.Item>
        </Breadcrumb> */}

        <div className="container">
          <Headline title="物流公司设置" />
          <Alert
            message="平台接入的物流公司，最多可设置100个物流公司。"
            type="info"
            showIcon
          />
          <CompanyList />
          <CompanyModal />
        </div>
      </div>
    );
  }
}
