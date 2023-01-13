import React from 'react';
import { Relax } from 'plume2';
import { List } from 'immutable';
import { Popconfirm, Button } from 'antd';
import { noop, FindArea, OneAuthWrapper, DataGrid } from 'qmkit';
import AddressEditForm from './address-edit-form';
import Column from 'antd/lib/table/Column';

type TList = List<any>;
/**
 * 收货地址
 */
@Relax
export default class AddressInfoForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      addressList: TList;
      onEditAddress: Function;
      onDeleteAddress: Function;
      switchAddressFormVisible: Function;
    };
  };

  static relaxProps = {
    addressList: 'addressList',
    onEditAddress: noop,
    onDeleteAddress: noop,
    switchAddressFormVisible: noop
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {
      addressList,
      onEditAddress,
      onDeleteAddress,
      switchAddressFormVisible
    } = this.props.relaxProps;
    console.log(addressList.toJS());
    console.log(addressList.toJS());
    return (
      <div>
        {addressList.isEmpty() ? (
          <span
            style={{
              color: '#999',
              display: 'block',
              marginTop: '5px',
              marginBottom: '15px'
            }}
          >
            该客户暂无收货地址
          </span>
        ) : (
          <span
            style={{
              color: '#999',
              display: 'block',
              marginTop: '5px',
              marginBottom: '15px'
            }}
          >
            最多可创建20条收货信息
          </span>
        )}
        <DataGrid
          dataSource={addressList.toJS()}
          pagination={false}
          rowKey={(record) => record.couponId}
        >
          <Column
            title="收货人"
            dataIndex="consigneeName"
            key="consigneeName"
          />
          <Column
            title="联系方式"
            dataIndex="consigneeNumber"
            key="consigneeNumber"
          />
          <Column
            title="所在地区"
            render={(value) => {
              return this._renderText(value);
            }}
          />
          <Column title="postCode" dataIndex="postCode" key="postCode" />
          <Column title="rfc" dataIndex="rfc" key="rfc" />
          <Column
            title="操作"
            render={(value) => (
              <OneAuthWrapper
                functionName={
                  'f_customer_detail_edit,f_enterprise_customer_detail_edit'
                }
              >
                <a
                  href="javascript:void(0);"
                  onClick={() => onEditAddress(value)}
                >
                  编辑
                </a>
                &nbsp;&nbsp;
                <Popconfirm
                  title="确定删除当前的收货地址?"
                  onConfirm={() => {
                    onDeleteAddress(value.deliveryAddressId);
                  }}
                  okText="确定"
                  cancelText="取消"
                >
                  <a href="javascript:void(0);">删除</a>
                </Popconfirm>
              </OneAuthWrapper>
            )}
          />
        </DataGrid>
        {/*新增收货地址*/}
        <OneAuthWrapper
          functionName={
            'f_customer_detail_edit,f_enterprise_customer_detail_edit'
          }
        >
          <div className="btn-wrap">
            <Button
              type="primary"
              disabled={addressList.size >= 20}
              onClick={switchAddressFormVisible.bind(this, true)}
            >
              新增地址
            </Button>
          </div>
        </OneAuthWrapper>

        <AddressEditForm />
      </div>
    );
  }

  _renderText(address: any) {
    const { provinceId, cityId, areaId, deliveryAddress } = address;
    return (
      <span>
        {FindArea.addressInfo(provinceId, cityId, areaId)}
        {deliveryAddress}
      </span>
    );
  }
}
