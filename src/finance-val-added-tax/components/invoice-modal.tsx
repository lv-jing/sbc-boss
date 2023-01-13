import React from 'react';
import { Relax } from 'plume2';
import { Modal, Form, message } from 'antd';

import { noop } from 'qmkit';
import AddForm from './add-form';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { isUndefined } from 'util';

const WrapperForm = Form.create()(AddForm as any);

@Relax
export default class InvoiceModal extends React.Component<any, any> {
  _form: any;

  props: {
    relaxProps?: {
      visible: boolean;
      onCancel: Function;
      onSave: Function;
      customers: any;
    };
  };

  static relaxProps = {
    visible: 'visible',
    customerLevel: 'customerLevel',
    customers: 'customers',
    onCancel: noop,
    onSave: noop
  };

  render() {
    const { onCancel, visible } = this.props.relaxProps;

    if (!visible) {
      return null;
    }

    return (
      <Modal
        maskClosable={false}
        title="新增增值税开票资质"
        visible={visible}
        width={600}
        onOk={() => this._handleOK()}
        onCancel={() => onCancel()}
      >
        <WrapperForm ref={(form) => (this._form = form)} />
      </Modal>
    );
  }

  _handleOK = () => {
    const { customers } = this.props.relaxProps;
    const form = this._form as WrappedFormUtils;
    form.validateFields(null, (errs, values) => {
      // console.log('customers--------->',customers.toString(),customers.count(),customers.toJS()[0].customerId)
      // console.log('customers--------->',customers.count()>0 && isUndefined(customers.toJS()[0].customerId) , customers.count()>0 && customers.toJS()[0].customerAccount)
      //如果校验通过
      if (!errs) {
        if (
          customers != null &&
          customers.toJS()[0].customerAccount == values.customerAccount
        ) {
          values.customerId = customers.toJS()[0].customerId;
        } else {
          values.customerId = undefined;
        }
        if (isUndefined(values.customerId)) {
          message.error('客户不存在');
        } else {
          this.props.relaxProps.onSave(values);
        }
      }
    });
  };
}
