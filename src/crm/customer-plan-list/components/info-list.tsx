import React from 'react';
import { Relax } from 'plume2';
import { noop, Const, AuthWrapper, history } from 'qmkit';
import { Modal, Table } from 'antd';
import Moment from 'moment';
import { IList } from 'typings/globalType';

const confirm = Modal.confirm;
const styles = {
  edit: {
    paddingRight: 10
  }
} as any;

@Relax
export default class InfoList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      loading: boolean;
      total: number;
      pageSize: number;
      dataList: IList;
      current: number;
      checkedIds: IList;
      onSelect: Function;
      onDelete: Function;
      onPause: Function;
      onStart: Function;
      onEdit: Function;
      queryPage: Function;
    };
  };

  static relaxProps = {
    loading: 'loading',
    total: 'total',
    pageSize: 'pageSize',
    dataList: 'dataList',
    current: 'current',
    checkedIds: 'checkedIds',
    onSelect: noop,
    onDelete: noop,
    onPause: noop,
    onStart: noop,
    onEdit: noop,
    queryPage: noop
  };

  render() {
    const {
      loading,
      total,
      pageSize,
      dataList,
      current,
      queryPage
    } = this.props.relaxProps;
    return (
      <Table
        rowKey="id"
        loading={loading}
        dataSource={dataList.toJS()}
        columns={this._columns}
        pagination={{
          total,
          pageSize,
          current: current,
          onChange: (pageNum, pageSize) => {
            queryPage({ pageNum: pageNum - 1, pageSize });
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
      key: 'planName',
      dataIndex: 'planName',
      title: '计划名称'
    },
    {
      key: 'startDate',
      dataIndex: 'startDate',
      title: '计划时间',
      render: (_text, record) => {
        return (
          (record.startDate
            ? Moment(record.startDate)
              .format(Const.DAY_FORMAT)
              .toString()
            : '-') +
          '~' +
          (record.endDate
            ? Moment(record.endDate)
              .format(Const.DAY_FORMAT)
              .toString()
            : '-')
        );
      }
    },
    {
      key: 'receiveValueName',
      dataIndex: 'receiveValueName',
      title: '目标人群'
    },
    {
      key: 'triggerConditions',
      dataIndex: 'triggerConditions',
      title: '触发条件',
      render: (triggerConditions) => {
        if (triggerConditions) {
          let triggerConditionValue = '无';
          triggerConditions.forEach((triggerCondition) => {
            if (triggerCondition == 0) {
              return '无';
            } else if (triggerCondition == 1) {
              triggerConditionValue = '有访问';
            } else if (triggerCondition == 2) {
              triggerConditionValue = '有收藏';
            } else if (triggerCondition == 3) {
              triggerConditionValue = '有加购';
            } else if (triggerCondition == 4) {
              triggerConditionValue = '有下单';
            } else if (triggerCondition == 5) {
              triggerConditionValue = '有付款';
            }
          });
          return triggerConditionValue;
        }
      }
    },
    {
      key: 'pointFlag',
      dataIndex: 'pointFlag',
      title: '权益礼包',
      render: (_text, record) => {
        let pointsCouponInfo = '';
        if (record.pointFlag) {
          pointsCouponInfo = record.points + '积分;';
        }
        if (record.couponFlag) {
          pointsCouponInfo =
            pointsCouponInfo + record.couponDiscount + '元优惠券';
        }
        return pointsCouponInfo;
      }
    },
    {
      key: 'planStatus',
      dataIndex: 'planStatus',
      title: '状态',
      render: (planStatus) => {
        if (planStatus == 0) {
          return '未开始';
        } else if (planStatus == 1) {
          return '进行中';
        } else if (planStatus == 2) {
          return '暂停中';
        } else if (planStatus == 3) {
          return '已结束';
        }
      }
    },
    {
      key: 'option',
      title: '操作',
      align: 'right',
      render: (rowInfo) => this._getOption(rowInfo)
    }
  ];

  /**
   * 获取操作项
   */
  _getOption = (rowInfo) => {
    if (rowInfo.planStatus == 0) {
      return (
        <div>
          <AuthWrapper functionName={'f-customer-plan-data'}>
            <a style={styles.edit} onClick={() => history.push(`/operational-planning/${rowInfo.id}`)}>数据</a>
          </AuthWrapper>
          <AuthWrapper functionName={'f-customer-plan-detail'}>
            <a
              style={styles.edit}
              onClick={() => this._onEdit(rowInfo.id, false)}
            >
              详情
            </a>
          </AuthWrapper>
          <AuthWrapper functionName={'f-customer-plan-modify'}>
            <a
              style={styles.edit}
              onClick={() => this._onEdit(rowInfo.id, true)}
            >
              编辑
            </a>
          </AuthWrapper>
          <AuthWrapper functionName={'f-customer-plan-delete'}>
            <a onClick={() => this._onDelete(rowInfo.id)}>删除</a>
          </AuthWrapper>
        </div>
      );
    } else if (rowInfo.planStatus == 1) {
      return (
        <div>
          <AuthWrapper functionName={'f-customer-plan-data'}>
            <a style={styles.edit} onClick={() => history.push(`/operational-planning/${rowInfo.id}`)}>数据</a>
          </AuthWrapper>
          <AuthWrapper functionName={'f-customer-plan-detail'}>
            <a
              style={styles.edit}
              onClick={() => this._onEdit(rowInfo.id, false)}
            >
              详情
            </a>
          </AuthWrapper>
          <AuthWrapper functionName={'f-customer-plan-pause'}>
            <a onClick={() => this._onPause(rowInfo.id)}>暂停</a>
          </AuthWrapper>

        </div>
      );
    } else if (rowInfo.planStatus == 2) {
      return (
        <div>
          <AuthWrapper functionName={'f-customer-plan-data'}>
            <a style={styles.edit} onClick={() => history.push(`/operational-planning/${rowInfo.id}`)}>数据</a>
          </AuthWrapper>
          <AuthWrapper functionName={'f-customer-plan-detail'}>
            <a
              style={styles.edit}
              onClick={() => this._onEdit(rowInfo.id, false)}
            >
              详情
            </a>
          </AuthWrapper>
          <AuthWrapper functionName={'f-customer-plan-start'}>
            <a onClick={() => this._onStart(rowInfo.id)}>开始</a>
          </AuthWrapper>
        </div>
      );
    } else if (rowInfo.planStatus == 3) {
      return (
        <div>
          <AuthWrapper functionName={'f-customer-plan-data'}>
            <a style={styles.edit} onClick={() => history.push(`/operational-planning/${rowInfo.id}`)}>数据</a>
          </AuthWrapper>
          <AuthWrapper functionName={'f-customer-plan-detail'}>
            <a
              onClick={() => this._onEdit(rowInfo.id, false)}
            >
              详情
            </a>
          </AuthWrapper>
        </div>
      );
    }
  };

  /**
   * 编辑信息
   */
  _onEdit = (id, ifModify) => {
    const { onEdit } = this.props.relaxProps;
    onEdit(id, ifModify);
  };

  /**
   * 单个删除信息
   */
  _onDelete = (id) => {
    const { onDelete } = this.props.relaxProps;
    confirm({
      title: '确认删除',
      content: '是否确认删除？删除后不可恢复。',
      onOk() {
        onDelete(id);
      },
      onCancel() { }
    });
  };

  /**
   * 暂停运营计划
   */
  _onPause = (id) => {
    const { onPause } = this.props.relaxProps;
    confirm({
      title: '确认暂停',
      content: '是否确认暂停运营计划？',
      onOk() {
        onPause(id);
      },
      onCancel() { }
    });
  };

  /**
   * 启动运营计划
   */
  _onStart = (id) => {
    const { onStart } = this.props.relaxProps;
    confirm({
      title: '确认启动',
      content: '是否确认启动运营计划？',
      onOk() {
        onStart(id);
      },
      onCancel() { }
    });
  };
}
