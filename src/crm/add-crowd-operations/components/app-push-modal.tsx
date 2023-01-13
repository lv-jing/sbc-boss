import React from 'react';
import { Relax } from 'plume2';
import { Modal, Form, Alert, Button } from 'antd';
import { noop } from 'qmkit';
import AppPushForm from './app-push-form';
import { WrappedFormUtils } from 'antd/lib/form/Form';
const WrappedTemplateForm = Form.create({})(AppPushForm);

@Relax
export default class AppPushModal extends React.Component<any, any> {
  _form: any;

  props: {
    relaxProps?: {
      setData: Function;
      ifModify: any;
      saveAppPush: Function;
      appPushModalVisible: boolean;
    };
  };

  static relaxProps = {
    setData: noop,
    ifModify: 'ifModify',
    planAppPush: 'planAppPush',
    imageUrl: 'imageUrl',
    saveAppPush: noop,
    appPushModalVisible: 'appPushModalVisible',
    setInnerData: noop
  };

  render() {
    const { appPushModalVisible, ifModify } = this.props.relaxProps;

    return (
      <Modal
        title={'创建推送任务'}
        visible={appPushModalVisible}
        onOk={this._handleOK}
        onCancel={this._handleCancel}
        width={984}
        footer={
          ifModify ? (
            <div>
              <Button onClick={this._handleCancel}>取消</Button>
              <Button type="primary" onClick={this._handleOK}>
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
    const form = this._form as WrappedFormUtils;
    form.validateFields(null, (errs, values) => {
      console.log(values);
      //如果校验通过
      if (!errs) {
        this.props.relaxProps.saveAppPush(values);
      }
    });
  };
  _handleCancel = () => {
    const { setData } = this.props.relaxProps;
    setData({ appPushModalVisible: false });
  };
}
