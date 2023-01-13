import React from 'react';
import { Relax } from 'plume2';
import { Modal, Form, Alert } from 'antd';
import { noop } from 'qmkit';
import SendNodeForm from './send-node-form';
import { WrappedFormUtils } from 'antd/lib/form/Form';
const WrappedTemplateForm = Form.create({})(SendNodeForm);

@Relax
export default class SendNodeModal extends React.Component<any, any> {
  _form: any;

  props: {
    relaxProps?: {
      nodeModalVisible: boolean;
      editNodeModal: Function;

      setData: Function;
      clearNodeModal: Function;
    };
  };

  static relaxProps = {
    nodeModalVisible: 'nodeModalVisible',
    uPushNodeForm: 'uPushNodeForm',
    editNodeModal: noop,

    setData: noop,
    sendForm: 'sendForm',
    setState: noop,
    onFormNodeChange: noop,
    clearNodeModal: noop
  };

  render() {
    const { nodeModalVisible } = this.props.relaxProps;

    return (
      <Modal
        maskClosable={false}
        title={'编辑通知类推送'}
        visible={nodeModalVisible}
        onOk={this._handleOK}
        onCancel={this._handleCancel}
        width={984}
        destroyOnClose={true}
      >
        <Alert
          message={
            <div>
              <p>发送push的同时会默认给用户发送站内信；</p>
            </div>
          }
          type="info"
        />
        <WrappedTemplateForm
          ref={(form) => (this._form = form)}
          {...this.props.relaxProps}
        />
      </Modal>
    );
  }

  _handleOK = () => {
    //@ts-ignore
    // const { pushType } = this.props.relaxProps;
    const form = this._form as WrappedFormUtils;
    form.validateFields(null, (errs, values) => {
      //如果校验通过
      if (!errs) {
        this.props.relaxProps.editNodeModal(values);
        this.props.relaxProps.setData('');
      }
    });
  };
  _handleCancel = () => {
    const { setData, clearNodeModal } = this.props.relaxProps;
    setData('nodeModalVisible', false);
    clearNodeModal();
  };
}
