import React from 'react';
import { IMap, Relax } from 'plume2';
import {
  Table,
  Dropdown,
  Icon,
  Menu,
  Popconfirm,
  Popover,
  Tooltip
} from 'antd';
import styled from 'styled-components';
import { DataGrid, noop, Const, checkAuth, AuthWrapper } from 'qmkit';
import { List } from 'immutable';
import moment from 'moment';

type TList = List<any>;
declare type IList = List<any>;

const Column = Table.Column;
const TableBox = styled.div`
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td,
  .ant-table-self tbody td {
    padding: 16px 8px;
  }
`;
@Relax
export default class TaxList extends React.Component<any, any> {
  props: {
    form?: any;
    relaxProps?: {
      loading: boolean;
      selected: IList;
      total: number;
      pageSize: number;
      dataList: TList;
      searchForm: IMap;

      init: Function;
      destroyByInvoiceId: Function;
      switchModal: Function;
      confirmByInvoiceId: Function;
      deleteByInvoiceId: Function;
      onSelect: Function;
    };
  };

  static relaxProps = {
    loading: 'loading',
    total: 'total',
    pageSize: 'pageSize',
    dataList: 'dataList',
    searchForm: 'searchForm',

    init: noop,
    destroyByInvoiceId: noop,
    switchModal: noop,
    confirmByInvoiceId: noop,
    deleteByInvoiceId: noop,
    selected: 'selected',
    onSelect: noop
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {
      total,
      pageSize,
      dataList,
      init,
      loading,
      selected,
      onSelect,
      searchForm
    } = this.props.relaxProps;

    const checkState = searchForm.get('checkState');

    return (
      <TableBox>
        <DataGrid
          loading={loading}
          rowSelection={
            checkState === '0' && {
              type: 'checkbox',
              selectedRowKeys: selected.toJS(),
              onChange: (selectedRowKeys) => {
                onSelect(selectedRowKeys);
              }
            }
          }
          rowKey="customerInvoiceId"
          pagination={{
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
            dataIndex="customerName"
            key="customerName"
            width="8%"
          />
          <Column
            title="申请时间"
            dataIndex="createTime"
            key="createTime"
            render={(createTime) => (
              <div>
                {moment(createTime)
                  .format(Const.TIME_FORMAT)
                  .toString()
                  .split(' ')
                  .map((v) => {
                    return <span style={{ display: 'block' }}>{v}</span>;
                  })}
              </div>
            )}
            width="10%"
          />

          <Column
            title="单位名称"
            dataIndex="companyName"
            key="companyName"
            width="10%"
          />

          <Column
            title="纳税人识别码"
            dataIndex="taxpayerNumber"
            key="taxpayerNumber"
            width="10%"
          />

          <Column
            title="注册地址"
            dataIndex="companyAddress"
            key="companyAddress"
            width="12%"
          />

          <Column
            title="注册电话"
            dataIndex="companyPhone"
            key="companyPhone"
            width="9%"
          />

          <Column
            title="银行基本户号"
            dataIndex="bankNo"
            key="bankNo"
            width="11%"
          />

          <Column
            title="开户银行"
            dataIndex="bankName"
            key="bankName"
            width="10%"
          />

          <Column
            title="资质证件"
            render={(rowInfo) => this._renderImage(rowInfo)}
            width="6%"
          />

          <Column
            title="审核状态"
            render={(rowData) => this._renderCheckState(rowData)}
            width="7%"
          />

          <Column
            title="操作"
            render={(rowInfo) => this._renderOperate(rowInfo)}
            width="6%"
          />
        </DataGrid>
      </TableBox>
    );
  }

  _renderOperate(rowInfo) {
    const { checkState, customerInvoiceId } = rowInfo;
    const { destroyByInvoiceId, deleteByInvoiceId } = this.props.relaxProps;

    //待确认
    if (checkState == 0) {
      return (
        <Dropdown
          overlay={this._renderMenu(customerInvoiceId)}
          trigger={['click']}
        >
          <a className="ant-dropdown-link" href="#">
            操作 <Icon type="down" />
          </a>
        </Dropdown>
      );
    } else if (checkState == 1) {
      //已审核
      return (
        <AuthWrapper functionName="changeInvoice">
          <Popconfirm
            title="确定作废已选增票资质？"
            onConfirm={() => destroyByInvoiceId(customerInvoiceId)}
            okText="确定"
            cancelText="取消"
          >
            <a href="javascript:void(0);">作废</a>
          </Popconfirm>
        </AuthWrapper>
      );
    } else {
      //审核未通过
      return (
        <AuthWrapper functionName="deleteInvoice">
          <Popconfirm
            title="确定删除已选增票资质？"
            onConfirm={() => deleteByInvoiceId(customerInvoiceId)}
            okText="确定"
            cancelText="取消"
          >
            <a href="javascript:void(0);">删除</a>
          </Popconfirm>
        </AuthWrapper>
      );
    }
  }

  _renderMenu = (id: string) => {
    const { confirmByInvoiceId, switchModal } = this.props.relaxProps;
    return (
      <Menu>
        {checkAuth('changeInvoice') && (
          <Menu.Item key="0">
            <Popconfirm
              title="是否确认通过已选增票资质?"
              onConfirm={() => confirmByInvoiceId(id)}
              okText="确定"
              cancelText="取消"
            >
              <a href="javascript:void(0);">审核</a>
            </Popconfirm>
          </Menu.Item>
        )}

        {checkAuth('changeInvoice') && (
          <Menu.Item key="1">
            <a href="javascript:void(0);" onClick={() => switchModal(id)}>
              驳回
            </a>
          </Menu.Item>
        )}
        <Menu.Divider />
      </Menu>
    );
  };

  _renderImage = (rowInfo) => {
    return (
      <Popover
        key={rowInfo.orderInvoiceId}
        placement="topLeft"
        title={'资质证件'}
        trigger="click"
        content={
          <div>
            <img
              style={styles.attachmentView}
              src={
                rowInfo.businessLicenseImg
                  ? JSON.parse(rowInfo.businessLicenseImg)[0].url
                  : ''
              }
            />
            <img
              style={styles.attachmentView}
              src={
                rowInfo.taxpayerIdentificationImg
                  ? JSON.parse(rowInfo.taxpayerIdentificationImg)[0].url
                  : ''
              }
            />
          </div>
        }
      >
        <a href="javascript:;">查看</a>
      </Popover>
    );
  };

  _renderCheckState = (rowInfo) => {
    switch (rowInfo.checkState) {
      case 0:
        return <span>待审核</span>;
      case 1:
        return <span>已审核</span>;
      case 2:
        return (
          <div>
            <p>审核未通过</p>
            <Tooltip
              placement="top"
              title={
                rowInfo.invalidFlag == 1 ? '作废' : rowInfo['rejectReason']
              }
            >
              <a href="javascript:void(0);">原因</a>
            </Tooltip>
          </div>
        );
      default:
        return '';
    }
  };
}

const styles = {
  attachment: {
    width: 30,
    height: 30
  },
  attachmentView: {
    width: 400,
    height: 400
  }
};
