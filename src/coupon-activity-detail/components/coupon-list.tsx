import React from 'react';

import { Relax } from 'plume2';
import { Table } from 'antd';
import { IMap } from 'typings/globalType';

@Relax
export default class CouponList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      couponInfoList: IMap;
    };
  };

  static relaxProps = {
    couponInfoList: ['activityInfo', 'couponInfoList']
  };

  render() {
    const { couponInfoList } = this.props.relaxProps;
    return (
      <Table
        dataSource={couponInfoList.toJS()}
        pagination={false}
        scroll={{ x: true, y: 500 }}
        rowKey="couponId"
      >
        <Table.Column
          title="优惠券名称"
          dataIndex="couponName"
          key="couponName"
          width="20%"
        />
        <Table.Column title="面值" dataIndex="price" key="price" width="10%" />
        <Table.Column title="有效期" dataIndex="time" key="time" width="40%" />
        <Table.Column
          title="总张数"
          dataIndex="totalCount"
          key="totalCount"
          width="10%"
        />
      </Table>
    );
  }
}
