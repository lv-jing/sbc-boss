import React from 'react';
import { Relax } from 'plume2';
import { Modal, Form } from 'antd';
import { noop } from 'qmkit';
import EditForm from './edit-form';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { FormattedMessage } from 'react-intl';

const WrapperForm = Form.create()(EditForm as any);

@Relax
export default class EmployeeModal extends React.Component<any, any> {
  _form: any;

  props: {
    relaxProps?: {
      visible: boolean;
      edit: boolean;
      onCancel: Function;
      onSave: Function;
      editDisable: boolean
    };
  };

  static relaxProps = {
    visible: 'visible',
    edit: 'edit',
    customerLevel: 'customerLevel',
    onCancel: noop,
    onSave: noop,
    editDisable: 'editDisable'
  };

  render() {
    const { onCancel, visible, edit, editDisable } = this.props.relaxProps;

    if (!visible) {
      return null;
    }

    return (
      <Modal maskClosable={false}
             title={editDisable ? <FormattedMessage id='Setting.ViewInfo' /> : edit ?
               <FormattedMessage id='Setting.EditInfo' /> : <FormattedMessage id='Setting.AddInfo' />}
             visible={visible}
             onOk={() => this._handleOK()}
             onCancel={() => onCancel()}
      >
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
