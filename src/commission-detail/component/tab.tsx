import React from 'react';
import { IMap, Relax } from 'plume2';

import { Tabs } from 'antd';
import { noop } from 'qmkit';

import List from '../component/list';

@Relax
export default class Tab extends React.Component<any, any> {
  props: {
    relaxProps?: {
      changeTab: Function;
      form: IMap;
    };
  };

  static relaxProps = {
    changeTab: noop,
    form: 'form'
  };

  render() {
    const { form } = this.props.relaxProps;
    //资金类型，0：全部，1：分销佣金，3：邀新奖励，4：佣金提成
    const key = form.get('fundsType');
    return (
      <div>
        <Tabs activeKey={key} onChange={(key) => this._handleClick(key)}>
          <Tabs.TabPane tab="全部" key="0">
            <List />
          </Tabs.TabPane>

          <Tabs.TabPane tab="分销佣金" key="1">
            <List />
          </Tabs.TabPane>

          <Tabs.TabPane tab="邀新奖励" key="3">
            <List />
          </Tabs.TabPane>

          <Tabs.TabPane tab="佣金提成" key="4">
            <List />
          </Tabs.TabPane>
        </Tabs>
      </div>
    );
  }

  /**
   * 切换tab
   */
  _handleClick = (key) => {
    this.props.relaxProps.changeTab(key);
  };
}
