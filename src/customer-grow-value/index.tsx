import React from 'react';
import { Breadcrumb, Button } from 'antd';
import { StoreProvider } from 'plume2';
import { Headline, BreadCrumb } from 'qmkit';
import AppStore from './store';
import Head from './components/head';
import Search from './components/search';
import CustomerGrowValueList from './components/list';
import history from '../../web_modules/qmkit/history';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class CustomerGrowValue extends React.Component<any, any> {
  store: AppStore;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const customerId =
      this.props.customerId || this.props.match.params.customerId;
    this.store.setCustomerId(customerId);
    this.store.init();
    this.store.queryCustomerInfo(customerId);

    //是否是查询企业购会员详情
    if (this.props && this.props.match && this.props.match.params) {
      const enterpriseCustomerFlag = this.props.match.params.enterpriseCustomer;
      if (enterpriseCustomerFlag) {
        this.store.checkIsEnterpriseCustomer(true);
      }
    }
  }

  render() {
    let that = this;

    const isEnterpriseCustomer = this.store.state().get('isEnterpriseCustomer');
    return (
      <div>
        {/*导航面包屑*/}
        {!this.props.customerId && (
          <BreadCrumb>
            <Breadcrumb.Item>客户成长值</Breadcrumb.Item>
          </BreadCrumb>
        )}
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>客户</Breadcrumb.Item>
          <Breadcrumb.Item>客户管理</Breadcrumb.Item>
          <Breadcrumb.Item>客户列表</Breadcrumb.Item>
          <Breadcrumb.Item>客户成长值</Breadcrumb.Item>
        </Breadcrumb> */}
        <div
          className="container customer"
          style={this.props.customerId ? { padding: 0, margin: 0 } : {}}
        >
          {!this.props.customerId && <Headline title="客户成长值" />}
          {!this.props.customerId && (
            <div className="handle-bar">
              <Button
                type="primary"
                onClick={() => {
                  isEnterpriseCustomer
                    ? history.push({ pathname: '/enterprise-customer-list' })
                    : that.store._toCustomerList();
                }}
              >
                返回客户列表
              </Button>
            </div>
          )}
          <Head />
          {/*搜索条件位置*/}
          <Search />
          {/*列表*/}
          <CustomerGrowValueList />
        </div>
      </div>
    );
  }
}
