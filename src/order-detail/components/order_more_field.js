import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Table, Tooltip } from 'antd';

const order_more_field = (props) => {
  const columns = [
    {
      title: <FormattedMessage id="Order.Recommenderid" />,
      dataIndex: 'recommendationBusinessId',
      key: 'recommendationBusinessId',
      width: '12%'
    },
    {
      title: <FormattedMessage id="Order.Recommendername" />,
      dataIndex: 'recommendationName',
      key: 'recommendationName',
      width: '12%',
      render: (text) => {
        return (
          <Tooltip
            overlayStyle={{
              overflowY: 'auto'
            }}
            placement="bottomLeft"
            title={<div>{text}</div>}
          >
            <p className="overFlowtext" style={{ width: 100 }}>
              {text}
            </p>
          </Tooltip>
        );
      }
    }
  ];
  return (
    <Table
      rowKey={(_record, index) => index.toString()}
      columns={columns}
      dataSource={props.data}
      pagination={false}
      bordered
    />
  );
};

export default order_more_field;
