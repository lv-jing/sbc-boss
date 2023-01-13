import React from 'react';
import { Relax } from 'plume2';
import { Modal } from 'antd';
import { AddressInfo } from 'biz';
import { OneAuthWrapper } from 'qmkit';

/**
 * 添加/编辑收获地址
 */
@Relax
export default class AddressEditForm extends React.Component<any, any> {
  _addressInfoForm: any;
  props: {
    relaxProps?: {
      isEdit: boolean;
      addressInfo: any;
      addressFormVisible: boolean;
      addCustomerAddress: Function;
      updateCustomerAddress: Function;
      switchAddressFormVisible: Function;
      clearAddressInfo: Function;
    };
  };

  static relaxProps = {
    isEdit: 'isEdit',
    addressFormVisible: 'addressFormVisible',
    addressInfo: 'addressInfo',
    updateCustomerAddress: () => {},
    addCustomerAddress: () => {},
    switchAddressFormVisible: () => {},
    clearAddressInfo: 'onEditAddress'
  };

  render() {
    const {
      isEdit,
      addressInfo,
      addressFormVisible,
      switchAddressFormVisible
    } = this.props.relaxProps;

    const address = addressInfo.toJS();
    address.area = [
      address.provinceId + '',
      address.cityId + '',
      address.areaId + ''
    ];

    return (
      <div>
        {addressFormVisible && (
          <OneAuthWrapper
            functionName={
              'f_customer_detail_edit,f_enterprise_customer_detail_edit'
            }
          >
            <Modal
              maskClosable={false}
              title="收货地址"
              visible={addressFormVisible}
              onOk={() =>
                this.submit(
                  isEdit,
                  address.deliveryAddressId,
                  address.isDefaltAddress
                )
              }
              onCancel={switchAddressFormVisible.bind(this, false)}
              okText="确认"
              cancelText="取消"
              className="custom-modal"
            >
              <AddressInfo
                addr={address}
                ref={(addressInfo) => (this._addressInfoForm = addressInfo)}
              />
            </Modal>
          </OneAuthWrapper>
        )}
      </div>
    );
  }

  submit = (isEdit: boolean, deliveryAddressId, isDefaltAddress) => {
    const {
      updateCustomerAddress,
      addCustomerAddress,
      clearAddressInfo
    } = this.props.relaxProps;
    this._addressInfoForm.data((values) => {
      if (isEdit) {
        updateCustomerAddress({
          ...values,
          deliveryAddressId,
          isDefaltAddress
        });
      } else {
        addCustomerAddress(values);
      }
      clearAddressInfo();
    });
  };
}
