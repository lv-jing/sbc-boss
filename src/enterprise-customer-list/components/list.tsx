import * as React from 'react';
import { IMap, Relax } from 'plume2';
import { fromJS, List } from 'immutable';
import { message, Tooltip } from 'antd';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { AuthWrapper, DataGrid, FindBusiness, noop } from 'qmkit';
import { checkMenu } from '../../../web_modules/qmkit/checkAuth';

declare type IList = List<any>;
const { Column } = DataGrid;

//默认每页展示的数量
const CUSTOMER_STATUS = {
  0: '启用',
  1: '禁用'
};

const STATUS = (status) => {
  if (status === 0) {
    return 1;
  } else if (status === 1) {
    return 0;
  }
};

const STATUS_OPERATE = (status) => {
  if (status === 0) {
    return '禁用';
  } else if (status === 1) {
    return '启用';
  }
};

@withRouter
@Relax
export default class CustomerList extends React.Component<any, any> {
  props: {
    history?: any;
    relaxProps?: {
      loading: boolean;
      dataList: IList;
      total: number;
      pageSize: number;
      currentPage: number;
      onSelect: Function;
      selected: IList;
      init: Function;
      onDelete: Function;
      //审核客户
      onCustomerStatus: Function;
      //启用/禁用
      onCheckStatus: Function;
      form: any;
      supplierNameMap: IMap;
      getSupplierNameByCustomerId: Function;
      setRejectModalVisible: Function;
      setForbidModalVisible: Function;
      crmFlag: boolean;
    };
  };

  static relaxProps = {
    loading: 'loading',
    selected: 'selected',
    total: 'total',
    pageSize: 'pageSize',
    currentPage: 'currentPage',
    dataList: 'dataList',
    onSelect: noop,
    init: noop,
    onDelete: noop,
    onCustomerStatus: noop,
    onCheckStatus: noop,
    form: 'form',
    supplierNameMap: 'supplierNameMap',
    getSupplierNameByCustomerId: noop,
    setRejectModalVisible: noop,
    setForbidModalVisible: noop,
    crmFlag: 'crmFlag'
  };

  componentWillMount() {
    this.setState({
      tooltipVisible: {},
      rejectDomVisible: false
    });
  }

  render() {
    const {
      loading,
      dataList,
      pageSize,
      total,
      currentPage,
      selected,
      onSelect,
      init,
      form,
      supplierNameMap
    } = this.props.relaxProps;
    return (
      <DataGrid
        loading={loading}
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: selected.toJS(),
          onChange: (selectedRowKeys) => {
            onSelect(selectedRowKeys);
          },
          getCheckboxProps: (record) => ({
            disabled: record.customerStatus != 1
          })
        }}
        rowKey="customerId"
        pagination={{
          current: currentPage,
          pageSize,
          total,
          onChange: (pageNum, pageSize) => {
            init({ pageNum: pageNum - 1, pageSize });
          }
        }}
        dataSource={dataList.toJS()}
      >
        <Column
          title="客户名称"
          key="customerName"
          dataIndex="customerName"
          render={(customerName) => (customerName ? customerName : '-')}
        />

        <Column
          title="账号"
          key="customerAccount"
          dataIndex="customerAccount"
          render={(customerAccount, rowData) =>
            fromJS(rowData).get('isDistributor') == 1 ? (
              <div>
                <p>{customerAccount ? customerAccount : '-'}</p>
                <span style={styles.platform}>分销员</span>
              </div>
            ) : (
              <p>{customerAccount ? customerAccount : '-'}</p>
            )
          }
        />

        <Column
          title="公司性质"
          key="businessNatureType"
          dataIndex="businessNatureType"
          render={(businessNatureType) =>
            businessNatureType
              ? FindBusiness.findBusinessNatureName(businessNatureType)
              : '-'
          }
        />
        <Column
          title="公司名称"
          key="enterpriseName"
          dataIndex="enterpriseName"
          render={(enterpriseName) => (enterpriseName ? enterpriseName : '-')}
        />

        <Column
          title="联系人"
          key="contactName"
          dataIndex="contactName"
          render={(contactName) => (contactName ? contactName : '-')}
        />

        <Column
          title="联系方式"
          key="contactPhone"
          dataIndex="contactPhone"
          render={(contactPhone) => (contactPhone ? contactPhone : '-')}
        />

        <Column
          title="平台等级"
          key="customerLevelName"
          dataIndex="customerLevelName"
          render={(customerLevelName) =>
            customerLevelName ? customerLevelName : '-'
          }
        />
        <Column
          title="成长值"
          key="growthValue"
          dataIndex="growthValue"
          render={(growthValue, rowInfo: any) => (
            <Link
              to={{
                pathname: `/customer-grow-value/${rowInfo.customerId as any}/enterpriseCustomer`
              }}
            >
              {growthValue ? growthValue : 0}
            </Link>
          )}
        />

        <Column
          title="审核状态"
          key="enterpriseCheckState"
          dataIndex="enterpriseCheckState"
          render={(enterpriseCheckState, record) => {
            let statusString = <div>-</div>;
            if (enterpriseCheckState == 1) {
              statusString = <div>待审核</div>;
            } else if (enterpriseCheckState == 2) {
              statusString = <div>已审核</div>;
            } else if (enterpriseCheckState == 3) {
              statusString = (
                <div>
                  <p>审核未通过</p>
                  <Tooltip
                    placement="top"
                    title={record['enterpriseCheckReason']}
                  >
                    <a href="javascript:void(0);">原因</a>
                  </Tooltip>
                </div>
              );
            }
            return statusString;
          }}
        />

        {form.get('enterpriseCheckState') === '' ||
        form.get('enterpriseCheckState') === '-1' ||
        form.get('enterpriseCheckState') === '2' ? (
          <Column
            title="账号状态"
            key="customerStatus"
            dataIndex="customerStatus"
            render={(customerStatus, rowData) => {
              const data = fromJS(rowData);
              if (data.get('enterpriseCheckState') == 2) {
                if (customerStatus == 1) {
                  return (
                    <div>
                      <p>禁用</p>
                      <Tooltip placement="top" title={rowData['forbidReason']}>
                        <a href="javascript:void(0);">原因</a>
                      </Tooltip>
                    </div>
                  );
                } else {
                  return <span>{CUSTOMER_STATUS[customerStatus]}</span>;
                }
              } else {
                return <span>-</span>;
              }
            }}
          />
        ) : null}

        <Column
          title="业务员"
          key="employeeName"
          dataIndex="employeeName"
          render={(employeeName) => (employeeName ? employeeName : '-')}
        />

        <Column
          title="操作"
          render={(rowInfo) => {
            return !checkMenu(
              'f_enterprise_customer_list,f_enterprise_customer_detail_view,f_customer_4,f_customer_3'
            ) || rowInfo.enterpriseCheckState == 3 ? (
              <span>-</span>
            ) : (
              this._renderOperation(rowInfo)
            );
          }}
        />
      </DataGrid>
    );
  }

  /**
   * 操作
   */
  _renderOperation = (rowInfo) => {
    const {
      onCheckStatus,
      setRejectModalVisible,
      setForbidModalVisible,
      crmFlag
    } = this.props.relaxProps;
    return (
      <div className="operation-box">
        {/*企业会员审核状态 1：待审核 2：已审核 3：审核未通过*/}
        {rowInfo.enterpriseCheckState == 1 ||
        rowInfo.enterpriseCheckState == 2 ? (
          <>
            {checkMenu(
              'f_enterprise_customer_edit,f_enterprise_customer_detail_view'
            ) && (
              <Link
                style={styles.link}
                to={{
                  pathname: crmFlag
                    ? `/crm-customer-detail/${rowInfo.customerId}`
                    : `/customer-detail/${rowInfo.customerId}`
                }}
              >
                详情
              </Link>
            )}
          </>
        ) : null}
        {rowInfo.enterpriseCheckState == 2 ? (
          <AuthWrapper functionName={'f_enterprise_customer_4'}>
            <a
              style={styles.link}
              href="javascript:void(0);"
              onClick={() => {
                STATUS(rowInfo.customerStatus) == 0
                  ? onCheckStatus(
                      rowInfo.customerId,
                      STATUS(rowInfo.customerStatus)
                    )
                  : setForbidModalVisible(rowInfo.customerId, true);
              }}
            >
              {STATUS_OPERATE(rowInfo.customerStatus)}
            </a>
          </AuthWrapper>
        ) : null}
        {rowInfo.enterpriseCheckState == 1 ? (
          <AuthWrapper functionName={'f_enterprisecustomer_3'}>
            <a
              style={styles.link}
              href="javascript:void(0);"
              onClick={() => {
                this._onCustomerStatus(rowInfo, 2);
              }}
            >
              审核
            </a>
          </AuthWrapper>
        ) : null}
        {rowInfo.enterpriseCheckState == 1 ? (
          <AuthWrapper functionName={'f_enterprisecustomer_3'}>
            <a
             style={styles.link}
              href="javascript:void(0);"
              onClick={() => {
                setRejectModalVisible(rowInfo.customerId, true);
              }}
            >
              驳回
            </a>
          </AuthWrapper>
        ) : null}
      </div>
    );
  };

  /**
   * 审核客户前判断客户信息是否已完善
   * @param rowInfo
   * @param status
   * @private
   */
  _onCustomerStatus = (rowInfo, status) => {
    const { onCustomerStatus } = this.props.relaxProps;
    if (
      !rowInfo.customerName ||
      !rowInfo.contactName ||
      !rowInfo.contactPhone
    ) {
      message.error('请完善客户信息');
    } else {
      onCustomerStatus(rowInfo.customerId, status);
    }
  };
}

const styles = {
  platform: {
    fontSize: 12,
    color: '#fff',
    padding: '1px 3px',
    background: '#F56C1D',
    display: 'inline-block',
    marginLeft: 5
  },
  link:{
    marginLeft:5
  }
};
