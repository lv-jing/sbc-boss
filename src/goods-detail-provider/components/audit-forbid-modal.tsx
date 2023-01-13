import React from 'react';
import { Form, Input, Modal } from 'antd';
import { Relax } from 'plume2';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import Button from 'antd/lib/button/button';

import { noop } from 'qmkit';

@Relax
export default class ForbidModal extends React.Component<any, any> {
  _form;
  WrapperForm: any;

  state = {
    posting: false
  };

  props: {
    relaxProps?: {
      modalForbidVisible: boolean;
      modalForbidHide: Function;
      modalForbidConfirm: Function;
    };
  };

  static relaxProps = {
    modalForbidVisible: 'modalForbidVisible',
    modalForbidHide: noop,
    modalForbidConfirm: noop
  };

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create()(RejectForm as any);
  }

  render() {
    const { modalForbidVisible, modalForbidHide } = this.props.relaxProps;
    const WrapperForm = this.WrapperForm;
    if (!modalForbidVisible) {
      return null;
    }

    return (
      <Modal
        maskClosable={false}
        title={'请填写禁售原因'}
        visible={modalForbidVisible}
        onCancel={() => modalForbidHide()}
        footer={[
          <Button key="back" size="large" onClick={() => modalForbidHide()}>
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
    const { modalForbidConfirm, modalForbidHide } = this.props.relaxProps;
    const form = this._form as WrappedFormUtils;
    form.validateFields(null, (errs, values) => {
      if (!errs) {
        this.setState({ posting: true });
        modalForbidConfirm(values.reason).then(() => {
          this.setState({ posting: false });
          modalForbidHide();
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
                message: '请填写禁用原因'
              },
              {
                min: 1,
                max: 100,
                message: '1-100字'
              }
            ]
          })(<Input.TextArea placeholder="请输入禁售原因" />)}
        </FormItem>
      </Form>
    );
  }
}
