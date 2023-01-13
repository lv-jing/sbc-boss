import React from 'react';
import { Relax } from 'plume2';
import { Switch } from 'antd';
import { DataGrid, noop,checkAuth } from 'qmkit';
import styled from 'styled-components';
import { IList } from 'typings/globalType';

const { Column } = DataGrid;

const TableBox = styled.div`
  padding-top: 10px;
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td,
  .ant-table-self tbody td {
    text-align: left;
  }
`;

@Relax
export default class CheckList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      configs: IList;
      switchChange: Function;
    };
  };

  static relaxProps = {
    configs: 'configs',
    switchChange: noop
  };

  render() {
    const { configs, switchChange } = this.props.relaxProps;

    return (
      <TableBox>
        <DataGrid
          dataSource={configs.toJS()}
          pagination={false}
          rowKey={'configType'}
        >
          <Column title="审核类型" dataIndex="checkSorts" key="checkSorts" />
          <Column
            title="说明"
            dataIndex="explain"
            key="account"
            width={'70%'}
          />
          <Column
            title="开关"
            dataIndex="switch"
            key="configType"
            render={(_configType, rowInfo: any) => {
              return (      
              <Switch
                  disabled={!checkAuth('f_checkManage_edit')}
                  checkedChildren="开"
                  unCheckedChildren="关"
                  checked={rowInfo.status == 1}
                  onChange={(e) => switchChange('configs',rowInfo.configType, e)}
                />
              );
            }}
          />
        </DataGrid>
      </TableBox>
    );
  }
}
