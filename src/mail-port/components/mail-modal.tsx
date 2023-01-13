import React from 'react';
import { Relax } from 'plume2';
import { Modal, Form } from 'antd';
import { noop } from 'qmkit';
import MailForm from './mail-form';

const WrapperForm = Form.create()(MailForm as any);

@Relax
export default class MailModal extends React.Component<any, any> {
  _form: any;

  props: {
    relaxProps?: {
      mailVisible: boolean;
      mailCancel: Function;
    };
  };

  static relaxProps = {
    mailVisible: 'mailVisible',
    mailCancel: noop
  };

  render() {
    const { mailVisible, mailCancel } = this.props.relaxProps;

    if (!mailVisible) {
      return null;
    }

    return (
       <Modal  maskClosable={false}
        title="编辑邮箱接口"
        visible={mailVisible}
        onCancel={() => mailCancel()}
      >
        <WrapperForm ref={(form) => (this['_form'] = form)} />
      </Modal>
    );
  }
}
