import React from 'react';
import { Relax } from 'plume2';
import { Modal, Form, Alert, message, Button } from 'antd';
import { noop } from 'qmkit';
import SendSettingForm from './send-sms-form';
import { WrappedFormUtils } from 'antd/lib/form/Form';
const WrappedTemplateForm = Form.create({})(SendSettingForm);

@Relax
export default class SendSettingModal extends React.Component<any, any> {
  _form: any;

  props: {
    relaxProps?: {
      sendModalVisible: boolean;
      smsSend: Function;
      setData: Function;
      clearSendModal: Function;
      ifModify: any;
      sendGroupCustomerNum: number;
    };
  };

  static relaxProps = {
    levelList: 'levelList',
    rfmGroupList: 'rfmGroupList',
    customerList: 'customerList',
    sendModalVisible: 'sendModalVisible',
    salePassedTemplateList: 'salePassedTemplateList',
    setData: noop,
    getPassedSignList: noop,
    getSalePassedTemplateList: noop,
    getCustomerList: noop,
    smsSend: noop,
    sendForm: 'sendForm',
    selectedCustomerList: 'selectedCustomerList',
    setState: noop,
    onFormFieldChange: noop,
    ifManualAdd: 'ifManualAdd',
    sendType: 'sendType',
    customerTotal: 'customerTotal',
    getCustomerTotal: noop,
    passedSignList: 'passedSignList',
    customerLevel: 'customerLevel',
    rfmGroup: 'rfmGroup',
    clearSendModal: noop,
    ifModify: 'ifModify',
    smsNum: 'smsNum',
    manualCustomer: 'manualCustomer',
    sendGroupCustomerNum: 'sendGroupCustomerNum'
  };

  render() {
    const {
      sendModalVisible,
      ifModify,
      sendGroupCustomerNum
    } = this.props.relaxProps;
    console.log(sendGroupCustomerNum);
    return (
      <Modal
        title={'短信发送'}
        visible={sendModalVisible}
        onOk={this._handleOK}
        onCancel={this._handleCancel}
        width={1050}
        destroyOnClose={true}
        footer={
          !ifModify ? (
            <Button onClick={this._handleCancel}>取消</Button>
          ) : (
            <div>
              <Button onClick={this._handleCancel}>取消</Button>
              <Button type="primary" onClick={this._handleOK}>
                确定
              </Button>
            </div>
          )
        }
      >
        <Alert
          message={
            <div>
              <p>1、请选择签名和模板发送短信；</p>
              <p>
                2、“【短信签名】+短信内容+回T退订”是运营商确保短信发送成功的必填项，需计入短信字符内；
              </p>
              <p>
                3、发送时间范围：8:00-22:00，范围外的时间不能发送短信，建议定时发送时间在24小时内，合法时间范围内提交的短信将于30分钟内收到。
              </p>
            </div>
          }
          type="info"
        />
        <WrappedTemplateForm
          ref={(form) => (this._form = form)}
          {...this.props.relaxProps}
        />
      </Modal>
    );
  }

  _handleOK = () => {
    const form = this._form as WrappedFormUtils;
    form.validateFields(null, (errs, values) => {
      if (
        values.sendType == 1 &&
        values.sendTime &&
        values.sendTime.valueOf() < Date.now()
      ) {
        message.error('发送时间不能小于当前时间');
        errs = true;
      }
      //如果校验通过
      if (!errs) {
        this.props.relaxProps.smsSend(values);
        this.props.relaxProps.setData('');
      }
    });
  };
  _handleCancel = () => {
    const { setData, clearSendModal } = this.props.relaxProps;
    setData('sendModalVisible', false);
    clearSendModal();
  };
}
