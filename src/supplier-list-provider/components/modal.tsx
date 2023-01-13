import * as React from 'react';
import { Relax } from 'plume2';

import { Modal, Form, Input } from 'antd';
import { noop, QMMethod } from 'qmkit';
import { WrappedFormUtils } from 'antd/lib/form/Form';

const MODAL_TYPE = {
  0: '禁用',
  1: '关店'
};
const FormItem = Form.Item;

@Relax
export default class OperateModal extends React.Component<any, any> {
  _modalForm;
  WrapperForm: any;
  constructor(props) {
    super(props);
    this.WrapperForm = Form.create()(ReasonModalForm as any);
  }

  props: {
    relaxProps?: {
      modalVisible: boolean;
      modalType: number;
      id: number;
      reason: string;

      switchModal: Function;
      reject: Function;
      enterReason: Function;
      switchStore: Function;
    };
  };

  static relaxProps = {
    // 弹框是否显示
    modalVisible: 'modalVisible',
    // 弹框类型 0: 禁用弹框 1: 关店弹框
    modalType: 'modalType',
    // 公司Id/店铺Id
    id: 'id',
    reason: 'reason',

    // 关闭弹框
    switchModal: noop,
    // 账号启用/禁用
    reject: noop,
    // 输入原因
    enterReason: noop,
    // 开店/关店
    switchStore: noop
  };

  render() {
    const { modalVisible, modalType } = this.props.relaxProps;
    const ModalForm = this.WrapperForm;
    if (!modalVisible) {
      return null;
    }
    return (
      <Modal
        maskClosable={false}
        title={`请填写${MODAL_TYPE[modalType]}原因`}
        visible={modalVisible}
        onCancel={this._handleModelCancel}
        onOk={this._handleOk}
      >
        <ModalForm
          ref={(form) => (this._modalForm = form)}
          relaxProps={this.props.relaxProps}
        />
      </Modal>
    );
  }

  /**
   * 关闭弹框
   */
  _handleModelCancel = () => {
    const { switchModal } = this.props.relaxProps;
    switchModal({ modalType: 0, id: -1 });
  };

  /**
   * 确定按钮
   */
  _handleOk = () => {
    const { modalType, reject, id, switchStore } = this.props.relaxProps;
    const form = this._modalForm as WrappedFormUtils;
    // 账号禁用
    if (modalType == 0) {
      form.validateFields(null, (errs) => {
        //如果校验通过
        if (!errs) {
          reject({ companyInfoId: id, accountState: 1 });
        } else {
          this.setState({});
        }
      });
    } else if (modalType == 1) {
      // 店铺关店
      form.validateFields(null, (errs) => {
        //如果校验通过
        if (!errs) {
          switchStore({ storeId: id, storeState: 1 });
        } else {
          this.setState({});
        }
      });
    }
  };
}

class ReasonModalForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      reason: string;
      modalType: number;
      enterReason: Function;
    };
    form;
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { reason, modalType } = this.props.relaxProps;
    const { getFieldDecorator } = this.props.form;

    return (
      <Form>
        <FormItem>
          {getFieldDecorator('reason', {
            initialValue: reason,
            rules: [
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorTrimMinAndMax(
                    rule,
                    value,
                    callback,
                    `${MODAL_TYPE[modalType]}原因`,
                    1,
                    100
                  );
                }
              }
            ]
          })(
            <Input.TextArea
              placeholder={`请输入${MODAL_TYPE[modalType]}原因`}
              onChange={(e: any) => this._enter(e.target.value)}
            />
          )}
        </FormItem>
      </Form>
    );
  }

  /**
   * 输入原因
   */
  _enter = (reason) => {
    const { enterReason } = this.props.relaxProps;
    enterReason(reason);
  };
}
