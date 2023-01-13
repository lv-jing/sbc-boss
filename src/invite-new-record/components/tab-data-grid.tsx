import React from 'react';
import { IMap, Relax } from 'plume2';
import { Tabs } from 'antd';
import InviteNewRecordList from './list';
import { noop } from 'qmkit';

@Relax
export default class TabDataGrid extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onTabChange: Function;
      searchParams: IMap;
    };
  };

  static relaxProps = {
    onTabChange: noop,
    searchParams: 'searchParams'
  };

  render() {
    const { onTabChange, searchParams } = this.props.relaxProps;
    const key = searchParams.get('isRewardRecorded');

    return (
      <Tabs onChange={(key) => onTabChange(key)} activeKey={key}>
        <Tabs.TabPane tab="已入账" key="1">
          <InviteNewRecordList />
        </Tabs.TabPane>

        <Tabs.TabPane tab="未入账" key="0">
          <InviteNewRecordList />
        </Tabs.TabPane>
      </Tabs>
    );
  }
}
