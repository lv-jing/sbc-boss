import React from 'react';
import { Tabs, Button } from 'antd';
import { Relax } from 'plume2';
import PointRecordList from './points-record-list';
import PointRecordQuery from './points-record-query';
import PointsCustomerList from './points-customer-list';
import PointsCustomerQuery from './points-customer-query';
import { AuthWrapper, noop } from 'qmkit';

@Relax
export default class tabs extends React.Component<any, any> {
  props: {
    relaxProps?: {
      bulk_export: Function;
      onTabChange: Function;
    };
  };

  static relaxProps = {
    bulk_export: noop,
    onTabChange: noop
  };
  render() {
    const { bulk_export, onTabChange } = this.props.relaxProps;
    return (
      <Tabs
        onChange={(key) => {
          onTabChange(key);
        }}
        >
        <Tabs.TabPane tab="积分列表" key="0">
          <PointsCustomerQuery />
          <AuthWrapper functionName="f_points_export">
            <div className="handle-bar">
              <Button onClick={()=>{bulk_export()}}>批量导出</Button>
            </div>
          </AuthWrapper>
          <PointsCustomerList />
        </Tabs.TabPane>

        <Tabs.TabPane tab="积分增减记录" key="1">
          <PointRecordQuery />
          <PointRecordList />
        </Tabs.TabPane>
      </Tabs>
    );
  }
}
