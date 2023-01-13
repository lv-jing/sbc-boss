import React from 'react';
import { Relax } from 'plume2';
import { FormattedMessage } from 'react-intl';
import { Tooltip, Table } from 'antd';
import styled from 'styled-components';
import {
  noop,
  DataGrid,
  Const,
  history,
  QMMethod,
  AuthWrapper,
  checkAuth
} from 'qmkit';
import { IList } from 'typings/globalType';
import moment from 'moment';

const COMPANY_TYPE = {
  0: <FormattedMessage id="Store.PlatformProprietary" />,
  1: <FormattedMessage id="Store.ThirdParty" />
};

const AUDIT_STATE = {
  0: <FormattedMessage id="Store.ToAudit" />,
  1: <FormattedMessage id="Store.Reviewed" />,
  2: <FormattedMessage id="Store.FailedAudit" />
};

const ACCOUNT_STATE = {
  0: <FormattedMessage id="Store.Open" />,
  1: <FormattedMessage id="Store.Disable" />
};

const STORE_STATE = {
  0: <FormattedMessage id="Store.Open" />,
  1: <FormattedMessage id="Store.CloseShop" />
};

const Column = Table.Column;

const Operation = styled.div`
  a {
    padding-right: 5px;
  }
`;
const ErrorText = styled.p`
  color: #f04134;
`;
@Relax
export default class List extends React.Component<any, any> {
  props: {
    relaxProps?: {
      infos: IList;
      pageSize: number;
      pageNum: number;
      total: number;
      loading: any;
      switchModal: Function;
      initSuppliers: Function;
      reject: Function;
      switchStore: Function;
    };
  };

  static relaxProps = {
    // 商家列表
    infos: 'infos',
    // 每页展示数量
    pageSize: 'pageSize',
    // 当前页
    pageNum: 'pageNum',
    // 总数量
    total: 'total',
    loading: 'loading',
    // 展示/隐藏弹框
    switchModal: noop,
    // 初始化商家列表
    initSuppliers: noop,
    // 启用/禁用账号
    reject: noop,
    // 开店/关店
    switchStore: noop
  };

  render() {
    const { infos, pageSize, pageNum, total, initSuppliers, loading } =
      this.props.relaxProps;
    return (
      <div>
        <DataGrid
          dataSource={infos.toJS()}
          loading={loading}
          pagination={{
            pageSize,
            total,
            current: pageNum,
            onChange: (pageNum, pageSize) => {
              initSuppliers({ pageNum: pageNum - 1, pageSize });
            }
          }}
        >
          <Column
            title={<FormattedMessage id="Store.MerchantNumber" />}
            dataIndex="companyCode"
            key="companyCode"
          />
          <Column
            title={<FormattedMessage id="Store.MerchantAccount" />}
            dataIndex="accountName"
            key="accountName"
            render={(text) => (
              <p>{text ? QMMethod.encryptionEmail(text) : '-'}</p>
            )}
          />
          <Column
            title={<FormattedMessage id="Store.StoreName" />}
            dataIndex="storeName"
            key="storeName"
            render={(text) => <p>{text ? text : '-'}</p>}
          />
          <Column
            title={<FormattedMessage id="Store.MerchantType" />}
            dataIndex="companyType"
            key="companyType"
            render={(rowInfo) => (
              <p>{rowInfo || rowInfo == 0 ? COMPANY_TYPE[rowInfo] : '-'}</p>
            )}
          />
          {/* <Column
            title={<FormattedMessage id="Store.SigningTime" />}
            dataIndex="contractStartDate"
            key="contractStartDate"
            render={(rowInfo) => {
              return (
                <div>
                  <p>
                    {rowInfo ? moment(rowInfo).format(Const.TIME_FORMAT) : '-'}
                  </p>
                </div>
              );
            }}
          />
          <Column
            title={<FormattedMessage id="Store.ExpirationTime" />}
            dataIndex="contractEndDate"
            key="contractEndDate"
            render={(rowInfo) => {
              return (
                <div>
                  <p>
                    {rowInfo ? moment(rowInfo).format(Const.TIME_FORMAT) : '-'}
                  </p>
                </div>
              );
            }}
          /> */}
          <Column
            title={<FormattedMessage id="Store.AuditStatus" />}
            dataIndex="auditState"
            key="auditState"
            render={(text, record: any) => {
              return (
                <div>
                  <p>{text || text == 0 ? AUDIT_STATE[text] : '-'}</p>
                  {text == 2 && (
                    <Tooltip placement="topLeft" title={record.auditReason}>
                      <a href="javascript:;">reason</a>
                    </Tooltip>
                  )}
                </div>
              );
            }}
          />
          <Column
            title={<FormattedMessage id="Store.AccountStatus" />}
            dataIndex="accountState"
            key="accountState"
            render={(text, record: any) => {
              return (
                <div>
                  <p>{text || text == 0 ? ACCOUNT_STATE[text] : '-'}</p>
                  {text == 1 && (
                    <Tooltip
                      placement="topLeft"
                      title={record.accountDisableReason}
                    >
                      <a href="javascript:;">reason</a>
                    </Tooltip>
                  )}
                </div>
              );
            }}
          />
          <Column
            title={<FormattedMessage id="Store.StoreStatus" />}
            dataIndex="storeState"
            key="storeState"
            render={(text, record: any) => {
              return (
                <div>
                  {text == 1 ? (
                    <div>
                      <ErrorText>
                        {STORE_STATE[text]}
                        {moment(record.contractEndDate).isBefore(moment()) &&
                          '-Expired'}
                      </ErrorText>
                      <Tooltip
                        placement="topLeft"
                        title={record.storeClosedReason}
                      >
                        <a href="javascript:;">reason</a>
                      </Tooltip>
                    </div>
                  ) : (
                    <p>
                      {moment(record.contractEndDate).isBefore(moment())
                        ? 'Expired'
                        : text || text == 0
                        ? STORE_STATE[text]
                        : '-'}
                    </p>
                  )}
                </div>
              );
            }}
          />
          <Column
            fixed={'right'}
            title={<FormattedMessage id="Store.Operation" />}
            dataIndex="operation"
            key="operation"
            render={(_text, record: any) => {
              return checkAuth('f_supplier_audit') ||
                checkAuth('f_supplier_detail_1') ||
                checkAuth('f_supplier_edit_1') ||
                checkAuth('f_supplier_list_2') ? (
                <Operation>
                  {record.auditState || record.auditState == 0 ? (
                    record.auditState == 0 ? (
                      <AuthWrapper functionName="f_supplier_audit">
                      </AuthWrapper>
                    ) : record.auditState == 2 ? (
                      <AuthWrapper functionName="f_supplier_detail_1">
                        <a
                          href="javascript:;"
                          onClick={() => this._detail(record.storeId)}
                        >
                          {' '}
                          <FormattedMessage id="Store.Check" />
                        </a>
                      </AuthWrapper>
                    ) : (
                      <div>
                        <AuthWrapper functionName="f_supplier_detail_1">
                          <a
                            href="javascript:;"
                            onClick={() => this._detail(record.storeId)}
                          >
                            {' '}
                            <FormattedMessage id="Store.Check" />
                          </a>
                        </AuthWrapper>
                      </div>
                    )
                  ) : (
                    '-'
                  )}
                </Operation>
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
   * 显示/禁用弹框
   */
  _showModal = ({ modalType, id, state }) => {
    const { switchModal, reject, switchStore } = this.props.relaxProps;
    // 如果开始状态是账号启用/店铺开启, 点击展示弹框
    if (state == 0) {
      switchModal({ modalType, id });
    } else if (state == 1) {
      // 如果开始状态是账号禁用/店铺关闭, 点击直接操作
      // 启用账号
      if (modalType == 0) {
        reject({ companyInfoId: id, accountState: 0 });
      } else if (modalType == 1) {
        //店铺开启
        switchStore({ storeId: id, storeState: 0 });
      }
    }
  };

  /**
   * 审核/查看
   */
  _detail = (sid) => {
    history.push('/supplier-detail/' + sid);
  };

  /**
   * 编辑
   */
  _edit = (sid) => {
    history.push(`/supplier-edit/${sid}`);
  };
}
