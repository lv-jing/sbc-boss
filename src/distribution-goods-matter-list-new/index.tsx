import React from 'react';
import { Button } from 'antd';
import { StoreProvider } from 'plume2';

import { Headline,AuthWrapper,history,BreadCrumb } from 'qmkit';

import AppStore from './store';
import SearchForm from './components/search-form';
import GoodsMatterList from './components/goods-matter-list';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class Customer extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.init({ pageNum: 0, pageSize: 10 });
  }

  render() {
    return (
      <div>
        {/*导航面包屑*/}
        <BreadCrumb/>
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>营销</Breadcrumb.Item>
          <Breadcrumb.Item>社交分销管理</Breadcrumb.Item>
          <Breadcrumb.Item>分销素材</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className="container customer">
          <Headline title="分销素材" />

          {/*搜索条件*/}
          <SearchForm />

          <AuthWrapper functionName="f_distribution_matter_add">
          
          <div className="handle-bar">
            <Button
              type="primary"
              onClick={() => {
                history.push({
                  pathname: '/distribution-goods-matter-add',          
                });
              }}
            >
              新增分销素材
            </Button>
          </div>
        </AuthWrapper>

          {/*tab的素材列表*/}
          <GoodsMatterList />
        </div>
      </div>
    );
  }
}
