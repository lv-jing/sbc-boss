import React from 'react';
import { Relax, IMap } from 'plume2';
import { Modal, Form } from 'antd';
import EditForm from './edit-form';
import { noop } from 'qmkit';
import { WrappedFormUtils } from 'antd/lib/form/Form';

const WrapperForm = Form.create()(EditForm as any);

@Relax
export default class LevelModal extends React.Component<any, any> {
  _form: any;

  props: {
    relaxProps?: {
      visible: boolean;
      edit: boolean;
      customerLevel: IMap;
      onCancel: Function;
      onSave: Function;
    };
  };

  static relaxProps = {
    visible: 'visible',
    edit: 'edit',
    customerLevel: 'customerLevel',
    onCancel: noop,
    onSave: noop
  };

  render() {
    const { visible, onCancel, edit } = this.props.relaxProps;

    if (!visible) {
      return null;
    }

    return (
       <Modal  maskClosable={false}
        title={edit ? '编辑客户等级' : '新增客户等级'}
        visible={true}
        onOk={this._handleOK}
        onCancel={() => {
          onCancel();
        }}
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
