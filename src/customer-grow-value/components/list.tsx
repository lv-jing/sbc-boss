import * as React from 'react';
import { Relax } from 'plume2';
import { Const, DataGrid, noop } from 'qmkit';
import { IList } from 'typings/globalType';
import Moment from 'moment';

const { Column } = DataGrid;
const serviceTypeName = {
  0: '签到',
  1: '注册',
  2: '分享商品',
  3: '分享注册',
  4: '分享购买',
  5: '评论商品',
  6: '晒单',
  7: '完善基本信息',
  8: '绑定微信',
  9: '添加收货地址',
  10: '关注店铺',
  11: '订单完成'
};

@Relax
export default class CustomerGrowValueList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      total: number;
      pageNum: number;
      pageSize: number;
      growValueList: IList;
      init: Function;
    };
  };

  static relaxProps = {
    total: 'total',
    pageNum: 'pageNum',
    pageSize: 'pageSize',
    growValueList: 'growValueList',
    init: noop
  };

  render() {
    const {
      total,
      pageNum,
      pageSize,
      init,
      growValueList
    } = this.props.relaxProps;
    return (
      <DataGrid
        dataSource={growValueList.toJS()}
        pagination={{
          current: pageNum,
          pageSize,
          total,
          onChange: (pageNum, pageSize) => {
            init({ pageNum: pageNum - 1, pageSize });
          }
        }}
      >
        <Column
          title="序号"
          key="customerId"
          render={(_text, _record, index) => {
            return (pageNum - 1) * pageSize + (index + 1);
          }}
        />

        <Column
          title="获取时间"
          key="opTime"
          dataIndex="opTime"
          render={(opTime) =>
            Moment(opTime)
              .format(Const.TIME_FORMAT)
              .toString()
          }
        />
        <Column
          title="成长值"
          key="growthValue"
          dataIndex="growthValue"
          render={(_text, _record) => {
            return '+' + _text;
          }}
        />

        <Column
          title="业务类型"
          key="serviceType"
          dataIndex="serviceType"
          render={(serviceType) => serviceTypeName[serviceType]}
        />

        <Column
          title="相关单号"
          key="tradeNo"
          dataIndex="tradeNo"
          render={(tradeNo) => (tradeNo ? tradeNo : '-')}
        />
      </DataGrid>
    );
  }
}
