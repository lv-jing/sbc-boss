import React from 'react';
import { Relax } from 'plume2';
import { AuthWrapper, DataGrid, noop, RCi18n } from 'qmkit';
import { List } from 'immutable';
import { Popconfirm, Tooltip, Table } from 'antd';
import { checkMenu } from '../../../web_modules/qmkit/checkAuth';
import { FormattedMessage } from 'react-intl';

type TList = List<any>;
const Column  = Table.Column ;

@Relax
export default class EmployeeList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      loading: boolean;
      selected: TList;
      total: number;
      pageSize: number;
      dataList: TList;
      onSelect: Function;
      onDelete: Function;
      onEdit: Function;
      init: Function;
      roles: any;
      onEnable: Function;
      switchModal: Function;
      current: number;
      hide:boolean
    };
  };

  static relaxProps = {
    loading: 'loading',
    total: 'total',
    selected: 'selected',
    pageSize: 'pageSize',
    dataList: 'dataList',
    onDelete: noop,
    onEdit: noop,
    onSelect: noop,
    init: noop,
    roles: 'roles',
    onEnable: noop,
    switchModal: noop,
    current: 'current',
  };

  render() {
    const {
      loading,
      total,
      pageSize,
      selected,
      dataList,
      onSelect,
      init,
      current,
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
            disabled: record.accountName === 'system'
          })
        }}
        rowKey="employeeId"
        pagination={{
          pageSize,
          total,
          current: current,
          onChange: (pageNum, pageSize) => {
            init({ pageNum: pageNum - 1, pageSize });
          }
        }}
        dataSource={dataList.toJS()}
      >
        {/* <Column title="账户名" key="accountName" dataIndex="accountName" /> */}
        <Column

          title={<FormattedMessage id="Setting.EmployeeName" />}
          key="employeeName"
          render={(rowInfo) => (
            <div style={{display:'flex'}}>
               <span>{rowInfo.employeeName}</span>
               {
                  rowInfo.isLeader==1 && <div style={styles.tag}>
                    <FormattedMessage id="Setting.ExecutiveDirector" />
                  </div>
               }
               {
                  rowInfo.isEmployee==0 && <div style={styles.tag}>
                    <FormattedMessage id="Setting.Salesman" />
                  </div>
               }
            </div>
          )}
        />
        <Column
          title={<FormattedMessage id="Setting.EmployeePhone" />}
          key="employeeMobile"
          dataIndex="employeeMobile"
        />
        <Column
          title={<FormattedMessage id="Setting.Mailbox" />}
          key="email"
          dataIndex="email"
          // render={(rowInfo) =><span>{rowInfo&&rowInfo.email?rowInfo.email:'-'}</span>}
        />
        <Column
          title={<FormattedMessage id="Setting.JobNumber" />}
          key="jobNo"
          dataIndex="jobNo"
          // render={(rowInfo) => <span>{rowInfo&&rowInfo.jobNo?rowInfo.jobNo:'-'}</span>}
        />
        <Column
          title={<FormattedMessage id="Setting.Post" />}
          key="position"
          dataIndex="position"
          // render={(rowInfo) =><span>{rowInfo&&rowInfo.position?rowInfo.position:'-'}</span>}
        />
        <Column
          title={<FormattedMessage id="Setting.Role" />}
          key="roleId"
          render={(rowInfo) => <span>{this._renderRole(rowInfo)}</span>}
        />
        {/* <Column
          title="是否业务员"
          key="isEmployee"
          dataIndex="isEmployee"
          render={(isEmployee) => <span>{isEmployee == 0 ? '是' : '否'}</span>}
        /> */}
        <Column
          title={<FormattedMessage id="Setting.state" />}
          key="accountState"
          dataIndex="accountState"
          render={(accountState, rowData) =>
            accountState == 0 ?
              <span>Enable</span>
             :
              accountState == 1 ?
              <div>
                <p>Deactivate</p>
                <Tooltip
                  placement="top"
                  title={rowData['accountDisableReason']}
                >
                  <a href="javascript:void(0);">reason</a>
                </Tooltip>
              </div>:
              <div>
                <span>quit</span>
             </div>
          }
        />

        <Column
          title={<FormattedMessage id="Setting.operate" />}
          render={(rowInfo) => {
            if (rowInfo.accountName == 'system') {
              return <span>-</span>;
            }

            return checkMenu(
              'updateEmployee,enableDisableEmployee,deleteEmployee'
            ) ? (
              this._renderMenu(rowInfo)
            ) : (
              <span>-</span>
            );
          }}
        />
      </DataGrid>
    );
  }

  _renderMenu = (rowInfo: object) => {
    const { onEdit, onDelete, onEnable, switchModal } = this.props.relaxProps;
    const { employeeId, accountState } = rowInfo as any;
    return (
      <div className="operation-box">

         {
           accountState !=2 &&
           <AuthWrapper functionName={'updateEmployee'}>
           <a href="javascript:void(0);" onClick={() => onEdit(employeeId)}>
             edit
           </a>
          </AuthWrapper>
         }

          <AuthWrapper functionName={'deleteEmployee'}>
            <Popconfirm
              title="Are you sure you want to delete this employee and his account? After deletion, he will not be able to log in."
              onConfirm={() => {
                onDelete(employeeId);
              }}
              okText="ok"
              cancelText="cancel"
            >
              <a href="javascript:void(0);">delete</a>
            </Popconfirm>
          </AuthWrapper>

          {
            accountState!=2 &&
            <AuthWrapper functionName={'enableDisableEmployee'}>
            {accountState == 0 ? (
              <a href="javascript:;" onClick={() => switchModal(employeeId)}>
                Deactivate
              </a>
            ) : (
              <a
                href="javascript:void(0);"
                onClick={() => onEnable(employeeId)}
              >
                Enable
              </a>
            )}
          </AuthWrapper>
          }

          {
            accountState==2 &&
            <a
            href="javascript:void(0);"
            onClick={() => onEdit(employeeId)}
            >
              check
           </a>
          }

      </div>
    );
  };

  _renderRole = (rowInfo) => {
    const { roles } = this.props.relaxProps;
    if (rowInfo.accountName === 'system') {
      return RCi18n({ id: 'Setting.SystemAdministrator' })
    }
    //所有的角色id集合
    const allIds = roles.map(v=>{return v.get('roleInfoId')}).toJS();
    const roleIds = rowInfo.roleIds?rowInfo.roleIds.split(',').reduce((pre,cur)=>{
      if(allIds.includes(Number(cur))){
        pre.push(cur);
      }
      return pre;
    },[]):[];
    const roleName =  roleIds.length>0 && roleIds.reduce((pre,current)=>{
      const role = roles.find((role) => role.get('roleInfoId') == current);
      if(role && role.get('roleName')){
        pre = pre + role.get('roleName') + ';';
      }
      return pre;
    },'');
    return roleIds.length>0? roleName.substr(0,roleName.length-1):'-'
  };
}

const styles={
  tag:{
    border:'1px solid #F56C1D',
    color:'#F56C1D',
    justifyContent:'center',
    alignItems:'center',
    marginLeft:5,
    borderRadius:5,
    padding:'1px 3px'
  }
}
