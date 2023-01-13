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
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  props: {
    relaxProps?: {
      sendModalVisible: boolean;
      ifModify: any;
      pushType: number;
      onDataChange: Function;
      clearPushModal: Function;
      createPushTasks: Function;
      setData: Function;
      crmFlag: Boolean;
      rfmGroupSearch: Function;
    };
  };

  static relaxProps = {
    levelList: 'levelList',
    rfmGroupList: 'rfmGroupList',
    customerList: 'customerList',
    sendModalVisible: 'sendModalVisible',
    setData: noop,
    onDataChange: noop,
    getCustomerList: noop,
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
    pushType: 'pushType',
    imageUrl: 'imageUrl',
    createPushTasks: noop,

    clearPushModal: noop,
    crmFlag: 'crmFlag',
    rfmGroupSearch: noop,
    uPushSendForm: 'uPushSendForm'
  };

  render() {
    const { sendModalVisible, ifModify } = this.props.relaxProps;

    return (
      <Modal
        maskClosable={false}
        title={'创建推送任务'}
        visible={sendModalVisible}
        onOk={debounce(this._handleOK, 300)}
        onCancel={this._handleCancel}
        width={984}
        destroyOnClose={true}
        footer={
          ifModify ? (
            <div>
              <Button onClick={this._handleCancel}>取消</Button>
              <Button type="primary" onClick={debounce(this._handleOK, 300)}>
                确定
              </Button>
            </div>
          ) : (
            <Button onClick={this._handleCancel}>取消</Button>
          )
        }
      >
        <Alert
          message={
            <div>
              <p>
                1、为了避免用户反感，减少对用户的打扰，请勿频繁向用户推送消息，推荐在7:00-21:00间发送；
              </p>
              <p>2、发送push的同时会默认给用户发送站内信，无需重复操作；</p>
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
    const { pushType } = this.props.relaxProps;
    const form = this._form as WrappedFormUtils;
    form.validateFields(null, (errs, values) => {
      if (
        pushType === 1 &&
        values.pushTime &&
        values.pushTime.valueOf() < Date.now()
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
