import * as React from 'react';
import { Modal, Form, Input, message } from 'antd';
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
      forbidGoodsId: string;
      forbidReason: string;
      changeForbidReason: Function;
      forbidSaleFunc: Function;
      switchShowModal: Function;
    };
  };

  static relaxProps = {
    // 弹框是否显示
    modalVisible: 'modalVisible',
    // 禁售单个商品的id
    forbidGoodsId: 'forbidGoodsId',
    // 禁售原因
    forbidReason: 'forbidReason',
    // 修改禁售原因
    changeForbidReason: noop,
    // 添加类目
    forbidSaleFunc: noop,
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
      <Modal
        maskClosable={false}
        title="请填写禁售原因"
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
        const {
          forbidSaleFunc,
          forbidGoodsId,
          forbidReason
        } = this.props.relaxProps;
        if (forbidReason == null || forbidReason.trim() == '') {
          message.error('禁售原因不可为空！');
          return;
        }
        forbidSaleFunc(forbidGoodsId);
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
      changeForbidReason: Function;
      forbidSaleFunc: Function;
      switchShowModal: Function;
    };
    form;
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { forbidReason, changeForbidReason } = this.props.relaxProps;
    return (
      <Form className="login-form">
        <FormItem {...formItemLayout} hasFeedback>
          {getFieldDecorator('forbidReason', {
            initialValue: forbidReason,
            rules: [
              { required: true, message: '禁售原因不能为空' },
              { max: 100, message: '最多100字符' },
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorEmoji(rule, value, callback, '禁售原因');
                }
              }
            ]
          })(
            <Input.TextArea
              placeholder="请输入禁售原因"
              onChange={(e) => {
                changeForbidReason((e.target as any).value);
              }}
            />
          )}
        </FormItem>
      </Form>
    );
  }
}
