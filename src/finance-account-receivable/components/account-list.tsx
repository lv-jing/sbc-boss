import * as React from 'react';
import { Relax } from 'plume2';
import { Menu, Dropdown, Icon, Modal, Popconfirm } from 'antd';
import { DataGrid, noop, checkAuth, AuthWrapper } from 'qmkit';
import { List } from 'immutable';

declare type IList = List<any>;
const { Column } = DataGrid;
const confirm = Modal.confirm;

@Relax
export default class AccountList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      loading: boolean;
      dataList: IList;
      onEnable: Function;
      onDisable: Function;
      onDelete: Function;
      onEdit: Function;
      initOffLineAccounts: Function;
    };
  };

  static relaxProps = {
    loading: 'loading',
    dataList: 'dataList',
    init: noop,
    onEnable: noop,
    onDisable: noop,
    onDelete: noop,
    onEdit: noop,
    initOffLineAccounts: noop
  };

  componentWillMount() {
    const { initOffLineAccounts } = this.props.relaxProps;

    initOffLineAccounts();
  }

  render() {
    const { loading, dataList } = this.props.relaxProps;

    return (
      <DataGrid
        loading={loading}
        dataSource={dataList.toJS()}
        rowKey={'accountId'}
      >
        <Column title="账户名称" dataIndex="accountName" key="id" />
        <Column title="开户银行" dataIndex="bankName" key="address" />
        <Column title="银行账号" dataIndex="bankNo" />
        <Column
          title="状态"
          dataIndex="bankStatus"
          render={(status) => (status ? '禁用' : '启用')}
        />
        <Column
          title="操作"
          key="action"
          render={(rowInfo) => this._renderOperate(rowInfo)}
        />
      </DataGrid>
    );
  }

  _renderOperate(rowInfo) {
    const { onEnable, onDisable, onEdit } = this.props.relaxProps;

    let hasMenu =
      checkAuth('editOfflineAccount') ||
      checkAuth('enableDisableOfflineAccount') ||
      checkAuth('deleteOfflineAccount');

    const menu = (
      <Menu>
        <Menu.Item key="0">
          <AuthWrapper functionName="editOfflineAccount">
            <a href="javascript:;" onClick={() => onEdit(rowInfo.accountId)}>
              编辑
            </a>
          </AuthWrapper>
        </Menu.Item>
        <Menu.Item key="1">
          <AuthWrapper functionName="enableDisableOfflineAccount">
            {rowInfo.bankStatus ? (
              <a
                href="javascript:;"
                onClick={() => onEnable(rowInfo.accountId)}
              >
                启用
              </a>
            ) : (
              <Popconfirm
                title="是否确认禁用此收款账户？"
                onConfirm={() => {
                  onDisable(rowInfo.accountId);
                }}
                okText="确定"
                cancelText="取消"
              >
                <a href="javascript:void(0);">禁用</a>
              </Popconfirm>
            )}
          </AuthWrapper>
        </Menu.Item>
        <Menu.Item key="3">
          <AuthWrapper functionName="deleteOfflineAccount">
            <a
              href="javascript:;"
              onClick={() => this._handleDelete(rowInfo.accountId)}
            >
              删除
            </a>
          </AuthWrapper>
        </Menu.Item>
      </Menu>
    );

    return hasMenu ? (
      <Dropdown
        getPopupContainer={() => document.getElementById('page-content')}
        overlay={menu}
        trigger={['click']}
      >
        <a className="ant-dropdown-link" href="javascript:;">
          操作&nbsp;<Icon type="down" />
        </a>
      </Dropdown>
    ) : (
      '-'
    );
  }

  _handleDelete(id) {
    const { onDelete } = this.props.relaxProps;
    confirm({
      title: '提示',
      content: '确定要删除该账户吗？',
      onOk() {
        onDelete(id);
      }
    });
  }
}
