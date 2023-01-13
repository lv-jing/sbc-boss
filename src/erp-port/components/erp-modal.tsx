import React from 'react';
import { Relax } from 'plume2';
import { Modal, Form } from 'antd';
import { noop } from 'qmkit';
import ErpForm from './erp-form';

const WrapperForm = Form.create()(ErpForm as any);

@Relax
export default class ErpModal extends React.Component<any, any> {
  _form: any;

  props: {
    relaxProps?: {
      visible: boolean;
      onCancel: Function;
    };
  };

  static relaxProps = {
    visible: 'visible',
    onCancel: noop
  };

  render() {
    const { visible, onCancel } = this.props.relaxProps;

    if (!visible) {
      return null;
    }

    return (
       <Modal  maskClosable={false} title="编辑ERP接口" visible={visible} onCancel={() => onCancel()}>
        <WrapperForm ref={(form) => (this['_form'] = form)} />
      </Modal>
    );
  }
}
