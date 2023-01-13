import React from 'react';
import moment from 'moment';
import { Relax } from 'plume2';
import { IList } from 'typings/globalType';
import { DataGrid, noop, Const, history, AuthWrapper, checkAuth } from 'qmkit';

const { Column } = DataGrid;

@Relax
export default class AccountList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      accountList: IList;
      total: number;
      pageNum: number;
      onPagination: Function;
      pageSize: number;
    };
  };

  static relaxProps = {
    accountList: 'accountList',
    total: 'total',
    pageNum: 'pageNum',
    onPagination: noop,
    pageSize: 'pageSize'
  };

  render() {
    const { accountList, pageSize, total, pageNum } = this.props.relaxProps;
    return (
      <div>
        <DataGrid
          dataSource={accountList.toJS()}
          rowKey="index"
          pagination={{
            pageSize,
            total,
            current: pageNum + 1
          }}
          onChange={(pagination) => this._getData(pagination)}
        >
          >
          <Column
            title="序号"
            dataIndex="index"
            key="index"
            render={(_text, _rowData, index) => {
              return pageNum * pageSize + index + 1;
            }}
          />
          />
          <Column
            title="商家名称"
            dataIndex="supplierName"
            key="supplierName"
          />
          <Column title="店铺名称" dataIndex="storeName" key="storeName" />
          <Column
            title="入驻时间"
            dataIndex="applyEnterTime"
            key="applyEnterTime"
            render={(_text, record: any) => {
              return (
                <span>
                  {record.applyEnterTime
                    ? moment(record.applyEnterTime)
                        .format('YYYY-MM-DD HH:mm:ss')
                        .toString()
                    : '无'}
                </span>
              );
            }}
          />
          <Column
            title="合同有效期"
            dataIndex="contractTime"
            key="validity"
            render={(_text, record: any) => {
              return record.contractStartDate ? (
                <div>
                  <span>
                    {moment(record.contractStartDate)
                      .format(Const.DAY_FORMAT)
                      .toString()}
                  </span>
                  <span>---</span>
                  <span>
                    {moment(record.contractEndDate)
                      .format(Const.DAY_FORMAT)
                      .toString()}
                  </span>
                </div>
              ) : (
                <span>-</span>
              );
            }}
          />
          <Column
            title="是否通过打款确认"
            dataIndex="remitAffirm"
            key="remitAffirm"
            render={(text) => {
              return <span>{text == 1 ? '是' : '否'}</span>;
            }}
          />
          <Column
            title="操作"
            dataIndex="operation"
            key="operation"
            render={(_text, record: any) => {
              let hasAuth = false;
              if (
                checkAuth('f_supplier_account_detail_1') ||
                checkAuth('f_supplier_account_detail_2')
              ) {
                hasAuth = true;
              }
              return hasAuth ? (
                record.remitAffirm == 1 ? (
                  <AuthWrapper functionName="f_supplier_account_detail_1">
                    <div>
                      <a
                        href="javascript:;"
                        onClick={() =>
                          this._goConfirm(
                            record.storeId,
                            record.applyEnterTime,
                            'details'
                          )
                        }
                      >
                        查询明细
                      </a>
                    </div>
                  </AuthWrapper>
                ) : (
                  <AuthWrapper functionName="f_supplier_account_detail_2">
                    <div>
                      <a
                        href="javascript:;"
                        onClick={() =>
                          this._goConfirm(
                            record.storeId,
                            record.applyEnterTime,
                            'confirm'
                          )
                        }
                      >
                        账号确认
                      </a>
                    </div>
                  </AuthWrapper>
                )
              ) : (
                '-'
              );
            }}
          />
        </DataGrid>
      </div>
    );
  }

  /**
   * 分页查询
   * @param pageNum
   * @param pageSize
   * @private
   */
  _getData = (pagination) => {
    const { onPagination } = this.props.relaxProps;
    onPagination(pagination.current, pagination.pageSize);
  };

  _goConfirm = (id, time, kind) => {
    history.push({
      pathname: `/confirm-account/${id}`,
      state: { applyEnterTime: time, kind: kind }
    });
  };
}
