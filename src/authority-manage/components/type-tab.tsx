import React from 'react';
import { Relax } from 'plume2';

import { Tabs } from 'antd';
import { noop } from 'qmkit';

import AuthorityManager from './authority-manager';
import { platformType } from '../actor/boss-menu-actor';
@Relax
export default class Tab extends React.Component<any, any> {
  props: {
    relaxProps?: {
      changePlatformType: Function;
      currPlatform: string;
    };
  };

  static relaxProps = {
    changePlatformType: noop,
    currPlatform: 'currPlatform'
  };

  render() {
    const { currPlatform, changePlatformType } = this.props.relaxProps;

    return (
      <div>
        <Tabs
          activeKey={currPlatform}
          onChange={(key) => changePlatformType(key)}
        >
          <Tabs.TabPane tab="商家端" key={platformType.SUPPLIER}>
            <AuthorityManager />
          </Tabs.TabPane>

          <Tabs.TabPane tab="平台端" key={platformType.PLATFORM}>
            <AuthorityManager />
          </Tabs.TabPane>

          <Tabs.TabPane tab="供应商端" key={platformType.PROVIDER}>
            <AuthorityManager />
          </Tabs.TabPane>
        </Tabs>
      </div>
    );
  }
}
