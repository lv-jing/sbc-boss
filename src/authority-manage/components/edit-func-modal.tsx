import React from 'react';
import { Relax } from 'plume2';
import { Modal, Form } from 'antd';
import { noop } from 'qmkit';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import EditFuncForm from './edit-func-form';

const WrapperForm = Form.create({})(EditFuncForm);

@Relax
export default class EditFuncModal extends React.Component<any, any> {
  _form: any;

  props: {
    relaxProps?: {
      funcVisible: boolean;
      edit: boolean;
      onCancel: Function;
      onSaveFunc: Function;
    };
  };

  static relaxProps = {
    funcVisible: 'funcVisible',
    edit: 'edit',
    onCancel: noop,
    onSaveFunc: noop
  };

  render() {
    const { onCancel, funcVisible, edit } = this.props.relaxProps;
    if (!funcVisible) {
      return null;
    }

    const title = edit ? '编辑功能' : '新增功能';

    return (
       <Modal  maskClosable={false}
        title={title}
        visible={funcVisible}
        onOk={() => this._handleOK()}
        onCancel={() => onCancel('funcVisible')}
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
        this.props.relaxProps.onSaveFunc(values);
      }
    });
  };
}
