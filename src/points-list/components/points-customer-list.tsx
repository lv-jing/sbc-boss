import React from 'react';
import { IList } from 'typings/globalType';
import { AuthWrapper, DataGrid, noop } from 'qmkit';
import { Link } from 'react-router-dom';
import { Relax } from 'plume2';
const { Column } = DataGrid;
const CUSTOMER_STATUS = {
  0: '启用',
  1: '禁用'
};

@Relax
export default class pointsCustomerList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      _total: number;
      _pageNum: number;
      _pageSize: number;
      customertList: IList;
      initCustomer: Function;
    };
  };

  static relaxProps = {
    _total: '_total',
    _pageNum: '_pageNum',
    _pageSize: '_pageSize',
    customertList: 'customertList',
    initCustomer: noop
  };

  render() {
    const {
      _total,
      _pageNum,
      _pageSize,
      initCustomer,
      customertList
    } = this.props.relaxProps;

    return (
      <DataGrid
        rowKey="customerId"
        dataSource={customertList.toJS()}
        pagination={{
          current: _pageNum,
          pageSize: _pageSize,
          total: _total,
          onChange: (pageNum, pageSize) => {
            initCustomer({ pageNum: pageNum - 1, pageSize });
          }
        }}
      >
        <Column
          title="客户名称"
          key="customerName"
          dataIndex="customerName"
          render={(customerName) => (customerName ? customerName : '-')}
        />

        <Column
          title="客户账号"
          key="customerAccount"
          dataIndex="customerAccount"
        />
        <Column
          title="账号状态"
          key="customerStatus"
          dataIndex="customerStatus"
          render={(customerStatus) =>
            CUSTOMER_STATUS[customerStatus]
              ? CUSTOMER_STATUS[customerStatus]
              : '-'
          }
        />
        <Column
          title="积分余额"
          key="pointsAvailable"
          dataIndex="pointsAvailable"
        />

          <Column
            title="操作"
            render={(rowInfo:any) => {
              return (
                <AuthWrapper functionName="f_customer_points_d">
                  <Link to={`/points-details/${rowInfo.customerId}`}>
                    <span className="ant-dropdown-link">
                      查看
                    </span>
                  </Link>
                </AuthWrapper>
              );
            }}
          />
      </DataGrid>
    );
  }
}
