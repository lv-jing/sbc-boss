import React from 'react';
import { Relax, Store } from 'plume2';
import { Modal, Form, Alert, Input, Switch } from 'antd';
import { noop } from 'qmkit';
import PropTypes from 'prop-types';
import { WrappedFormUtils } from 'antd/lib/form/Form';

const FormItem = Form.Item;

class InterfaceSettingForm extends React.Component<any, any> {
  _store: Store;
  props: {
    form;
    settingForm;
  };

  //声明上下文依赖
  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
  }

  render() {
    const {
      form: { getFieldDecorator },
      settingForm
    } = this.props;
    return (
      <Form>
        <FormItem label="AccessKeyId" hasFeedback>
          {getFieldDecorator('accessKeyId', {
            initialValue: settingForm.get('accessKeyId'),
            rules: [{ required: true, message: '请输入AccessKeyId' }]
          })(<Input />)}
        </FormItem>
        <FormItem label="AccessKeySecret" hasFeedback>
          {getFieldDecorator('accessKeySecret', {
            initialValue: settingForm.get('accessKeySecret'),
            rules: [{ required: true, message: '请输入AccessKeySecret' }]
          })(<Input />)}
        </FormItem>
        <FormItem label="是否开启">
          {getFieldDecorator('status', {
            initialValue: settingForm.get('status')
          })(<Switch defaultChecked={!!settingForm.get('status')} />)}
        </FormItem>
      </Form>
    );
  }
}

const WrappedTemplateForm = Form.create({})(InterfaceSettingForm);

@Relax
export default class InterfaceSetting extends React.Component<any, any> {
  _form: any;

  props: {
    relaxProps?: {
      interfaceModalVisible: boolean;
      setData: Function;
      settingForm: any;
      settingId: string;
      updateSetting: Function;
    };
  };

  static relaxProps = {
    settingId: 'settingId',
    settingForm: 'settingForm',
    interfaceModalVisible: 'interfaceModalVisible',
    setData: noop,
    updateSetting: noop
  };

  render() {
    const { interfaceModalVisible } = this.props.relaxProps;

    return (
       <Modal  maskClosable={false}
        title={'阿里云短信接口设置'}
        visible={interfaceModalVisible}
        width={500}
        onOk={this._handleOK}
        onCancel={this._handleCancel}
      >
        <Alert
          message={
            <div>
              <p>
                1、请先前往阿里云开通短信服务，在控制台-短信服务-AccessKey设置您的AccessKeyID以及AccessKeySecret，（为了您阿里云体系的安全性，建议创建仅具有云短信管理权限的用户）；
              </p>
              <p>
                2、开启使用后，请确保您的短信套餐以及账户余额充足，并设置不足提醒，防止业务中断；
              </p>
              <p>
                3、请根据您的业务量设置您针对同一手机号的发送频率，防止发送过于频繁造成用户体验下降或是因频率限制导致的发送失败；
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
      //如果校验通过
      if (!errs) {
        this.props.relaxProps.updateSetting(values);
      }
    });
  };
  _handleCancel = () => {
    this.props.relaxProps.setData('interfaceModalVisible', false);
  };
}
