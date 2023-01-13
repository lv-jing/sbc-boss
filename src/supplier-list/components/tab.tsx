import React from 'react';
import { IMap, Relax } from 'plume2';

import { Tabs } from 'antd';
import { noop } from 'qmkit';

import List from '../components/list';
import { FormattedMessage } from 'react-intl';
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
    const key = form.get('auditState');

    return (
      <div>
        <Tabs activeKey={key} onChange={(key) => this._handleClick(key)}>
          <Tabs.TabPane
            tab={<FormattedMessage id="Store.StoreAll" />}
            key="-1"
          />
          <Tabs.TabPane
            tab={<FormattedMessage id="Store.Reviewed" />}
            key="1"
          />
          <Tabs.TabPane tab={<FormattedMessage id="Store.ToAudit" />} key="0" />
          <Tabs.TabPane
            tab={<FormattedMessage id="Store.FailedAudit" />}
            key="2"
          />
        </Tabs>
        <List />
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
