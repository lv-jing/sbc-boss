import React from 'react';
import { Relax } from 'plume2';
import { Tabs } from 'antd';
import { AuthWrapper, noop } from 'qmkit';
import SearchForm from './search-form';
import CateTool from './cate-tool';
import CateList from './cate-list';
import SettingList from './setting-list';
import CateModal from './cate-modal';
import ActivityTab from './activity-tab';

@Relax
export default class TabDataGrid extends React.Component<any, any> {
  props: {
    form: any;
    relaxProps?: {
      onTabChange: Function;
      key: 'key';
      activityKey: string;
    };
  };

  static relaxProps = {
    onTabChange: noop,
    key: 'key',
    activityKey: 'activityKey'
  };

  render() {
    const { onTabChange, key, activityKey } = this.props.relaxProps;

    return (
      <Tabs onChange={(key) => onTabChange(key)} activeKey={key}>
        <Tabs.TabPane tab="秒杀设置" key="0">
          <AuthWrapper functionName="f_flash_sale_setting_list">
            {/*列表*/}
            <SettingList />
          </AuthWrapper>
        </Tabs.TabPane>
        <Tabs.TabPane tab="秒杀分类" key="1">
          <AuthWrapper functionName="f_flash_sale_cate_list">
            {/*工具条*/}
            <CateTool />
            {/*列表*/}
            <CateList />
            {/*弹框*/}
            <CateModal />
          </AuthWrapper>
        </Tabs.TabPane>
        <Tabs.TabPane tab="秒杀活动列表" key="2" className="resetTable">
          <AuthWrapper functionName="f_flash_sale_activity_list">
            {/* 搜索项区域 */}
            {activityKey != '1' && <SearchForm form={this.props.form} />}
            {activityKey == '1' && <div style={{ height: 42 }} />}
            {/* 数据列表区域 */}
            <ActivityTab />
          </AuthWrapper>
        </Tabs.TabPane>
      </Tabs>
    );
  }
}
