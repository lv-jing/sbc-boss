import React from 'react';
import { IList } from 'typings/globalType';
import { Relax } from 'plume2';
import { DataGrid, noop, Const } from 'qmkit';
import Moment from 'moment';
const { Column } = DataGrid;
// type 0:普通方式 1:订单相关 2:退单相关
let serviceTypeName = {
  0: { desc: '签到', type: 0 },
  1: { desc: '注册', type: 0 },
  2: { desc: '分享商品', type: 0 },
  3: { desc: '分享注册', type: 0 },
  4: { desc: '分享购买', type: 0 },
  5: { desc: '评论商品', type: 0 },
  6: { desc: '晒单', type: 0 },
  7: { desc: '完善基本信息', type: 0 },
  8: { desc: '绑定微信', type: 0 },
  9: { desc: '添加收货地址', type: 0 },
  10: { desc: '关注店铺', type: 0 },
  11: { desc: '订单完成', type: 1 },
  12: { desc: '订单抵扣', type: 1 },
  13: { desc: '优惠券兑换', type: 1 },
  14: { desc: '积分兑换', type: 1 },
  15: { desc: '退单返还', type: 2 },
  16: { desc: '订单取消返还', type: 1 },
  17: { desc: '过期扣除', type: 0 },
  18: { desc: '客户导入', type: 0 },
  19: { desc: '权益发放', type: 0 }
};
@Relax
export default class pointsDetailList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      total: number;
      pageNum: number;
      pageSize: number;
      pointsDetailList: IList;
      init: Function;
    };
  };

  static relaxProps = {
    total: 'total',
    pageNum: 'pageNum',
    pageSize: 'pageSize',
    pointsDetailList: 'pointsDetailList',
    init: noop
  };

  render() {
    const {
      total,
      pageNum,
      pageSize,
      init,
      pointsDetailList
    } = this.props.relaxProps;

    return (
      <DataGrid
        rowKey={(record) => record.id}
        dataSource={pointsDetailList.toJS()}
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
          title="交易时间"
          key="opTime"
          dataIndex="opTime"
          render={(opTime) =>
            Moment(opTime)
              .format(Const.TIME_FORMAT)
              .toString()
          }
        />
        <Column title="积分数" key="points" dataIndex="points" />
        <Column
          title="增/减"
          key="type"
          dataIndex="type"
          render={(type) =>
            type === 0 ? (
              <span style={{ color: '#ea1a24' }}>减少</span>
            ) : (
              <span style={{ color: '#3ee209' }}>增加</span>
            )
          }
        />
        <Column
          title="交易内容"
          key="serviceType"
          dataIndex="serviceType"
          render={(serviceType, rowInfo: any) => {
            const info = serviceTypeName[serviceType];
            if (info.type == 0) {
              return info.desc;
            } else if (info.type == 1) {
              return `${info.desc}(订单号:${
                JSON.parse(rowInfo.content).orderNo
              })`;
            } else if (info.type == 2) {
              return `${info.desc}(退单号:${
                JSON.parse(rowInfo.content).returnOrderNo
              })`;
            }
            return '';
          }}
        />
        <Column
          title="积分余额"
          key="pointsAvailable"
          dataIndex="pointsAvailable"
        />
      </DataGrid>
    );
  }
}
