import React from 'react';
import { Relax } from 'plume2';
import { Modal, Input, Form } from 'antd';
import { noop, QMMethod } from 'qmkit';

const FormItem = Form.Item;

class RejectForm extends React.Component<any, any> {
  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form>
        <FormItem>
          {getFieldDecorator('rejectReason', {
            initialValue: '',
            rules: [
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorTrimMinAndMax(
                    rule,
                    value,
                    callback,
                    '驳回原因',
                    1,
                    100
                  );
                }
              }
            ]
          })(<Input.TextArea />)}
        </FormItem>
      </Form>
    );
  }
}

const WrappedRejectForm = Form.create()(RejectForm);

@Relax
export default class RejectModal extends React.Component<any, any> {
  _form;

  props: {
    relaxProps?: {
      onCustomerStatus: Function;
      rejectModalVisible: boolean;
      rejectCustomerId: string;
      setRejectModalVisible: Function;
    };
  };

  static relaxProps = {
    onCustomerStatus: noop,
    rejectModalVisible: 'rejectModalVisible',
    rejectCustomerId: 'rejectCustomerId',
    setRejectModalVisible: noop
  };

  render() {
    const { rejectModalVisible } = this.props.relaxProps;
    return (
      <Modal
        maskClosable={false}
        title="请填写驳回原因"
        onOk={() => this._handleOK()}
        visible={rejectModalVisible}
        onCancel={() => this._modalClose()}
      >
        <WrappedRejectForm ref={(form) => (this._form = form)} />
      </Modal>
    );
  }

  _handleOK = () => {
    this._form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { onCustomerStatus, rejectCustomerId } = this.props.relaxProps;
        onCustomerStatus(rejectCustomerId, 3, values['rejectReason']);
        this._modalClose();
      }
    });
  };

  _modalClose = () => {
    const { setRejectModalVisible } = this.props.relaxProps;
    setRejectModalVisible(null, false);
    this._form.resetFields();
  };
}
