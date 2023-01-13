import React from 'react';
import { AuthWrapper, DataGrid, noop } from 'qmkit';
import { Relax } from 'plume2';
import { Tooltip, Popconfirm } from 'antd';

const { Column } = DataGrid;

@Relax
export default class CRMGroupList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      crmGroupList: any;
      getCustomGroup: Function;
      openModal: Function;
      deleteCustomGroup: Function;
      currentPage: number;
      total: number;
      pageSize: number;
      onTabChange: Function;
      areaIds: any;
      setSmsModal: Function;
      setGroupSmsInfo: Function;
    };
  };

  static relaxProps = {
    crmGroupList: 'crmGroupList',
    getCustomGroup: noop,
    openModal: noop,
    deleteCustomGroup: noop,
    currentPage: 'currentPage',
    total: 'total',
    pageSize: 'pageSize',
    areaIds: 'areaIds',
    onTabChange: noop,
    setSmsModal: noop,
    setGroupSmsInfo: noop
  };

  constructor(props) {
    super(props);
  }
  render() {
    const {
      crmGroupList,
      getCustomGroup,
      openModal,
      deleteCustomGroup,
      currentPage,
      total,
      pageSize,
      onTabChange
    } = this.props.relaxProps;
    return (
      <DataGrid
        dataSource={crmGroupList}
        rowKey="id"
        pagination={{
          pageSize,
          total,
          current: currentPage,
          onChange: (currentPage, pageSize) => {
            onTabChange({
              pageNum: currentPage - 1,
              pageSize: pageSize,
              key: '2'
            });
          }
        }}
      >
        <Column title="人群名称" dataIndex="groupName" />
        <Column
          width="60%"
          title="人群定义"
          dataIndex="definition"
          render={(data) => (
            <Tooltip title={data}>
              <div className="definition">{data}</div>
            </Tooltip>
          )}
        />
        <Column title="会员人数" dataIndex="customerCount" />
        <Column
          title="操作"
          dataIndex="id"
          render={(id, data) => (
            <div>
              <AuthWrapper functionName={'f-group-sms'}>
                <a
                  href="javascript:;"
                  onClick={() => {
                    this._sendSms(data);
                  }}
                >
                  短信群发
                </a>
                {'  '}
              </AuthWrapper>
              <a
                href="javascript:;"
                onClick={() => {
                  openModal(2);
                  getCustomGroup(id);
                }}
              >
                编辑
              </a>
              {'  '}
              <Popconfirm
                title="确认要删除？"
                onConfirm={() => {
                  deleteCustomGroup(id);
                }}
                okText="确定"
                cancelText="取消"
              >
                <a href="javascript:;">删除</a>
              </Popconfirm>
            </div>
          )}
        />
      </DataGrid>
    );
  }

  _sendSms = async (groupData) => {
    const { setSmsModal, setGroupSmsInfo } = this.props.relaxProps;
    await setGroupSmsInfo({
      groupId: groupData.id,
      groupName: groupData.groupName,
      customerNum: groupData.customerCount,
      sendGroupType: 1
    });
    await setSmsModal();
  };
}
