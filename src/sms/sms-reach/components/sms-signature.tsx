import React from 'react';
import { DataGrid, history, noop } from 'qmkit';
import { Relax, IMap } from 'plume2';
import { List } from 'immutable';
import { Button, Popconfirm, Tooltip } from 'antd';
type TList = List<IMap>;
const { Column } = DataGrid;
const STATUS = ['待审核', '审核通过', '未通过'];

@Relax
export default class SMSSignature extends React.Component<any, any> {
  props: {
    relaxProps?: {
      signatureList: TList;
      deleteSign: Function;
      setData: Function;
      syncSign: Function;
      pageNum: number;
      pageSize: number;
      total: number;
      getSignList: Function;
    };
  };

  static relaxProps = {
    signatureList: 'signatureList',
    deleteSign: noop,
    setData: noop,
    syncSign: noop,
    pageNum: 'pageNum',
    pageSize: 'pageSize',
    total: 'total',
    getSignList: noop
  };

  constructor(props) {
    super(props);
  }
  render() {
    const {
      signatureList,
      deleteSign,
      total,
      pageSize,
      pageNum,
      getSignList
    } = this.props.relaxProps;
    return (
      <div className="sms-signature">
        <Button
          type="primary"
          className="btn"
          onClick={() => {
            history.push({ pathname: '/add-signature' });
          }}
        >
          新增短信签名
        </Button>
        <Button
          className="btn"
          onClick={() => {
            this.props.relaxProps.syncSign();
          }}
        >
          同步签名状态
        </Button>
        <Button className="btn" onClick={this._showSyncModal}>
          同步历史签名
        </Button>
        <DataGrid
        className="sign-table"
          dataSource={signatureList.toJS()}
          pagination={{
            pageSize,
            total,
            current: pageNum,
            onChange: (pageNum, pageSize) => {
              getSignList(pageNum - 1, pageSize);
            }
          }}
        >
          <Column title="签名" dataIndex="smsSignName" key="smsSignName" />
          <Column
            title="申请说明"
            dataIndex="remark"
            key="remark"
            width={'40%'}
            render={(content) => <div className="sms-content">{content}</div>}
          />
          <Column
            title="状态"
            dataIndex="reviewStatus"
            key="reviewStatus"
            render={(value, record: any) => {
              return (
                <div>
                  <p>{STATUS[value]}</p>
                  {value === 2 && (
                    <Tooltip placement="topLeft" title={record.reviewReason}>
                      <a href="javascript:;">原因</a>
                    </Tooltip>
                  )}
                </div>
              );
            }}
          />
          <Column
            title="操作"
            dataIndex="id"
            key="id"
            render={(id, record: any) => {
              if (record.reviewStatus === 0) {
                return '-';
              }
              return (
                <div>
                  {record.reviewStatus === 2 && (
                    <a href={`/add-signature/${id}`}>编辑</a>
                  )}
                  {'  '}
                  <Popconfirm
                    title="确认要删除？"
                    onConfirm={() => {
                      deleteSign(id);
                    }}
                    okText="确定"
                    cancelText="取消"
                  >
                    <a href="javascript:; ">删除</a>
                  </Popconfirm>
                </div>
              );
            }}
          />
        </DataGrid>
      </div>
    );
  }

  _showSyncModal = () => {
    this.props.relaxProps.setData('syncType', 0);
    this.props.relaxProps.setData('syncModalVisible', true);
  };
}
