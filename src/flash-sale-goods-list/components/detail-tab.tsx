import * as React from 'react';
import { Relax } from 'plume2';
import { Table } from 'antd';
import moment from 'moment';
import { Const, noop } from 'qmkit';

@Relax
export default class DetailTab extends React.Component<any, any> {
  props: {
    relaxProps?: {
      dataList: any;
      loading: boolean;
      total: number;
      pageSize: number;
      current: number;
      getList: Function;
    };
  };

  static relaxProps = {
    dataList: 'dataList',
    loading: 'loading',
    total: 'total',
    pageSize: 'pageSize',
    current: 'current',
    getList: noop
  };

  render() {
    const {
      dataList,
      loading,
      total,
      pageSize,
      current,
      getList
    } = this.props.relaxProps;

    console.log('DetailTab:', moment('2019-06-24'));
    console.log('DetailTab:', moment('09:00'));
    console.log('DetailTab:', moment('2019-06-18 16:00:00.000'));

    return (
      <Table
        rowKey="pointsGoodsId"
        loading={loading}
        dataSource={dataList.toJS()}
        columns={this._columns}
        pagination={{
          total,
          pageSize,
          current: current,
          onChange: (pageNum, pageSize) => {
            getList(pageNum - 1, pageSize);
          }
        }}
      />
    );
  }

  _columns = [
    {
      key: 'goodsInfoName',
      dataIndex: 'goodsInfoName',
      title: '商品名称',
      render: (_text, record) => <div>{record.goodsInfo.goodsInfoName}</div>
    },
    {
      key: 'storeName',
      dataIndex: 'storeName',
      title: '商家名称'
    },
    {
      key: 'specText',
      dataIndex: 'specText',
      title: '商品规格'
    },
    {
      key: 'marketPrice',
      dataIndex: 'marketPrice',
      title: '市场价',
      render: (_text, record) => (
        <div>
          {record.goodsInfo.marketPrice == null
            ? 0
            : record.goodsInfo.marketPrice}
        </div>
      )
    },
    {
      key: 'price',
      dataIndex: 'price',
      title: '抢购价格'
    },
    {
      key: 'option',
      title: '活动结束时间',
      render: (_text, record) => (
        <div>
          {moment(record.activityFullTime)
            .add(2, 'h')
            .format(Const.TIME_FORMAT)}
        </div>
      )
    }
  ];
}
