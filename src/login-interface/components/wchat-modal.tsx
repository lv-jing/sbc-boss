import React from 'react';
import { Relax, IMap } from 'plume2';
import { Modal, Form } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { noop } from 'qmkit';
import WchatForm from './wchat-form';
const WrapperForm = Form.create()(WchatForm as any);

@Relax
export default class WchatModal extends React.Component<any, any> {
  _form: any;

  props: {
    relaxProps?: {
      formVisible: boolean;
      wxFormCancel: Function;
      wxloginSet: IMap;
      saveWx: Function;
    };
  };

  static relaxProps = {
    formVisible: 'formVisible',
    wxloginSet: 'wxloginSet',
    wxFormCancel: noop,
    saveWx: noop
  };
  render() {
    const { formVisible, wxFormCancel, wxloginSet } = this.props.relaxProps;
    if (!formVisible) {
      return null;
    }
    return (
       <Modal  maskClosable={false}
        title="微信授权登录配置"
        visible={formVisible}
        onOk={() => this.onSave()}
        onCancel={() => wxFormCancel()}
      >
        {wxloginSet.size != 0 && (
          <WrapperForm ref={(form) => (this['_form'] = form)} />
        )}
      </Modal>
    );
  }

  onSave = () => {
    const { saveWx } = this.props.relaxProps;
    const form = this._form as WrappedFormUtils;
    form.validateFields(null, { force: true }, (errs, values) => {
      if (!errs) {
        saveWx(values);
      }
    });
  };
}
