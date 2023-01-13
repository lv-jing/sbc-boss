import React from 'react';
import { Relax } from 'plume2';
import { Modal, Form } from 'antd';
import { noop } from 'qmkit';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import EditMenuForm from './edit-menu-form';

const WrapperForm = Form.create({})(EditMenuForm);

@Relax
export default class EditMenuModal extends React.Component<any, any> {
  _form: any;

  props: {
    relaxProps?: {
      menuVisible: boolean;
      edit: boolean;
      onCancel: Function;
      onSaveMenu: Function;
    };
  };

  static relaxProps = {
    menuVisible: 'menuVisible',
    edit: 'edit',
    onCancel: noop,
    onSaveMenu: noop
  };

  render() {
    const { onCancel, menuVisible, edit } = this.props.relaxProps;
    if (!menuVisible) {
      return null;
    }

    const title = edit ? '编辑菜单' : '新增菜单';

    return (
       <Modal  maskClosable={false}
        title={title}
        visible={menuVisible}
        onOk={() => this._handleOK()}
        onCancel={() => onCancel('menuVisible')}
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
        this.props.relaxProps.onSaveMenu(values);
      }
    });
  };
}
