import React from 'react';
import { Store, Relax } from 'plume2';
import { Modal } from 'antd';
import { noop } from 'qmkit';
import CustomerDetail from '../../../customer-detail/index';

@Relax
export default class BaseInfoModal extends React.Component<any, any> {
  _store: Store;

  props: {
    relaxProps?: {
      modalVisible: boolean;
      toggleModal: Function;
      customerId: string;
      initBaseInfo: Function;
    };
  };

  static relaxProps = {
    toggleModal: noop,
    modalVisible: 'modalVisible',
    customerId: 'customerId',
    initBaseInfo: noop
  };

  render() {
    const {
      modalVisible,
      customerId,
      toggleModal,
      initBaseInfo
    } = this.props.relaxProps;
    return (
      <Modal
        maskClosable={false}
        title={'编辑会员基本信息'}
        width={600}
        visible={modalVisible}
        onCancel={this._handleModelCancel}
        onOk={this._handleSubmit}
        footer={null}
      >
        <CustomerDetail
          customerId={customerId}
          tabIndex={1}
          closeModal={() => {
            toggleModal();
            initBaseInfo(customerId);
          }}
          crmFlag={true}
        />
      </Modal>
    );
  }

  /**
   * 提交
   */
  _handleSubmit = () => {};

  /**
   * 关闭弹框
   */
  _handleModelCancel = () => {
    this.props.relaxProps.toggleModal();
  };
}
