import React from 'react';
import { Modal, Form, Input } from 'antd';
import { Relax } from 'plume2';
import styled from 'styled-components';

import { noop, ValidConst } from 'qmkit';

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
    sm: { span: 15 }
  }
};

const ListText = styled.div`
  line-height: 20px;
  color: #333333;
  span {
    color: #666666;
  }
  p {
    margin-bottom: 15px;
  }
`;

@Relax
export default class FightmoneyModal extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  props: {
    form: any;
    relaxProps?: {
      visible: boolean;
      FightmoneyModal: Function;
      modalContent: any;
      closeMoenyModal: Function;
      remitPrice: Function;
      changeRemitPrice: Function;
    };
  };

  static relaxProps = {
    visible: 'visible',
    FightmoneyModal: noop,
    modalContent: 'modalContent',
    closeMoenyModal: noop,
    remitPrice: noop,
    changeRemitPrice: noop
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    this.state = {
      remitPrice: ''
    };

    const { visible, modalContent, changeRemitPrice } = this.props.relaxProps;
    return (
      <Form>
         <Modal  maskClosable={false}
          title="确认打款"
          visible={visible}
          okText="提交"
          onCancel={this._handleModelCancel}
          onOk={this._handleOK}
          width={360}
        >
          <ListText>
            <p>
              <span>银行：</span>
              {modalContent.get('bankName')}
            </p>
            <p>
              <span>账户名：</span>
              {modalContent.get('accountName')}
            </p>
            <p>
              <span>账号：</span>
              {modalContent.get('bankNo')}
            </p>
            <p>
              <span>支行：</span>
              {modalContent.get('bankBranch')}
            </p>
          </ListText>

          <FormItem {...formItemLayout} label="打款金额">
            {getFieldDecorator('remitPrice', {
              initialValue: modalContent.get('remitPrice')
                ? modalContent.get('remitPrice')
                : '',
              rules: [
                { required: true, message: '请输入打款金额' },
                {
                  pattern: ValidConst.zeroPrice,
                  message: '请填写两位小数的合法金额'
                },
                { validator: this._checkPrice }
              ]
              // rules: [
              //   { required: true, whitespace: false, message: '请输入打款金额' },
            })(
              <Input
                placeholder="纯数字，小数点后最多2位"
                onChange={(e) => changeRemitPrice((e as any).target.value)}
              />
            )}
          </FormItem>
        </Modal>
      </Form>
    );
  }

  /**
   * 关闭弹框
   */
  _handleModelCancel = () => {
    const { closeMoenyModal } = this.props.relaxProps;
    //重置表单域各项值
    this.props.form.resetFields();
    closeMoenyModal();
  };

  /**
   * 确认打款
   * @private
   */
  _handleOK = () => {
    const { remitPrice } = this.props.relaxProps;
    this.props.form.validateFields((err) => {
      if (!err) {
        remitPrice();
        this.props.form.resetFields();
      } else {
        this.setState({});
      }
    });
  };

  /**
   * 打款金额校验（纯数字，小数点后最多4位）
   * @param rule
   * @param value
   * @param callback
   * @private
   */
  _checkPrice = (_rule, value, callback) => {
    if (!value) {
      callback();
      return;
    }

    if (value <= 0) {
      callback(new Error('打款金额必须大于0'));
      return;
    }

    if (value.length > 20) {
      callback(new Error('最多输入20个字符'));
      return;
    }

    callback();
  };
}
