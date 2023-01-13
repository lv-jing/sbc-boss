import React from 'react';
import { IMap, Relax } from 'plume2';
import { Popover, Table, Tooltip } from 'antd';
import { Const, noop } from 'qmkit';
import { IList } from 'typings/globalType';
import moment from 'moment';

const payTypeDic = {
  0: '线上支付',
  1: '线下支付'
};

const payOrderStatusDic = {
  0: '已付款',
  1: '未付款',
  2: '待确认'
};

/**
 * 订单收款记录
 */
@Relax
export default class OrderReceive extends React.Component<any, any> {
  props: {
    relaxProps?: {
      detail: IMap;
      payRecord: IList;
      destroyOrder: Function;
      onConfirm: Function;
    };
  };
  constructor(props) {
    super(props);
  }

  static relaxProps = {
    detail: 'detail',
    payRecord: 'payRecord',
    destroyOrder: noop,
    onConfirm: noop
  };

  //收款列表
  receiveColumns = [
    {
      title: '收款流水号',
      dataIndex: 'receivableNo',
      key: 'receivableNo'
    },
    {
      title: '收款时间',
      dataIndex: 'receiveTime',
      key: 'receiveTime',
      render: (receiveTime) =>
        receiveTime &&
        moment(receiveTime)
          .format(Const.TIME_FORMAT)
          .toString()
    },
    {
      title: '实扣积分',
      dataIndex: 'payOrderPoints',
      key: 'payOrderPoints',
      render: (text, record) =>
        record.payOrderStatus == 1 ? '' : text || 0
    },
    {
      title: '支付方式',
      dataIndex: 'payType',
      key: 'payType',
      render: (payType) => payTypeDic[payType]
    },
    {
      title: '收款账户',
      dataIndex: 'receivableAccount',
      key: 'receivableAccount',
      render: (receivableAccount) =>
        receivableAccount ? receivableAccount : '-'
    },
    {
      title: '附件',
      dataIndex: 'encloses',
      key: 'encloses',
      render: (encloses) =>
        encloses ? (
          <Popover
            key={'encloses'}
            placement="topRight"
            title={''}
            trigger="click"
            content={<img style={styles.attachmentView} src={encloses} />}
          >
            <a href="javascript:;">
              <img style={styles.attachment} src={encloses} />
            </a>
          </Popover>
        ) : (
          '无'
        )
    },
    {
      title: '状态',
      dataIndex: 'payOrderStatus',
      key: 'payOrderStatus',
      render: (payOrderStatus) => payOrderStatusDic[payOrderStatus]
    },
    {
      title: '备注',
      dataIndex: 'comment',
      key: 'comment',
      render: (comment) => (
        <span>
          {comment ? (
            <Tooltip title={this._renderComment(comment)} placement="top">
              <a href="javascript:void(0);">查看</a>
            </Tooltip>
          ) : (
            '无'
          )}
        </span>
      )
    }
  ];

  render() {
    const { detail, payRecord } = this.props.relaxProps;
    const id = detail.get('id');
    const totalPayPoints = detail.getIn(['tradePrice', 'points']) || 0;

    return (
      <div style={styles.container}>
        <div style={styles.addReceive}>
          <div style={styles.orderInfo}>
            <label style={styles.orderNum}>
              订单号：{id}&nbsp;&nbsp;&nbsp;&nbsp; 应扣积分：{
              totalPayPoints || 0 }
            </label>
          </div>
        </div>
        <div>
          <Table
            columns={this.receiveColumns}
            dataSource={payRecord.toJS()}
            pagination={false}
            bordered
          />
        </div>
      </div>
    );
  }

  _renderComment(comment) {
    return <span>{comment}</span>;
  }
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 10
  },
  addReceive: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    marginBottom: 10,
    padding: 15
  },
  orderInfo: {
    display: 'flex',
    flexGrow: 7,
    alignItems: 'center'
  },
  addReceiveButton: {
    display: 'flex',
    flexGrow: 3,
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  orderNum: {
    fontSize: 14
  } as any,
  attachment: {
    width: 30,
    height: 30
  },
  attachmentView: {
    maxWidth: 500,
    maxHeight: 400
  }
} as any;
