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
    const key = form.get('tabType');
    return (
      <div>
        <Tabs activeKey={key} onChange={(key) => this._handleClick(key)}>
          <Tabs.TabPane tab="全部" key={0}>
            <List />
          </Tabs.TabPane>

          <Tabs.TabPane tab="收入" key={1}>
            <List />
          </Tabs.TabPane>

          <Tabs.TabPane tab="支出" key={2}>
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
