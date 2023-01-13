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
      wxFormVisible: boolean;
      changeWxFormVisible: Function;
      wxShareSet: IMap;
      saveWx: Function;
    };
  };

  static relaxProps = {
    wxFormVisible: 'wxFormVisible',
    wxShareSet: 'wxShareSet',
    changeWxFormVisible: noop,
    saveWx: noop
  };
  render() {
    const { wxFormVisible, changeWxFormVisible } = this.props.relaxProps;
    if (!wxFormVisible) {
      return null;
    }
    return (
       <Modal  maskClosable={false}
        title="微信分享参数配置"
        visible={wxFormVisible}
        onOk={() => this.onSave()}
        onCancel={() => changeWxFormVisible()}
      >
        <WrapperForm ref={(form) => (this['_form'] = form)} />
      </Modal>
    );
  }

  onSave = () => {
    const { saveWx } = this.props.relaxProps;
    const form = this._form as WrappedFormUtils;
    form.validateFields(null, (errs, values) => {
      if (!errs) {
        saveWx(values);
      }
    });
  };
}
