import React from 'react';
import { Form, Input, Modal } from 'antd';
import { Relax } from 'plume2';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import Button from 'antd/lib/button/button';

import { noop } from 'qmkit';

@Relax
export default class RejectModal extends React.Component<any, any> {
  _form;
  WrapperForm: any;

  state = {
    posting: false
  };

  props: {
    relaxProps?: {
      modalRejectVisible: boolean;
      modalRejectHide: Function;
      modalRejectConfirm: Function;
    };
  };

  static relaxProps = {
    modalRejectVisible: 'modalRejectVisible',
    modalRejectHide: noop,
    modalRejectConfirm: noop
  };

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create()(RejectForm as any);
  }

  render() {
    const { modalRejectVisible, modalRejectHide } = this.props.relaxProps;
    const WrapperForm = this.WrapperForm;
    if (!modalRejectVisible) {
      return null;
    }

    return (
       <Modal  maskClosable={false}
        title={'请填写驳回原因'}
        visible={modalRejectVisible}
        onCancel={() => modalRejectHide()}
        footer={[
          <Button key="back" size="large" onClick={() => modalRejectHide()}>
            取消
          </Button>,
          <Button
            key="submit"
            type="primary"
            size="large"
            loading={this.state.posting}
            onClick={() => this._handleOk()}
          >
            确定
          </Button>
        ]}
      >
        <WrapperForm ref={(form) => (this['_form'] = form)} />
      </Modal>
    );
  }

  _handleOk() {
    const { modalRejectConfirm, modalRejectHide } = this.props.relaxProps;
    const form = this._form as WrappedFormUtils;
    form.validateFields(null, (errs, values) => {
      if (!errs) {
        this.setState({ posting: true });
        modalRejectConfirm(values.reason).then(() => {
          this.setState({ posting: false });
          modalRejectHide();
        });
      }
    });
  }
}

const FormItem = Form.Item;

class RejectForm extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form>
        <FormItem>
          {getFieldDecorator('reason', {
            rules: [
              {
                required: true,
                  whitespace: true,
                  message: '请填写驳回原因'
              },
              {
                min: 1,
                max: 100,
                message: '1-100字'
              }
            ]
          })(<Input.TextArea placeholder="请输入驳回原因" />)}
        </FormItem>
      </Form>
    );
  }
}
