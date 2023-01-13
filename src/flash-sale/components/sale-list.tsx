import React from 'react';
import { Relax } from 'plume2';
import { Const, history, noop } from 'qmkit';
import { Table } from 'antd';
import { IList } from 'typings/globalType';
import moment from 'moment';

@Relax
export default class SaleList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      loading: boolean;
      total: number;
      pageSize: number;
      dataList: IList;
      current: number;
      getSaleList: Function;
    };
  };

  static relaxProps = {
    loading: 'loading',
    total: 'total',
    pageSize: 'pageSize',
    dataList: 'dataList',
    current: 'current',
    getSaleList: noop
  };

  render() {
    const {
      loading,
      total,
      pageSize,
      dataList,
      current,
      getSaleList
    } = this.props.relaxProps;
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
            getSaleList({ pageNum: pageNum - 1, pageSize });
          }
        }}
      />
    );
  }

  /**
   * 列表数据的column信息
   */
  _columns = [
    {
      key: 'activityDate',
      dataIndex: 'activityDate',
      title: '活动日期'
    },
    {
      key: 'activityTime',
      dataIndex: 'activityTime',
      title: '场次'
    },
    {
      key: 'activityEndTime',
      dataIndex: 'activityEndTime',
      title: '结束时间',
      render: (rowInfo) => {
        return <div>{moment(rowInfo).format(Const.TIME_FORMAT)}</div>;
      }
    },
    {
      key: 'storeNum',
      dataIndex: 'storeNum',
      title: '参与商家数'
    },
    {
      key: 'goodsNum',
      dataIndex: 'goodsNum',
      title: '抢购商品数量'
    },
    {
      key: 'option',
      title: '操作',
      width: '82px',
      render: (record) => {
        return (
          <div>
            <a href="javascript:;"
               onClick={() => this._goto(record)}>
              查看
            </a>
          </div>
        );
      }
    }
  ];

  _goto = (data) => {
    history.push({
      pathname: 'flash-sale-detail',
      state: {
        activityDate: data.activityDate,
        activityTime: data.activityTime,
        storeSum: data.storeNum,
        goodsSum: data.goodsNum
      }
    })
  }
}
