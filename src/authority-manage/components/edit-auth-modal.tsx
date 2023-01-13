import React from 'react';
import { Relax } from 'plume2';
import { Modal, Form } from 'antd';
import { noop } from 'qmkit';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import EditAuthForm from './edit-auth-form';

const WrapperForm = Form.create({})(EditAuthForm);

@Relax
export default class EditAuthModal extends React.Component<any, any> {
  _form: any;

  props: {
    relaxProps?: {
      authVisible: boolean;
      edit: boolean;
      onCancel: Function;
      onSaveAuth: Function;
    };
  };

  static relaxProps = {
    authVisible: 'authVisible',
    edit: 'edit',
    onCancel: noop,
    onSaveAuth: noop
  };

  render() {
    const { onCancel, authVisible, edit } = this.props.relaxProps;
    if (!authVisible) {
      return null;
    }

    const title = edit ? '编辑权限' : '新增权限';

    return (
       <Modal  maskClosable={false}
        title={title}
        visible={authVisible}
        onOk={() => this._handleOK()}
        onCancel={() => onCancel('authVisible')}
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
        this.props.relaxProps.onSaveAuth(values);
      }
    });
  };
}
