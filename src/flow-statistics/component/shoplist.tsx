import React from 'react';
import { IMap, Relax } from 'plume2';

import { DataGrid, noop } from 'qmkit';

const { Column } = DataGrid;

@Relax
export default class FlowShoptatisticsList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      pageData: IMap;
      dateRange: IMap;
      getStorePageData: Function;
      pageSize: number;
      sortedInfo: IMap;
    };
  };

  static relaxProps = {
    pageData: 'pageData',
    dateRange: 'dateRange',
    getStorePageData: noop,
    pageSize: 'pageSize',
    sortedInfo: 'sortedInfo'
  };

  constructor(props) {
    super(props);
    this.state = {
      pageSize: 10
    };
  }

  render() {
    const { pageData } = this.props.relaxProps;
    const sortedInfo = this.props.relaxProps.sortedInfo.toJS();
    const { pageSize } = this.state;
    return (
      <DataGrid
        dataSource={
          pageData.get('content') ? pageData.get('content').toJS() : []
        }
        onChange={(pagination, filters, sorter) =>
          this._handleOnChange(pagination, filters, sorter)
        }
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '30', '40'],
          total: pageData.get('totalElements'),
          pageSize: pageSize,
          current: pageData.get('number') + 1
        }}
      >
        <Column title="店铺名称" key="title" dataIndex="title" />
        <Column title="访客数UV" key="totalUv" dataIndex="totalUv" />
        <Column
          title="浏览量PV"
          key="totalPv"
          dataIndex="totalPv"
          sorter={true}
          sortOrder={sortedInfo.columnKey === 'totalPv' && sortedInfo.order}
        />
        <Column title="商品访客数" key="skuTotalUv" dataIndex="skuTotalUv" />
        <Column
          title="商品浏览量"
          key="skuTotalPv"
          dataIndex="skuTotalPv"
          sorter={true}
          sortOrder={sortedInfo.columnKey === 'skuTotalPv' && sortedInfo.order}
        />
      </DataGrid>
    );
  }

  _handleOnChange = (pagination, _filters, sorter) => {
    const { getStorePageData } = this.props.relaxProps;

    let pageCurrent = pagination.current;
    const { pageSize } = this.state;
    const sortedInfo = this.props.relaxProps.sortedInfo.toJS();
    if (sortedInfo) {
      if (
        sorter.columnKey != sortedInfo.columnKey ||
        sorter.order != sortedInfo.order
      ) {
        pageCurrent = 1;
      }
    }
    if (pageSize !== pagination.pageSize) {
      pageCurrent = 1;
    }
    //店铺流量报表
    getStorePageData(
      pageCurrent,
      pagination.pageSize,
      sorter.columnKey,
      sorter.order
    );
    this.setState({ pageSize: pagination.pageSize });
  };
}
