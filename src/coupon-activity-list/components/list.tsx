import React from 'react';
import { Link } from 'react-router-dom';
import { Relax } from 'plume2';
import moment from 'moment';
import { AuthWrapper, Const, DataGrid, noop } from 'qmkit';
import { IList } from 'typings/globalType';
import { Popconfirm } from 'antd';

@Relax
export default class List extends React.Component<any, any> {
  props: {
    relaxProps?: {
      total: number;
      pageNum: number;
      pageSize: number;
      couponActivityList: IList;
      deleteActivity: Function;
      init: Function;
      pauseActivity: Function;
      startActivity: Function;
      levelList: IList;
    };
  };

  static relaxProps = {
    total: 'total',
    pageNum: 'pageNum',
    pageSize: 'pageSize',
    couponActivityList: 'couponActivityList',
    deleteActivity: noop,
    init: noop,
    pauseActivity: noop,
    startActivity: noop,
    levelList: 'levelList'
  };

  render() {
    const {
      total,
      pageNum,
      pageSize,
      couponActivityList,
      init
    } = this.props.relaxProps;
    return (
      <DataGrid
        rowKey={(record) => record.activityId}
        dataSource={couponActivityList.toJS()}
        pagination={{
          current: pageNum,
          pageSize,
          total,
          onChange: (pageNum, pageSize) => {
            init({ pageNum: pageNum - 1, pageSize });
          }
        }}
      >
        <DataGrid.Column
          title="优惠券活动名称"
          dataIndex="activityName"
          key="activityName"
        />
        <DataGrid.Column
          title="活动类型"
          dataIndex="couponActivityType"
          key="couponActivityType"
          render={(text) => {
            return Const.couponActivityType[text];
          }}
        />
        <DataGrid.Column
          title="开始/结束时间"
          dataIndex="startTime"
          key="startTime"
          render={(text, record) => {
            return (
              <div>
                <p>
                  {text
                    ? moment(text)
                      .format(Const.TIME_FORMAT)
                      .toString()
                    : '-'}
                </p>
                <p>
                  {(record as any).endTime
                    ? moment((record as any).endTime)
                      .format(Const.TIME_FORMAT)
                      .toString()
                    : '-'}
                </p>
              </div>
            );
          }}
        />
        <DataGrid.Column
          title="目标客户"
          dataIndex="joinLevel"
          key="joinLevel"
          render={(text) => {
            return this.showTargetCustomer(text);
          }}
        />
        <DataGrid.Column
          title="活动状态"
          dataIndex="pauseFlag"
          key="pauseFlag"
          render={(text) => {
            return Const.activityStatus[text];
          }}
        />
        <DataGrid.Column
          title="操作"
          key="operate"
          dataIndex="pauseFlag"
          render={(text, record) => {
            return this.operator(text, record);
          }}
        />
      </DataGrid>
    );
  }

  /**
   * 展示目标客户
   */
  showTargetCustomer(text) {
    const { levelList } = this.props.relaxProps;
    if (text == null) {
      return;
    }
    if (-1 == text) {
      return '全平台客户';
    } else if (-2 == text) {
      return '指定客户';
    } else if (+text === -3) {
      return '指定人群';
    } else if (-4 == text) {
      return '企业会员';
    } else {
      let str = '';
      text.split(',').forEach((item) => {
        const level = levelList.find((i) => i.get('key') == item);
        if (level == null) {
          return;
        }
        str = str + level.get('value') + ',';
      });
      str = str.substring(0, str.length - 1);
      if (str == '') {
        str = '-';
      }
      return str;
    }
  }

  /**
   * 操作按钮
   * @param record
   * @returns {any}
   */
  private operator(text, record: any) {
    if (+record.joinLevel === -3) {
      return (
        <div>
          <AuthWrapper functionName={'f_authority-manage_list'}>
            <Link
              to={`/add-crowd-operations/activityId-${record.activityId}/0`}
            >
              查看
            </Link>
          </AuthWrapper>
        </div>
      );
    }
    const {
      startActivity,
      pauseActivity,
      deleteActivity
    } = this.props.relaxProps;
    let activityType = 'all-present';
    if (record.couponActivityType == 1) {
      activityType = 'specify';
    } else if (record.couponActivityType == 3) {
      activityType = 'registered';
    } else if (record.couponActivityType == 7) {
      activityType = 'registered-qyg';
    }
    const url = `/coupon-activity-${activityType}/${
      (record as any).activityId
      }`;
    return record.couponActivityType == 4 ? (
      <div>
        <AuthWrapper functionName={'f_authority-manage_list'}>
          <Link to={'/customer-equities'}>查看</Link>
        </AuthWrapper>
      </div>
    ) : record.couponActivityType == 6 ? (
      <div>
        <AuthWrapper functionName={'f_coupon_activity_detail'}>
          <Link
            to={`/coupon-activity-detail/${record.activityId}/${record.couponActivityType}`}
          >
            查看
          </Link>
        </AuthWrapper>
      </div>
    ) : (
          <div>
            <AuthWrapper functionName={'f_coupon_activity_detail'}>
              <Link
                to={`/coupon-activity-detail/${record.activityId}/${record.couponActivityType}`}
              >
                查看
          </Link>
            </AuthWrapper>
            <AuthWrapper functionName={'f_coupon_activity_editor'}>
              {activityType != 'specify' && text == 1 && (
                <a
                  href="javascript:void(0);"
                  onClick={() => {
                    pauseActivity(record.activityId);
                  }}
                  style={{ marginLeft: 10 }}
                >
                  暂停
            </a>
              )}
              {activityType != 'specify' && text == 2 && (
                <a
                  href="javascript:void(0);"
                  onClick={() => {
                    startActivity(record.activityId);
                  }}
                  style={{ marginLeft: 10 }}
                >
                  开始
            </a>
              )}
              {text == 3 && (
                <Link to={url} style={{ marginLeft: 10 }}>
                  编辑
            </Link>
              )}
              {text == 3 && (
                <Popconfirm
                  title="确定删除该活动？"
                  onConfirm={() => deleteActivity(record.activityId)}
                  okText="确定"
                  cancelText="取消"
                >
                  <a href="javascript:void(0);" style={{ marginLeft: 10 }}>删除</a>
                </Popconfirm>
              )}
            </AuthWrapper>
          </div>
        );
  }
}
