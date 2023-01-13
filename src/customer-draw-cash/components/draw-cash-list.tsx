import * as React from 'react';
import { Relax } from 'plume2';
import { AuthWrapper, Const, DataGrid, noop } from 'qmkit';
import { List } from 'immutable';
import { Link } from 'react-router-dom';
import momnet from 'moment';
import { Popconfirm, Tooltip } from 'antd';

declare type IList = List<any>;
const { Column } = DataGrid;

@Relax
export default class DrawCashList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      loading: boolean;
      dataList: IList;
      pageSize: number;
      pageNum: number;
      total: number;
      onSelect: Function;
      selected: IList;
      form: any;
      init: Function;
      onAuditStatus: Function;
      setRejectModalVisible: Function;
      tryAgain: Function;
      setFormField: Function;
      currentPage: number;
      onConfirm: Function;
    };
  };

  static relaxProps = {
    loading: 'loading',
    dataList: 'dataList',
    pageSize: 'pageSize',
    pageNum: 'pageNum',
    total: 'total',
    selected: 'selected',
    onSelect: noop,
    form: 'form',
    init: noop,
    onAuditStatus: noop,
    setRejectModalVisible: noop,
    tryAgain: noop,
    setFormField: noop,
    currentPage: 'currentPage',
    onConfirm: noop
  };

  render() {
    const {
      loading,
      dataList,
      init,
      pageSize,
      currentPage,
      total,
      selected,
      form,
      setRejectModalVisible,
      onSelect,
      tryAgain,
      onConfirm
    } = this.props.relaxProps;
    return (
      <DataGrid
        className="resetTable"
        loading={loading}
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: selected.toJS(),
          // getCheckboxProps: () => ({
          //   disabled: form.get('checkState') != '0'
          // }),
          onChange: (selectedRowKeys) => {
            onSelect(selectedRowKeys);
          }
        }}
        dataSource={dataList.toJS()}
        rowKey="drawCashId"
        pagination={{
          current: currentPage,
          pageSize,
          total,
          onChange: (pageNum, pageSize) => {
            init({ pageNum: pageNum - 1, pageSize });
          }
        }}
      >
        {/*提现单号*/}
        <Column
          title="提现单号"
          width={110}
          key="drawCashNo"
          render={(rowInfo) => {
            const { drawCashNo } = rowInfo;
            return (
              <div>
                <p>{drawCashNo}</p>
              </div>
            );
          }}
        />

        {/*申请时间*/}
        <Column
          width={114}
          title="申请时间"
          key="applyTime"
          render={(rowInfo) => {
            const { applyTime } = rowInfo;
            return (
              <div>
                <p>
                  {applyTime
                    ? momnet(applyTime)
                        .format(Const.DAY_FORMAT)
                        .toString()
                    : ''}
                </p>
                <p>
                  {applyTime
                    ? momnet(applyTime)
                        .format(Const.ONLY_TIME_FORMAT)
                        .toString()
                    : ''}
                </p>
              </div>
            );
          }}
        />

        {/*完成时间*/}
        {form.get('checkState') === '1' ? (
          <Column
            width={114}
            title="完成时间"
            key="finishTime"
            render={(rowInfo) => {
              const { finishTime } = rowInfo;
              return (
                <div>
                  <p>
                    {finishTime
                      ? momnet(finishTime)
                          .format(Const.DAY_FORMAT)
                          .toString()
                      : ''}
                  </p>
                  <p>
                    {finishTime
                      ? momnet(finishTime)
                          .format(Const.ONLY_TIME_FORMAT)
                          .toString()
                      : ''}
                  </p>
                </div>
              );
            }}
          />
        ) : null}

        {/*会员名称/账号*/}
        <Column
          width={128}
          title="会员名称/账号"
          key="customerAccount"
          render={(rowInfo) => {
            const { customerAccount, customerName } = rowInfo;
            return (
              <div>
                <p>{customerName}</p>
                <p>{customerAccount}</p>
              </div>
            );
          }}
        />

        {/*账号状态*/}
        <Column
          title="账号状态"
          width={90}
          key="accountStatus"
          render={(rowInfo) => {
            const { accountStatus, forbidReason } = rowInfo;
            if (accountStatus == 1) {
              return (
                <div>
                  <p>{Const.accountStatus[accountStatus]}</p>
                  <Tooltip placement="top" title={forbidReason}>
                    <a href="javascript:;">原因</a>
                  </Tooltip>
                </div>
              );
            } else {
              return <span>{Const.accountStatus[accountStatus]}</span>;
            }
          }}
        />

        {/*提现渠道*/}
        <Column
          title="提现渠道"
          width={90}
          key="drawCashChannel"
          render={(rowInfo) => {
            const { drawCashChannel } = rowInfo;
            return (
              <div>
                <p>{Const.drawCashChannel[drawCashChannel]}</p>
              </div>
            );
          }}
        />

        {/*提现渠道*/}
        <Column
          title="提现账户名称"
          width={128}
          key="drawCashAccount"
          render={(rowInfo) => {
            const { drawCashAccountName, drawCashAccount } = rowInfo;
            return (
              <div>
                <p>{drawCashAccountName}</p>
                <p>{drawCashAccount}</p>
              </div>
            );
          }}
        />

        {/*账户余额*/}
        <Column
          title="账户余额"
          width={100}
          key="accountBalance"
          render={(rowInfo) => {
            const { accountBalance } = rowInfo;
            return (
              <div>
                <p>￥{accountBalance.toFixed(2)}</p>
              </div>
            );
          }}
        />

        {/*本次提现*/}
        <Column
          title="本次提现"
          width={128}
          key="drawCashSum"
          render={(rowInfo) => {
            const { drawCashSum } = rowInfo;
            return (
              <div>
                <p>￥{drawCashSum.toFixed(2)}</p>
              </div>
            );
          }}
        />

        {/*提现备注*/}
        <Column
          width={150}
          title="提现备注"
          key="drawCashRemark"
          render={(rowInfo) => {
            const { drawCashRemark } = rowInfo;
            return (
              <div>
                <p>{drawCashRemark}</p>
              </div>
            );
          }}
        />

        {/*提现失败原因*/}
        {form.get('checkState') === '2' ? (
          <Column
            width={128}
            title="提现失败原因"
            key="drawCashFailedReason"
            render={(rowInfo) => {
              const { drawCashFailedReason } = rowInfo;
              return (
                <div>
                  <p>{drawCashFailedReason}</p>
                </div>
              );
            }}
          />
        ) : null}

        {/*驳回原因*/}
        {form.get('checkState') === '3' ? (
          <Column
            width={150}
            title="驳回原因"
            key="rejectReason"
            render={(rowInfo) => {
              const { rejectReason } = rowInfo;
              return (
                <div>
                  <p>{rejectReason}</p>
                </div>
              );
            }}
          />
        ) : null}

        {/*操作组按钮*/}

        {form.get('checkState') === '0' ? (
          <Column
            width={128}
            title="操作"
            key="option"
            render={(rowInfo) => {
              return (
                <div className="operation-box">
                  <AuthWrapper functionName="f_funds_detail">
                    <Link
                      to={`/customer-funds-detail/${rowInfo.customerId}`}
                    >
                      余额明细
                    </Link>
                  </AuthWrapper>

                  <AuthWrapper functionName="f_audit_pass_alone">
                    <Popconfirm
                      title={
                        <div>
                          <h2 style={styles.title}>确定审核通过？</h2>
                          <p style={styles.grey}>
                            审核通过后，系统将会自动向提现账户打款.
                          </p>
                        </div>
                      }
                      onConfirm={() => {
                        onConfirm(rowInfo.drawCashId);
                      }}
                      okText="确认"
                      cancelText="取消"
                    >
                      <a style={{ marginRight: 10 }}>审核</a>
                    </Popconfirm>
                  </AuthWrapper>

                  <AuthWrapper functionName="f_audit_reject">
                    <a
                      onClick={() => {
                        setRejectModalVisible(rowInfo.drawCashId, 2);
                      }}
                    >
                      驳回
                    </a>
                  </AuthWrapper>
                </div>
              );
            }}
          />
        ) : null}

        {form.get('checkState') === '2' ? (
          <Column
            width={50}
            title="操作"
            key="option"
            render={(rowInfo) => {
              return (
                <AuthWrapper functionName="f_try_again">
                  <div>
                    <a
                      onClick={() => {
                        tryAgain(rowInfo.drawCashId);
                      }}
                    >
                      重试
                    </a>
                  </div>
                </AuthWrapper>
              );
            }}
          />
        ) : null}
      </DataGrid>
    );
  }
}

const styles = {
  title: {
    fontSize: 14
  },
  grey: {
    color: '#666',
    fontSize: 12
  }
};
