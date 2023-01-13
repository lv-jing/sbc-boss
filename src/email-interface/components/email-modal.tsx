import React from 'react';
import { Relax, IMap } from 'plume2';
import { Form, Modal } from 'antd';
import { noop } from 'qmkit';
import EmailForm from './email-form';
import { WrappedFormUtils } from 'antd/lib/form/Form';

const WrapperForm = Form.create()(EmailForm as any);

@Relax
export default class EmailModal extends React.Component<any, any> {
  _form: any;

  props: {
    relaxProps?: {
      formVisible: boolean;
      emailFormCancel: Function;
      emailConfig: IMap;
      saveEmail: Function;
    };
  };

  static relaxProps = {
    formVisible: 'formVisible',
    emailFormCancel: noop,
    emailConfig: 'emailConfig',
    saveEmail: noop
  };

  render() {
    const { formVisible, emailFormCancel, emailConfig } = this.props.relaxProps;
    if (!formVisible) {
      return null;
    }
    return (
       <Modal  maskClosable={false}
        title="腾讯企业邮箱配置"
        visible={formVisible}
        onOk={() => this._onSave()}
        onCancel={() => emailFormCancel()}
      >
        {emailConfig.size != 0 && (
          <WrapperForm ref={(form) => (this['_form'] = form)} />
        )}
      </Modal>
    );
  }

  _onSave = () => {
    const form = this._form as WrappedFormUtils;
    form.validateFields(null, (errs) => {
      if (!errs) {
        const { saveEmail } = this.props.relaxProps;
        saveEmail();
      }
    });
  };
}
