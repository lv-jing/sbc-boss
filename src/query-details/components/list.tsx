import React from 'react';
import { Button } from 'antd';
import { DataGrid } from 'qmkit';
const { Column } = DataGrid;

const data = [
  {
    key: '1',
    index: '1',
    accountName: '提莫破的蘑菇',
    accountNum: '654000000000000',
    source: '中国银行',
    bank: '江苏省南京市建邺区支行',
    confirm: '否',
    main: '是'
  },
  {
    key: '2',
    index: '2',
    accountName: '提莫破的蘑菇',
    accountNum: '654000000000000',
    source: '中国银行',
    bank: '江苏省南京市雨花区支行',
    confirm: '是',
    main: '否'
  }
];
export default class AccountList extends React.Component<any, any> {
  render() {
    return (
      <div>
        <DataGrid dataSource={data}>
          <Column title="序号" dataIndex="index" key="index" />
          <Column title="银行" dataIndex="source" key="source" />
          <Column title="账号名" dataIndex="accountName" key="accountName" />
          <Column title="账号" dataIndex="accountNum" key="accountNum" />

          <Column title="支行" dataIndex="bank" key="bank" />
          <Column title="是否收到打款" dataIndex="confirm" key="confirm" />
          <Column title="是否主账号" dataIndex="main" key="main" />
        </DataGrid>
        <div className="bar-button">
          <Button type="primary">返回</Button>
        </div>
      </div>
    );
  }
}
