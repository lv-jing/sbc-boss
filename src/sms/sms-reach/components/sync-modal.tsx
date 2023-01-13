import React from 'react';
import { Relax } from 'plume2';
import { Modal, Form, Alert, message } from 'antd';
import { noop } from 'qmkit';
import TextArea from 'antd/lib/input/TextArea';
const formItemLayout = {
  labelCol: {
    span: 4
  },
  wrapperCol: {
    span: 20
  }
};

@Relax
export default class SyncModal extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      text: ''
    };
  }
  _form: any;

  props: {
    relaxProps?: {
      syncModalVisible: boolean;
      setData: Function;
      syncHistoryTemplate: Function;
      syncHistorySign: Function;
      syncType: boolean;
      syncSign: Function;
    };
  };

  static relaxProps = {
    syncModalVisible: 'syncModalVisible',
    syncType: 'syncType',
    setData: noop,
    syncHistoryTemplate: noop,
    syncHistorySign: noop
  };

  render() {
    const { syncModalVisible, syncType } = this.props.relaxProps;

    return (
       <Modal  maskClosable={false}
        title={syncType ? '同步历史模板' : '同步历史签名'}
        visible={syncModalVisible}
        onOk={this._handleOK}
        onCancel={this._handleCancel}
        width={530}
        destroyOnClose={true}
      >
        <Alert
          message={
            syncType ? (
              '输入模板code，点击同步，将阿里云后台已有模板同步至本系统，多个code用英文“;”分隔。'
            ) : (
              <div>
                <p>
                  1、输入签名名称，点击同步，将阿里云后台已有签名同步至本系统，多个签名用英文“;”分隔。
                </p>
                <p>
                  2、仅支持同步适用场景为“通用”的签名，同步其他场景的签名会导致短信发送出错；
                </p>
              </div>
            )
          }
          type="info"
        />
        <Form className="sync-form">
          <Form.Item
            label={syncType ? '模板code' : '签名名称'}
            required
            {...formItemLayout}
          >
            <TextArea
              placeholder={
                syncType
                  ? '如：SMS_000000000;SMS_111111111'
                  : '如：万米;万米商云'
              }
              rows={4}
              value={this.state.text}
              onChange={(e) => {
                this.setState({ text: e.target.value });
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    );
  }

  _handleOK = () => {
    const {
      syncType,
      syncHistoryTemplate,
      syncHistorySign
    } = this.props.relaxProps;
    if (this.state.text) {
      if (syncType) {
        syncHistoryTemplate(this.state.text);
      } else {
        syncHistorySign(this.state.text);
      }
    } else {
      message.error('请输入历史' + (syncType ? '模板' : '签名'));
    }
    this.setState({ text: '' });
  };
  _handleCancel = () => {
    this.props.relaxProps.setData('syncModalVisible', false);
    this.setState({
      text: ''
    });
  };
}
