import * as React from 'react';
import { Relax } from 'plume2';

import { Modal, Form, Input } from 'antd';
import { noop, QMMethod } from 'qmkit';

const FormItem = Form.Item;

@Relax
export default class OperateModal extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  props: {
    form: any;
    relaxProps?: {
      modalVisible: boolean;
      reason: string;
      switchModal: Function;
      enterReason: Function;
      //驳回
      rejectInvoice: Function;
    };
  };

  static relaxProps = {
    // 弹框是否显示
    modalVisible: 'modalVisible',
    reason: 'reason',
    // 关闭弹框
    switchModal: noop,
    // 输入原因
    enterReason: noop,
    //驳回
    rejectInvoice: noop
  };

  render() {
    const {
      modalVisible,
      enterReason,
      reason,
      switchModal
    } = this.props.relaxProps;
    const { getFieldDecorator } = this.props.form;
    if (!modalVisible) {
      return null;
    }
    return (
       <Modal  maskClosable={false}
        title="请填写驳回原因"
         
        visible={modalVisible}
        onCancel={() => switchModal('')}
        onOk={this._handleOk}
      >
        <Form>
          <FormItem required={true}>
            {getFieldDecorator('reason', {
              initialValue: reason,
              rules: [
                { required: true, message: '请填写驳回原因' },
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
            })(
              <Input.TextArea
                placeholder="请输入驳回原因"
                onChange={(e: any) => enterReason(e.target.value)}
              />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }

  /**
   * 确定按钮
   */
  _handleOk = () => {
    const { rejectInvoice } = this.props.relaxProps;
    const form = this.props.form;
    // 账号驳回
    form.validateFields(null, (errs) => {
      //如果校验通过
      if (!errs) {
        //单条驳回
        rejectInvoice();
        this.props.form.setFieldsValue({
          reason: null
        });
      } else {
        this.setState({});
      }
    });
  };
}
