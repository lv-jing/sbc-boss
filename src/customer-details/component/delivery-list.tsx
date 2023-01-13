import React from 'react';
import { Table, Popconfirm, Button, Tooltip } from 'antd';
import { FormattedMessage } from 'react-intl';
import { RCi18n } from 'qmkit';
import { getAddressListByType, delAddress } from '../webapi';

interface Iprop {
  customerId: string;
  type: 'DELIVERY' | 'BILLING';
  onEdit?: Function;
}

const NEW_ADDRESS_TEMPLATE = {
  firstName: '',
  lastName: '',
  consigneeNumber: '',
  postCode: '',
  countryId: null,
  region: '',
  province: '',
  city: '',
  address1: '',
  address2: '',
  entrance: '',
  apartment: '',
  rfc: ''
};

export default class DeliveryList extends React.Component<Iprop, any> {
  constructor(props: Iprop) {
    super(props);
    this.state = {
      loading: false,
      list: []
    };
  }

  componentDidMount() {
    this.getAddressList();
  }

  getAddressList = () => {
    this.setState({
      loading: true
    });
    getAddressListByType(this.props.customerId, this.props.type)
      .then((data) => {
        this.setState({
          loading: false,
          list: data.res.context.customerDeliveryAddressVOList
        });
      })
      .catch(() => {
        this.setState({
          loading: false
        });
      });
  };

  onDeleteAddress = (id: string) => {
    this.setState({
      loading: true
    });
    delAddress(id)
      .then((data) => {
        this.getAddressList();
      })
      .catch(() => {
        this.setState({
          loading: false
        });
      });
  };

  render() {
    const { loading, list } = this.state;
    const { onEdit } = this.props;
    const columns = [
      {
        title: RCi18n({ id: 'PetOwner.ReceiverName' }),
        dataIndex: 'consigneeName',
        key: 'name'
      },
      {
        title: RCi18n({ id: 'PetOwner.PhoneNumber' }),
        dataIndex: 'consigneeNumber',
        key: 'phone'
      },
      {
        title: RCi18n({ id: 'PetOwner.PostalCode' }),
        dataIndex: 'postCode',
        key: 'postcode'
      },
      {
        title: RCi18n({ id: 'PetOwner.Address' }),
        dataIndex: 'address1',
        key: 'address'
      },
      // {
      //   title: RCi18n({ id: 'PetOwner.Operation' }),
      //   key: 'oper',
      //   render: (_, record) => (
      //     <div>
      //       {/* <Tooltip title={RCi18n({ id: 'PetOwner.Edit' })}>
      //         <Button
      //           type="link"
      //           size="small"
      //           onClick={() => onEdit({ ...NEW_ADDRESS_TEMPLATE, ...record })}
      //         >
      //           <i className="iconfont iconEdit"></i>
      //         </Button>
      //       </Tooltip> */}
      //       {/* {record.canDelFlag && (
      //         <Popconfirm
      //           placement="topRight"
      //           title={RCi18n({ id: 'PetOwner.DeleteThisItem' })}
      //           onConfirm={() => this.onDeleteAddress(record.deliveryAddressId)}
      //           okText={RCi18n({ id: 'PetOwner.Confirm' })}
      //           cancelText={RCi18n({ id: 'PetOwner.Cancel' })}
      //         >
      //           <Tooltip title={RCi18n({ id: 'PetOwner.Delete' })}>
      //             <Button type="link" size="small">
      //               <i className="iconfont iconDelete"></i>
      //             </Button>
      //           </Tooltip>
      //         </Popconfirm>
      //       )} */}
      //     </div>
      //   )
      // }
    ];

    return (
      <div>
        {/* <Button
          type="primary"
          onClick={() => onEdit(NEW_ADDRESS_TEMPLATE)}
          style={{ marginBottom: 10 }}
        >
          <FormattedMessage id="Subscription.AddNew" />
        </Button> */}
        <Table
          rowKey="deliveryAddressId"
          loading={loading}
          columns={columns}
          dataSource={list}
          pagination={false}
        />
      </div>
    );
  }
}
