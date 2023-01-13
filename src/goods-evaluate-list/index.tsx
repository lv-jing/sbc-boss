import React from 'react';
import { Alert } from 'antd';
import { StoreProvider } from 'plume2';
import { AuthWrapper, Headline, BreadCrumb } from 'qmkit';
import AppStore from './store';
import SearchForm from './components/search-form';
import CustomerList from './components/list';
import See from './components/see';
import { FormattedMessage } from 'react-intl';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class Customer extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.init();
  }

  render() {
    return (
      <AuthWrapper functionName="f_goods_eval_manage">
        <div>
          {/*导航面包屑*/}
          <BreadCrumb />
          {/* <Breadcrumb separator=">">
            <Breadcrumb.Item>商品</Breadcrumb.Item>
            <Breadcrumb.Item>商品管理</Breadcrumb.Item>
            <Breadcrumb.Item>评价管理</Breadcrumb.Item>
          </Breadcrumb> */}
          <div className="container customer">
            <Headline title={<FormattedMessage id="Product.EvaluationManagement" />} />
            <div>
              <Alert
                message={<FormattedMessage id="Product.evaluateTips" />}
                type="info"
                showIcon
              />
            </div>
            {/*搜索条件*/}
            <SearchForm />
            {/*tab的评价列表*/}
            <CustomerList />
            <See />
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
