import React from 'react';
import { Relax } from 'plume2';
import { Modal, Input, Form } from 'antd';
import { noop, QMMethod } from 'qmkit';

const FormItem = Form.Item;

class ForbidForm extends React.Component<any, any> {
  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form>
        <FormItem>
          {getFieldDecorator('forbiddenReason', {
            initialValue: '',
            rules: [
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorTrimMinAndMax(
                    rule,
                    value,
                    callback,
                    '禁用原因',
                    0,
                    100
                  );
                }
              }
            ]
          })(<Input.TextArea placeholder="100字以内" />)}
        </FormItem>
      </Form>
    );
  }
}

const WrappedForbidForm = Form.create()(ForbidForm);

@Relax
export default class ForbidModal extends React.Component<any, any> {
  _form;

  props: {
    relaxProps?: {
      onCheckStatus: Function;
      forbidModalVisible: boolean;
      forbidCustomerId: string;
      setForbidModalVisible: Function;
    };
  };

  static relaxProps = {
    onCheckStatus: noop,
    forbidModalVisible: 'forbidModalVisible',
    forbidCustomerId: 'forbidCustomerId',
    setForbidModalVisible: noop
  };

  render() {
    const { forbidModalVisible } = this.props.relaxProps;
    return (
       <Modal  maskClosable={false}
        title="请填写禁用原因"
        onOk={() => this._handleOK()}
        okText="确定"
        cancelText="取消"
        visible={forbidModalVisible}
        onCancel={() => this._modalClose()}
      >
        <WrappedForbidForm ref={(form) => (this._form = form)} />
      </Modal>
    );
  }

  _handleOK = () => {
    this._form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { onCheckStatus, forbidCustomerId } = this.props.relaxProps;
        onCheckStatus(forbidCustomerId, 1, values['forbiddenReason']);
        this._modalClose();
      }
    });
  };

  _modalClose = () => {
    const { setForbidModalVisible } = this.props.relaxProps;
    setForbidModalVisible(null, false);
    this._form.resetFields();
  };
}
