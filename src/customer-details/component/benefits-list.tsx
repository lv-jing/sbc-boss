import React from 'react';
import { Table } from 'antd';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import { getBenefitsList } from '../webapi';
import { Const } from 'qmkit';
interface Iprop {
  startDate: string;
  endDate: string;
  customerAccount: string;
}
export default class BenefitsList extends React.Component<Iprop, any> {
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
    this.getBebefitsList();
  }
  componentDidUpdate(prevProps) {
    if (
      this.props.startDate !== prevProps.startDate ||
      this.props.endDate !== prevProps.endDate
    ) {
      this.getBebefitsList();
    }
  }

  getBebefitsList = () => {
    const { startDate, endDate, customerAccount } = this.props;
    const { pagination } = this.state;
    this.setState({ loading: true });
    getBenefitsList({
      endDate,
      startDate,
      pageNum: pagination.current - 1,
      pageSize: pagination.pageSize,
      customerAccount
    })
      .then((data) => {
        this.setState({
          loading: false,
          list: data.res.context.subscriptionOrderGiftList,
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
      () => this.getBebefitsList()
    );
  };

  render() {
    const { list, pagination, loading } = this.state;
    const columns = [
      {
        title: <FormattedMessage id="PetOwner.BenefitType" />,
        dataIndex: 'benefitType',
        key: 'BenefitType',
        align: 'center',
        render: (text) => {
          switch (text) {
            case 0:
              return <FormattedMessage id="PetOwner.Gift" />;
            default:
              return text;
          }
        }
      },
      {
        title: <FormattedMessage id="PetOwner.GiftName" />,
        dataIndex: 'giftName',
        key: 'GiftName',
        align: 'center'
      },
      {
        title: <FormattedMessage id="PetOwner.GiftType" />,
        dataIndex: 'giftType',
        key: 'GiftType',
        align: 'center',
        render: (text) => {
          switch (text) {
            case 0:
              return <FormattedMessage id="PetOwner.Welcome box" />;
            case 1:
              return <FormattedMessage id="PetOwner.Consumption gift" />;
            default:
              return text;
          }
        }
      },
      {
        title: <FormattedMessage id="PetOwner.DeliveryNumber" />,
        dataIndex: 'deliveryNumber',
        key: 'DeliveryNumber',
        align: 'center'
      },
      {
        title: <FormattedMessage id="PetOwner.SPU" />,
        dataIndex: 'spuNo',
        key: 'SPUNO',
        align: 'center'
      },
      {
        title: <FormattedMessage id="PetOwner.SKU" />,
        dataIndex: 'skuNo',
        key: 'SKUNO'
      },
      {
        title: <FormattedMessage id="PetOwner.Status" />,
        dataIndex: 'status',
        key: 'Status',
        align: 'center',
        render: (text) => {
          /**
                     * status:
                     0 -> Scheduled
                     1 -> To be delivered
                     2 -> Delivered
                     3 -> Promotion pause
                     4 -> Subscription pause
                     5 -> Subscription cancel
                     6 -> Dismiss
                     * **/
          switch (text) {
            case 0:
              return <FormattedMessage id="PetOwner.Scheduled" />;
            case 1:
              return <FormattedMessage id="PetOwner.To be delivered" />;
            case 2:
              return <FormattedMessage id="PetOwner.Delivered" />;
            case 3:
              return <FormattedMessage id="PetOwner.Promotion pause" />;
            case 4:
              return <FormattedMessage id="PetOwner.Subscription pause" />;
            case 5:
              return <FormattedMessage id="PetOwner.Subscription cancel" />;
            case 6:
              return <FormattedMessage id="PetOwner.Dismiss" />;
            default:
              return text;
          }
        }
      },
      {
        title: <FormattedMessage id="PetOwner.ScheduledTime" />,
        dataIndex: 'scheduledTime',
        key: 'ScheduledTime',
        render: (text) => {
          if (!text) return '';
          return moment(text).format(Const.TIME_FORMAT);
        }
      },
      {
        title: <FormattedMessage id="PetOwner.DeliveryTime" />,
        dataIndex: 'deliveryTime',
        key: 'DeliveryTime',
        align: 'center',
        render: (text) => {
          if (!text) return '';
          return moment(text).format(Const.TIME_FORMAT);
        }
      }
    ];
    return (
      <>
        <Table
          loading={loading}
          rowKey="id"
          columns={columns}
          dataSource={list}
          pagination={pagination}
          onChange={this.onTableChange}
        ></Table>
      </>
    );
  }
}
