import React from 'react';
import { Relax } from 'plume2';
import { Modal, Form } from 'antd';
import { noop } from 'qmkit';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import ResourceForm from './resource-form';

const WrapperForm = Form.create()(ResourceForm as any);

@Relax
export default class ResourceModal extends React.Component<any, any> {
  _form: any;

  props: {
    relaxProps?: {
      visible: boolean;
      onSave: Function;
      onCancel: Function;
    };
  };

  static relaxProps = {
    visible: 'visible',
    onSave: noop,
    onCancel: noop
  };

  render() {
    const { visible, onCancel } = this.props.relaxProps;

    if (!visible) {
      return null;
    }

    return (
       <Modal  maskClosable={false}
        title="编辑对象存储接口"
        visible={visible}
        onOk={() => this._handleOk()}
        onCancel={() => onCancel()}
      >
        <WrapperForm ref={(form) => (this['_form'] = form)} />
      </Modal>
    );
  }

  /**
   * 提交
   * @private
   */
  _handleOk() {
    const form = this._form as WrappedFormUtils;
    const { onSave } = this.props.relaxProps;
    form.validateFields(null, (errs, value) => {
      if (!errs) {
        onSave(value);
      }
    });
  }
}
