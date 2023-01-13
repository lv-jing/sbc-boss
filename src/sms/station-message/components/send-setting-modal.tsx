import React from 'react';
import { Relax } from 'plume2';
import { Alert, Button, Form, message, Modal } from 'antd';
import { noop } from 'qmkit';
import SendSettingForm from './send-setting-form';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import debounce from 'lodash/debounce';

const WrappedTemplateForm = Form.create({})(SendSettingForm);

@Relax
export default class SendSettingModal extends React.Component<any, any> {
  _form: any;

  props: {
    relaxProps?: {
      sendModalVisible: boolean;
      setData: Function;
      ifModify: any;
      onDataChange: Function;
      clearPushModal: Function;
      createPushTasks: Function;
      crmFlag: boolean;
    };
  };

  static relaxProps = {
    levelList: 'levelList',
    rfmGroupList: 'rfmGroupList',
    customerList: 'customerList',
    sendModalVisible: 'sendModalVisible',
    setData: noop,
    getCustomerList: noop,
    onDataChange: noop,
    sendForm: 'sendForm',
    selectedCustomerList: 'selectedCustomerList',
    setState: noop,
    onFormFieldChange: noop,
    sendType: 'sendType',
    customerTotal: 'customerTotal',
    getCustomerTotal: noop,
    customerLevel: 'customerLevel',
    rfmGroup: 'rfmGroup',
    ifModify: 'ifModify',
    linkHrefPath: 'linkHrefPath',
    dataInfo: 'dataInfo',

    clearPushModal: noop,
    uPushSendForm: 'uPushSendForm',
    pushType: 'pushType',
    imageDefaultUrl: 'imageDefaultUrl',
    createPushTasks: noop,
    crmFlag: 'crmFlag',

    rfmGroupSearch: noop,
    imageUrl: 'imageUrl'
  };

  render() {
    const { sendModalVisible, ifModify } = this.props.relaxProps;

    return (
      <Modal
        title={'发送站内信'}
        visible={sendModalVisible}
        onOk={debounce(this._handleOK, 300)}
        onCancel={this._handleCancel}
        width={984}
        destroyOnClose={true}
        footer={
          !ifModify ? (
            <Button onClick={this._handleCancel}>取消</Button>
          ) : (
            <div>
              <Button onClick={this._handleCancel}>取消</Button>
              <Button type="primary" onClick={debounce(this._handleOK, 300)}>
                确定
              </Button>
            </div>
          )
        }
      >
        <Alert
          message={
            <div>
              <p>
                1、如果您只需要通过站内信向用户发送消息，可使用发送站内信功能；
              </p>
              <p>
                2、如果同时需要通过App
                Push和站内信向用户发送消息，请使用应用-App
                Push-创建推送任务功能，发送push的同时会默认给用户发送站内信；
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
    //@ts-ignore
    // const { uPushSendForm } = this.props.relaxProps;
    const form = this._form as WrappedFormUtils;
    form.validateFields(null, (errs, values) => {
      if (
        values.sendTimeType === 1 &&
        values.sendTime &&
        values.sendTime.valueOf() < Date.now()
      ) {
        message.error('发送时间不能小于当前时间');
        errs = true;
      }
      //如果校验通过
      if (!errs) {
        this.props.relaxProps.createPushTasks(values);
        this.props.relaxProps.setData('');
      }
    });
  };
  _handleCancel = () => {
    const { setData, clearPushModal } = this.props.relaxProps;
    setData('sendModalVisible', false);
    clearPushModal();
  };
}
