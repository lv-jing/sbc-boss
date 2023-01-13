import React from 'react';
import { Form, Tabs } from 'antd';
import { StoreProvider, Relax } from 'plume2';
import { Headline, BreadCrumb } from 'qmkit';
import AppStore from './store';
import SearchForm from './components/search-form';
import ButtonGroup from './components/button-group';
import InfoList from './components/info-list';
import EditModal from './components/edit-modal';

const SearchDataForm = Relax(Form.create()(SearchForm));

@StoreProvider(AppStore, { debug: __DEV__ })
export default class InfoIndex extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.init();
  }

  render() {
    const { onTabChange } = this.store;
    return (
      <div>
        {/* 面包屑导航 */}
        <BreadCrumb />
        <div className="container">
          {/* 头部标题 */}
          <Headline title="人群运营" />

          {/* 页面提示 */}
          {/*<TopTips/>*/}

          {/* 搜索项区域 */}
          <SearchDataForm />

          {/* 操作按钮区域 */}
          <ButtonGroup />

          <Tabs onChange={(key) => onTabChange({ key })}>
            <Tabs.TabPane tab="全部" key={null}>
              <InfoList />
            </Tabs.TabPane>
            <Tabs.TabPane tab="未开始" key="0">
              <InfoList />
            </Tabs.TabPane>
            <Tabs.TabPane tab="进行中" key="1">
              <InfoList />
            </Tabs.TabPane>
            <Tabs.TabPane tab="暂停中" key="2">
              <InfoList />
            </Tabs.TabPane>
            <Tabs.TabPane tab="已结束" key="3">
              <InfoList />
            </Tabs.TabPane>
          </Tabs>
          {/* 编辑弹框 */}
          <EditModal />
        </div>
      </div>
    );
  }
}
