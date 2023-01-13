import * as React from 'react';
import { Modal, Form, Input } from 'antd';
import { Relax } from 'plume2';
import { noop, QMMethod } from 'qmkit';

import { WrappedFormUtils } from 'antd/lib/form/Form';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    span: 24,
    xs: { span: 24 },
    sm: { span: 24 }
  }
};

@Relax
export default class ForbidModal extends React.Component<any, any> {
  _form;
  WrapperForm: any;

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create()(ForbidModalForm as any);
  }

  props: {
    relaxProps?: {
      modalVisible: boolean;
      grouponActivityId: string;
      forbidReason: string;
      onFieldChange: Function;
      onRefuseFunc: Function;
      switchShowModal: Function;
    };
  };

  static relaxProps = {
    // 弹框是否显示
    modalVisible: 'modalVisible',
    // 禁售单个商品的id
    grouponActivityId: 'grouponActivityId',
    // 禁售原因
    forbidReason: 'forbidReason',
    // 修改禁售原因
    onFieldChange: noop,
    // 添加类目
    onRefuseFunc: noop,
    // 显示/关闭弹窗
    switchShowModal: noop
  };

  render() {
    const { modalVisible } = this.props.relaxProps;
    const WrapperForm = this.WrapperForm;

    if (!modalVisible) {
      return null;
    }
    return (
       <Modal  maskClosable={false}
        title={'请填写驳回原因'}
         
        visible={modalVisible}
        onCancel={this._handleModelCancel}
        onOk={this._handleSubmit}
      >
        <WrapperForm
          ref={(form) => (this._form = form)}
          relaxProps={this.props.relaxProps}
        />
      </Modal>
    );
  }

  /**
   * 提交
   */
  _handleSubmit = () => {
    const form = this._form as WrappedFormUtils;
    form.validateFields(null, (errs) => {
      if (!errs) {
        //提交
        const { onRefuseFunc, grouponActivityId } = this.props.relaxProps;
        onRefuseFunc(grouponActivityId);
      }
    });
  };

  /**
   * 关闭弹框
   */
  _handleModelCancel = () => {
    const { switchShowModal } = this.props.relaxProps;
    switchShowModal(false);
  };
}

class ForbidModalForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      modalVisible: boolean;
      forbidReason: string;
      onFieldChange: Function;
      onRefuseFunc: Function;
      switchShowModal: Function;
    };
    form;
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    const { forbidReason, onFieldChange } = this.props.relaxProps;
    const tipTxt = '驳回原因';
    return (
      <Form className="login-form">
        <FormItem {...formItemLayout} hasFeedback>
          {getFieldDecorator('forbidReason', {
            initialValue: forbidReason,
            rules: [
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorTrimMinAndMax(
                    rule,
                    value,
                    callback,
                    tipTxt,
                    1,
                    100
                  );
                }
              }
            ]
          })(
            <Input.TextArea
              placeholder="100字以内"
              onChange={(e) => {
                onFieldChange('forbidReason', (e.target as any).value);
              }}
            />
          )}
        </FormItem>
      </Form>
    );
  }
}
