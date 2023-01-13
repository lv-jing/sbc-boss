import React from 'react';
import { Relax } from 'plume2';
import { Modal, Form, Alert } from 'antd';
import { noop } from 'qmkit';
import EditForm from './edit-form';
import { WrappedFormUtils } from 'antd/lib/form/Form';

const WrapperForm = Form.create()(EditForm as any);

@Relax
export default class ReceiveModal extends React.Component<any, any> {
  _form: any;

  props: {
    relaxProps?: {
      visible: boolean;
      onCancel: Function;
      onSave: Function;
    };
  };

  static relaxProps = {
    visible: 'visible',
    customerLevel: 'customerLevel',
    onCancel: noop,
    onSave: noop
  };

  render() {
    const { onCancel, visible } = this.props.relaxProps;

    if (!visible) {
      return null;
    }

    return (
       <Modal  maskClosable={false}
        title="添加收款记录"
        visible={visible}
        onOk={() => this._handleOK()}
        onCancel={() => onCancel()}
      >
        <Alert
          message="请确认客户已线下付款"
          style={{
            backgroundColor: '#fff',
            color: '#999',
            paddingRight: 10,
            marginLeft: 20
          }}
          banner
        />
        <WrapperForm ref={(form) => (this._form = form)} />
      </Modal>
    );
  }

  _handleOK = () => {
    const form = this._form as WrappedFormUtils;
    form.validateFields(null, (errs, values) => {
      //如果校验通过
      if (!errs) {
        this.props.relaxProps.onSave(values);
      }
    });
  };
}
