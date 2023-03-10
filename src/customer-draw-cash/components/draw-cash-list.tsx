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
        {/*????????????*/}
        <Column
          title="????????????"
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

        {/*????????????*/}
        <Column
          width={114}
          title="????????????"
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

        {/*????????????*/}
        {form.get('checkState') === '1' ? (
          <Column
            width={114}
            title="????????????"
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

        {/*????????????/??????*/}
        <Column
          width={128}
          title="????????????/??????"
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

        {/*????????????*/}
        <Column
          title="????????????"
          width={90}
          key="accountStatus"
          render={(rowInfo) => {
            const { accountStatus, forbidReason } = rowInfo;
            if (accountStatus == 1) {
              return (
                <div>
                  <p>{Const.accountStatus[accountStatus]}</p>
                  <Tooltip placement="top" title={forbidReason}>
                    <a href="javascript:;">??????</a>
                  </Tooltip>
                </div>
              );
            } else {
              return <span>{Const.accountStatus[accountStatus]}</span>;
            }
          }}
        />

        {/*????????????*/}
        <Column
          title="????????????"
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

        {/*????????????*/}
        <Column
          title="??????????????????"
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

        {/*????????????*/}
        <Column
          title="????????????"
          width={100}
          key="accountBalance"
          render={(rowInfo) => {
            const { accountBalance } = rowInfo;
            return (
              <div>
                <p>???{accountBalance.toFixed(2)}</p>
              </div>
            );
          }}
        />

        {/*????????????*/}
        <Column
          title="????????????"
          width={128}
          key="drawCashSum"
          render={(rowInfo) => {
            const { drawCashSum } = rowInfo;
            return (
              <div>
                <p>???{drawCashSum.toFixed(2)}</p>
              </div>
            );
          }}
        />

        {/*????????????*/}
        <Column
          width={150}
          title="????????????"
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

        {/*??????????????????*/}
        {form.get('checkState') === '2' ? (
          <Column
            width={128}
            title="??????????????????"
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

        {/*????????????*/}
        {form.get('checkState') === '3' ? (
          <Column
            width={150}
            title="????????????"
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

        {/*???????????????*/}

        {form.get('checkState') === '0' ? (
          <Column
            width={128}
            title="??????"
            key="option"
            render={(rowInfo) => {
              return (
                <div className="operation-box">
                  <AuthWrapper functionName="f_funds_detail">
                    <Link
                      to={`/customer-funds-detail/${rowInfo.customerId}`}
                    >
                      ????????????
                    </Link>
                  </AuthWrapper>

                  <AuthWrapper functionName="f_audit_pass_alone">
                    <Popconfirm
                      title={
                        <div>
                          <h2 style={styles.title}>?????????????????????</h2>
                          <p style={styles.grey}>
                            ?????????????????????????????????????????????????????????.
                          </p>
                        </div>
                      }
                      onConfirm={() => {
                        onConfirm(rowInfo.drawCashId);
                      }}
                      okText="??????"
                      cancelText="??????"
                    >
                      <a style={{ marginRight: 10 }}>??????</a>
                    </Popconfirm>
                  </AuthWrapper>

                  <AuthWrapper functionName="f_audit_reject">
                    <a
                      onClick={() => {
                        setRejectModalVisible(rowInfo.drawCashId, 2);
                      }}
                    >
                      ??????
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
            title="??????"
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
                      ??????
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
