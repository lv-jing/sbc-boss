import React from 'react';
import { Button } from 'antd';
import { Relax } from 'plume2';
import { DataGrid, noop, history } from 'qmkit';
const { Column } = DataGrid;

@Relax
export default class AccountList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      FightmoneyModal: Function;
      accountDetail: any;
    };
  };

  static relaxProps = {
    FightmoneyModal: noop,
    accountDetail: 'accountDetail'
  };

  render() {
    const { accountDetail } = this.props.relaxProps;

    return (
      <div>
        <DataGrid dataSource={accountDetail.toJS()} pagination={false}>
          <Column
            title="序号"
            dataIndex="index"
            key="index"
            render={(_text, _rowData: any, index) => {
              return index + 1;
            }}
          />
          />
          <Column title="银行" dataIndex="bankName" key="bankName" />
          <Column title="账户名" dataIndex="accountName" key="accountName" />
          <Column title="账号" dataIndex="bankNo" key="bankNo" />
          <Column title="支行" dataIndex="bankBranch" key="bankBranch" />
          <Column
            title="是否收到打款"
            dataIndex="isReceived"
            key="isReceived"
            render={(text) => {
              return <span>{text == 0 ? '否' : '是'}</span>;
            }}
          />
          <Column
            title="是否主账号"
            dataIndex="isDefaultAccount"
            key="isDefaultAccount"
            render={(text) => {
              return <span>{text == 0 ? '否' : '是'}</span>;
            }}
          />
          <Column
            title="操作"
            dataIndex="operation"
            key="operation"
            render={(_text, record: any) => {
              return (
                //已经收到打款或者已经打过款，按钮置灰
                record.isReceived == 1 || record.remitPrice ? (
                  <a href="javascript:" style={{ color: '#999' }}>
                    打款
                  </a>
                ) : (
                  <a
                    href="javascript:;"
                    onClick={() => this._handleModel(record)}
                  >
                    打款
                  </a>
                )
              );
            }}
          />
        </DataGrid>
        <div className="bar-button">
          <Button type="primary" onClick={() => history.goBack()}>
            返回
          </Button>
        </div>
      </div>
    );
  }

  /**
   * 打开弹框
   */
  _handleModel = (record) => {
    const { FightmoneyModal } = this.props.relaxProps;
    FightmoneyModal(record);
  };
}
