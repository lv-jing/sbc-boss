import * as React from 'react';
import { Relax } from 'plume2';

import { Modal, Form, Input } from 'antd';
import { noop, QMMethod } from 'qmkit';
import { FormattedMessage } from 'react-intl';

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
      employeeId: string;
      switchModal: Function;
      enterReason: Function;
      //禁用
      onDisable: Function;
      //批量禁用
      onBatchDisable: Function;
    };
  };

  static relaxProps = {
    // 弹框是否显示
    modalVisible: 'modalVisible',
    reason: 'reason',
    employeeId: 'employeeId',
    // 关闭弹框
    switchModal: noop,
    // 输入原因
    enterReason: noop,
    //禁用
    onDisable: noop,
    //批量禁用
    onBatchDisable: noop
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
        title={<FormattedMessage id='Setting.TPlease' />}

        visible={modalVisible}
        onCancel={() => switchModal('')}
        onOk={this._handleOk}
      >
        <Form>
          <FormItem>
            {getFieldDecorator('reason', {
              initialValue: reason,
              rules: [
                { required: true, message: 'Please fill in the reason for deactivation' },
                {
                  validator: (rule, value, callback) => {
                    QMMethod.validatorTrimMinAndMax(
                      rule,
                      value,
                      callback,
                      'Disable reason',
                      1,
                      100
                    );
                  }
                }
              ]
            })(
              <Input.TextArea
                placeholder="Please enter the reason for disabling"
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
    const { onDisable, employeeId, onBatchDisable } = this.props.relaxProps;
    const form = this.props.form;
    // 账号禁用
    form.validateFields(null, (errs) => {
      //如果校验通过
      if (!errs) {
        //批量禁用
        if (employeeId == '') {
          onBatchDisable();
        } else {
          //单条禁用
          onDisable();
        }

        this.props.form.setFieldsValue({
          reason: null
        });
      } else {
        this.setState({});
      }
    });
  };
}
