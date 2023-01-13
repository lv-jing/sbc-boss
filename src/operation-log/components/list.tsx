import React from 'react';
import { Relax } from 'plume2';
import { Pagination, Spin, Tooltip, Table } from 'antd';
import { List } from 'immutable';
import moment from 'moment';

import { Const, noop } from 'qmkit';
import { FormattedMessage } from 'react-intl';
import { IMap } from 'plume2/es6/typings/typing';

type TList = List<any>;

@Relax
export default class ListView extends React.Component<any, any> {
  props: {
    relaxProps?: {
      loading: boolean;
      total: number;
      pageSize: number;
      currentPage: number;
      dataList: IMap;
      init: Function;
    };
  };

  static relaxProps = {
    loading: 'loading',
    //当前的数据总数
    total: 'total',
    //当前的分页条数
    pageSize: 'pageSize',
    currentPage: 'currentPage',
    //当前的客户列表
    dataList: 'dataList',

    init: noop
  };
  render() {
    const {
      loading,
      total,
      pageSize,
      dataList,
      init,
      currentPage
    } = this.props.relaxProps;

    const columns = [
      {
        title: <FormattedMessage id='Setting.OperatorAccount' />,
        dataIndex: 'opAccount',
        key: 'opAccount'
      },
      {
        title: <FormattedMessage id='Setting.OperatorName' />,
        dataIndex: 'opName',
        key: 'opName'
      },
      {
        title: <FormattedMessage id='Setting.OperationIp' />,
        dataIndex: 'opIp',
        key: 'opIp'
      },
      {
        title: <FormattedMessage id='Setting.OperationTime' />,
        dataIndex: 'opTime',
        key: 'opTime',
        render: (text) => {
          return <span>{
            moment(text)
              .format(Const.TIME_FORMAT)
              .toString()
          }</span>;
        }
      },
      {
        title: <FormattedMessage id='Setting.modular' />,
        dataIndex: 'opModule',
        key: 'opModule'
      },
      {
        title: <FormattedMessage id='Setting.OperationType' />,
        dataIndex: 'opCode',
        key: 'opCode'
      },
      {
        title: <FormattedMessage id='Setting.OperationContent' />,
        dataIndex: 'opContext',
        key: 'opContext',
        ellipsis: true,
      }
    ];

    return (
      <div>
        <div className='ant-table-wrapper'>
          <Table
            dataSource={dataList}
            columns={columns}
            loading={loading}
            pagination={false}
            rowKey={(record) => record.id}
          />
          {total > 0 ? (
            <Pagination
              current={currentPage}
              total={total}
              pageSize={pageSize}
              showSizeChanger={true}
              defaultPageSize={pageSize}
              pageSizeOptions={['10', '20', '30', '50', '100']}
              onChange={(pageNum, pageSize) => {
                init({ pageNum: pageNum - 1, pageSize });
              }}
              onShowSizeChange={(current, pageSize) => {
                init({ pageNum: current - 1, pageSize });
              }}
            />
          ) : null}
        </div>
      </div>
    );
  }
}
