import React from 'react';
import { Relax } from 'plume2';
import { Modal, Form } from 'antd';
import { noop } from 'qmkit';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import SmsForm from './sms-form';

const WrapperForm = Form.create()(SmsForm as any);

@Relax
export default class MailModal extends React.Component<any, any> {
  _form: any;

  props: {
    relaxProps?: {
      smsVisible: boolean;
      smsSave: Function;
      smsCancel: Function;
    };
  };

  static relaxProps = {
    smsVisible: 'smsVisible',
    smsSave: noop,
    smsCancel: noop
  };

  render() {
    const { smsVisible, smsCancel } = this.props.relaxProps;

    if (!smsVisible) {
      return null;
    }

    return (
       <Modal  maskClosable={false}
        title="编辑短信接口"
        visible={smsVisible}
        onOk={() => this._handleOk()}
        onCancel={() => smsCancel()}
      >
        <WrapperForm ref={(form) => (this['_form'] = form)} />
      </Modal>
    );
  }

  _handleOk() {
    const form = this._form as WrappedFormUtils;
    const { smsSave } = this.props.relaxProps;
    form.validateFields(null, (errs, value) => {
      if (!errs) {
        smsSave(value);
      }
    });
  }
}
