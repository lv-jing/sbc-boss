import React from 'react';
import { Relax } from 'plume2';
import { Modal, Form, Alert } from 'antd';
import { noop } from 'qmkit';
import SettingForm from './setting-form';
import { WrappedFormUtils } from 'antd/lib/form/Form';
const WrappedTemplateForm = Form.create({})(SettingForm);

@Relax
export default class SettingModal extends React.Component<any, any> {
  _form: any;

  props: {
    relaxProps?: {
      isPushModal: boolean;
      uPushForm: any;
      setData: Function;
      saveSetting: Function;
    };
  };

  static relaxProps = {
    isPushModal: 'isPushModal',
    uPushForm: 'uPushForm',
    setData: noop,
    saveSetting: noop
  };

  render() {
    const { isPushModal } = this.props.relaxProps;

    return (
      <Modal
        maskClosable={false}
        title="友盟push接口设置"
        visible={isPushModal}
        onOk={this._handleOK}
        onCancel={this._handleCancel}
        width={640}
        destroyOnClose={true}
      >
        <Alert
          showIcon={true}
          message={
            <div>
              <p>
                请先在友盟开通push服务，在友盟后台添加您的iOS以及Android应用，获取对应参数
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
    const { saveSetting } = this.props.relaxProps;
    const form = this._form as WrappedFormUtils;

    form.validateFields(async (errors, values) => {
      if (!errors) {
        // setData('flag', false);
        await saveSetting(values);
      }
    });

    // form.validateFields(null, async (errs, value) => {
    //   if (!errs) {
    //     // 验证通过，保存
    //     // await this.props.saveTemplate(value);
    //     // form.resetFields();
    //     // this.setState({
    //     //   templateName: '',
    //     //   templateContent: '',
    //     //   remark: '',
    //     //   signId: null,
    //     //   businessType: null,
    //     //   flag: false
    //     // });
    //   }
    // });
  };

  _handleCancel = () => {
    this.props.relaxProps.setData('isPushModal', false);
  };
}
