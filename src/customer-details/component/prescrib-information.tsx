import React from 'react';
import { Table, Popconfirm } from 'antd';
import { RCi18n } from 'qmkit';
import { getPrescriberList } from '../webapi';

interface Iprop {
  customerAccount: string;
}

export default class PrescribInformation extends React.Component<Iprop, any> {
  constructor(props: Iprop) {
    super(props);
    this.state = {
      loading: false,
      list: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      }
    };
  }

  componentDidMount() {
    this.getPrescriberList();
  }

  getPrescriberList = () => {
    const { pagination } = this.state;
    this.setState({ loading: true });
    getPrescriberList({
      customerAccount: this.props.customerAccount,
      pageNum: pagination.current - 1,
      pageSize: pagination.pageSize
    })
      .then((data) => {
        this.setState({
          loading: false,
          list: data.res.context.content,
          pagination: {
            ...pagination,
            total: data.res.context.total
          }
        });
      })
      .catch(() => {
        this.setState({
          loading: false
        });
      });
  };

  onTableChange = (pagination) => {
    this.setState(
      {
        pagination: pagination
      },
      () => this.getPrescriberList()
    );
  };

  render() {
    const { list, pagination, loading } = this.state;
    const columns = [
      {
        title: RCi18n({ id: 'PetOwner.PrescriberID' }),
        dataIndex: 'prescriberId',
        key: 'id'
      },
      {
        title: RCi18n({ id: 'PetOwner.PrescriberName' }),
        dataIndex: 'prescriberName',
        key: 'name'
      },
      {
        title: RCi18n({ id: 'PetOwner.PrescriberPhone' }),
        dataIndex: 'phone',
        key: 'phone'
      },
      {
        title: RCi18n({ id: 'PetOwner.PrescriberCity' }),
        dataIndex: 'primaryCity',
        key: 'city'
      },
      {
        title: RCi18n({ id: 'PetOwner.PrescriberType' }),
        dataIndex: 'prescriberType',
        key: 'type'
      }
    ];

    return (
      <div>
        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={list}
          pagination={pagination}
          onChange={this.onTableChange}
        />
      </div>
    );
  }
}
