import React from 'react';
import { Relax } from 'plume2';
import { AuthWrapper, Const, noop } from 'qmkit';
import { Modal, Table } from 'antd';
import { IList } from 'typings/globalType';

const confirm = Modal.confirm;
const styles = {
  edit: {
    paddingRight: 10
  }
} as any;

@Relax
export default class CouponList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      couponLoading: boolean;
      couponTotal: number;
      couponPageSize: number;
      couponList: IList;
      couponCurrent: number;
      onDelete: Function;
      onCouponEdit: Function;
      queryPage: Function;
      modifyCouponStatus: Function;
      onCouponDelete: Function;
    };
  };

  static relaxProps = {
    couponLoading: 'couponLoading',
    couponTotal: 'couponTotal',
    couponPageSize: 'couponPageSize',
    couponList: 'couponList',
    couponCurrent: 'couponCurrent',
    onDelete: noop,
    onCouponEdit: noop,
    queryPage: noop,
    modifyCouponStatus: noop,
    onCouponDelete: noop
  };

  render() {
    const {
      couponLoading,
      couponTotal,
      couponPageSize,
      couponList,
      couponCurrent,
      queryPage
    } = this.props.relaxProps;
    return (
      <Table
        rowKey="pointsCouponId"
        loading={couponLoading}
        dataSource={couponList.toJS()}
        columns={this._columns}
        pagination={{
          total: couponTotal,
          pageSize: couponPageSize,
          current: couponCurrent,
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
      key: 'couponName',
      dataIndex: 'couponInfoVO.couponName',
      title: '券名称'
    },
    {
      key: 'denominationStr',
      dataIndex: 'denominationStr',
      title: '券价值（元）'
    },
    {
      key: 'couponValidity',
      dataIndex: 'couponValidity',
      title: '券有效期',
      width: '190px'
    },
    {
      key: 'count',
      dataIndex: 'count',
      title: '券数量\n' + '剩余/总数'
    },
    {
      key: 'pointsCouponTime',
      dataIndex: 'pointsCouponTime',
      title: '兑换时间',
      width: '190px'
    },
    {
      key: 'points',
      dataIndex: 'points',
      title: '兑换积分'
    },
    {
      key: 'pointsCouponStatus',
      dataIndex: 'pointsCouponStatus',
      title: '活动状态',
      render: (pointsCouponStatus) => {
        return Const.activityStatus[pointsCouponStatus];
      }
    },
    {
      key: 'status',
      title: '启用/停用',
      render: (rowInfo) => (rowInfo.status == 0 ? '停用' : '启用')
    },
    {
      key: 'option',
      title: '操作',
      width: '138px',
      render: (rowInfo) => this._getOption(rowInfo)
    }
  ];

  /**
   * 获取操作项
   */
  _getOption = (rowInfo) => {
    return (
      <div>
        <AuthWrapper functionName={'f_points_coupon_modify'}>
          {rowInfo.pointsCouponStatus == 3 && (
            <a
              style={styles.edit}
              onClick={() => this._onEdit(rowInfo.pointsCouponId)}
            >
              编辑
            </a>
          )}
        </AuthWrapper>
        <AuthWrapper functionName={'f_points_coupon_status_modify'}>
          {rowInfo.pointsCouponStatus != 4 && (
            <a
              style={styles.edit}
              onClick={() =>
                this._modifyStatus({
                  id: rowInfo.pointsCouponId,
                  status: rowInfo.status
                })
              }
            >
              {rowInfo.status == 0 ? '启用' : '停用'}
            </a>
          )}
        </AuthWrapper>
        <AuthWrapper functionName={'f_points_coupon_del'}>
          {rowInfo.pointsCouponStatus == 3 && (
            <a onClick={() => this._onDelete(rowInfo.pointsCouponId)}>删除</a>
          )}
        </AuthWrapper>
        {rowInfo.pointsCouponStatus == 4 && '-'}
      </div>
    );
  };

  /**
   * 编辑信息
   */
  _onEdit = (id) => {
    const { onCouponEdit } = this.props.relaxProps;
    onCouponEdit(id);
  };

  /**
   * 启用/停用
   */
  _modifyStatus = ({ id, status }) => {
    const { modifyCouponStatus } = this.props.relaxProps;
    if (status == 0) {
      modifyCouponStatus({ pointsCouponId: id, status: 1 });
    } else if (status == 1) {
      modifyCouponStatus({ pointsCouponId: id, status: 0 });
    }
  };

  /**
   * 单个删除信息
   */
  _onDelete = (id) => {
    const { onCouponDelete } = this.props.relaxProps;
    confirm({
      title: '确认删除',
      content: '是否确认删除？删除后不可恢复。',
      onOk() {
        onCouponDelete(id);
      },
      onCancel() {}
    });
  };
}
