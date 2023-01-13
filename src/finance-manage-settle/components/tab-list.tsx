import React from 'react';

import { IMap, Relax } from 'plume2';
import { Tabs } from 'antd';
import { noop } from 'qmkit';

import List from './list';

@Relax
export default class TabList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onTabChange: Function;
      queryParams: IMap;
    };
  };

  static relaxProps = {
    onTabChange: noop,
    queryParams: 'queryParams'
  };

  render() {
    const { onTabChange, queryParams } = this.props.relaxProps;

    return (
      <div>
        <Tabs
          onChange={(key) => {
            onTabChange(key);
          }}
          activeKey={queryParams.get('settleStatus').toString()}
        >
          <Tabs.TabPane tab="未结算" key="0">
            <List />
          </Tabs.TabPane>

          <Tabs.TabPane tab="已结算" key="1">
            <List />
          </Tabs.TabPane>

        </Tabs>
      </div>
    );
  }
}
