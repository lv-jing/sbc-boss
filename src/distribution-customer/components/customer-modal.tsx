import React from 'react';
import { Relax } from 'plume2';
import { Modal, Form } from 'antd';
import { noop } from 'qmkit';
import EditForm from './edit-form';

import Tips from './tips';

const WrapperForm = Form.create()(EditForm as any);

// const OptionDiv = styled.div`
//   width: 100%;
//   text-align: right;
//   display: block;
//   margin-bottom: 10px;
// `;

@Relax
export default class CustomerModal extends React.Component<any, any> {
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
    const { onCancel, visible } = this.props.relaxProps;

    if (!visible) {
      return null;
    }

    return (
      <Modal
        maskClosable={false}
        title="新增分销员"
        visible={visible}
        onOk={() => this._handleOK()}
        onCancel={() => onCancel()}
      >
        <Tips />
        <p style={{ paddingBottom: 24 }} />
        <WrapperForm ref={(form) => (this._form = form)} />
      </Modal>
    );
  }

  data = () => {
    const fieldsValue = this._form.getFieldsValue();
    let result = {
      customerAccount: fieldsValue.customerAccount,
      distributorLevelId: fieldsValue.distributorLevelId
    };
    return result;
  };

  _handleOK = () => {
    this._form.validateFieldsAndScroll(null, (errs) => {
      //如果校验通过
      if (!errs) {
        this.props.relaxProps.onSave(this.data());
      }
    });
  };
}
