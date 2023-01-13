import React from 'react';
import { Relax } from 'plume2';
import { Modal, Form } from 'antd';
import TagForm from './tag-form';
import { noop } from 'qmkit';
import { WrappedFormUtils } from 'antd/lib/form/Form';

const WrapperForm = Form.create()(TagForm as any);

@Relax
export default class TagModal extends React.Component<any, any> {
  _form: any;

  props: {
    relaxProps?: {
      visible: boolean;
      edit: boolean;
      onCancel: Function;
      onSave: Function;
    };
  };

  static relaxProps = {
    visible: 'visible',
    edit: 'edit',
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
        title={edit ? '编辑标签' : '新增标签'}
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
