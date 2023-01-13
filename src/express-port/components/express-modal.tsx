import React from 'react';
import { Relax } from 'plume2';
import { Modal, Form } from 'antd';
import { noop } from 'qmkit';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import ExpressForm from './express-form';

const WrapperForm = Form.create()(ExpressForm as any);

@Relax
export default class ExpressModal extends React.Component<any, any> {
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
    onCancel: noop,
    onSave: noop
  };

  _handleOk = () => {
    const form = this._form as WrappedFormUtils;
    form.validateFields(null, (errs, values) => {
      //如果校验通过
      if (!errs) {
        return this.props.relaxProps.onSave(values);
      }
    });
  };

  render() {
    const { visible, onCancel } = this.props.relaxProps;

    if (!visible) {
      return null;
    }
    return (
       <Modal  maskClosable={false}
        title="编辑物流接口"
        visible={visible}
        onCancel={() => onCancel()}
        onOk={this._handleOk}
      >
        <WrapperForm ref={(form) => (this['_form'] = form)} />
      </Modal>
    );
  }
}
