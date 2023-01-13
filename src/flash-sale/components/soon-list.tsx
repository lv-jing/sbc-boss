import React from 'react';
import { Relax } from 'plume2';
import { Const, history } from 'qmkit';
import { Table } from 'antd';
import { IList } from 'typings/globalType';
import moment from 'moment';

@Relax
export default class SoonList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      //loading: boolean;
      dataList: IList;
      activityKey:string
    };
  };

  static relaxProps = {
    //loading: 'loading',
    dataList: 'dataList',
    activityKey:'activityKey'
  };

  shouldComponentUpdate(nextProps,nextState){
    if(nextProps.relaxProps.activityKey!=this.props.relaxProps.activityKey){
      return false;
    }
    return true;    
 };

  render() {
    const { dataList } = this.props.relaxProps;
    return (
      <Table
        //loading={loading}
        dataSource={dataList.toJS()}
        columns={this._columns}
        pagination={false}
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
