import React from 'react';

import { Tabs } from 'antd';
import { Relax } from 'plume2';
import { noop } from 'qmkit';

import ActivityInfo from './activity-info';

@Relax
export default class ActivityTab extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onTabChange: Function;
      tab: string;
    };
  };

  static relaxProps = {
    onTabChange: noop,
    tab: 'tab'
  };

  render() {
    const { onTabChange, tab } = this.props.relaxProps;

    return (
      <Tabs
        onChange={(key) => {
          onTabChange(key);
        }}
        activeKey={tab}
      >
        <Tabs.TabPane tab="活动信息" key="0">
          <ActivityInfo />
        </Tabs.TabPane>
        {/*<Tabs.TabPane tab="相关优惠券" key="1" > </Tabs.TabPane>*/}
      </Tabs>
    );
  }
}
