import * as React from 'react';
import { IMap, Relax } from 'plume2';
import PropTypes from 'prop-types';
import { Alert, Form, Input, Modal, Switch } from 'antd';
import { noop } from 'qmkit';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import Store from '../store';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    span: 24,
    xs: { span: 24 },
    sm: { span: 14 }
  }
};

@Relax
export default class PayModal extends React.Component<any, any> {
  _form;
  GateWaysForm: any;

  constructor(props) {
    super(props);
    this.GateWaysForm = Form.create()(GateWaysForm as any);
  }

  props: {
    relaxProps?: {
      alipay_visible: boolean;
      onSaveChannel: Function;
      onCancelaliPayModal: Function;
      channelJson: IMap;
      onFormValueChange: Function;
    };
  };

  static relaxProps = {
    alipay_visible: 'alipay_visible',
    onSaveChannel: noop,
    onCancelaliPayModal: noop,
    channelJson: 'channelJson',
    onFormValueChange: noop
  };

  render() {
    const { alipay_visible, onCancelaliPayModal } = this.props.relaxProps;

    const GateWaysForm = this.GateWaysForm;

    if (!alipay_visible) {
      return null;
    }

    return (
       <Modal  maskClosable={false}
        width={1100}
        title={'配置支付宝支付'}
        visible={true}
        onOk={() => this._handleOk()}
        onCancel={() => onCancelaliPayModal()}
      >
        <div>
          <Alert
            message={
              <ul>
                <li>
                  1、我们已经接入支付宝支付，您可注册并登录<a
                    href="https://auth.alipay.com/login/index.htm?goto=https%3A%2F%2Fdocs.open.alipay.com%2Fapi_1%2Falipay.trade.refund"
                    target="_blank"
                  >
                    支付宝管理平台
                  </a>获取您的相关参数。
                </li>
                <li>
                  2、在支付宝管理平台开通支付渠道后，您可在此控制相应渠道的开启或关闭。
                </li>
                <li>3、参数配置在点击保存后生效。</li>
              </ul>
            }
            type="info"
          />
          <div>
            <div className="pay-title">
              <h2>支付宝支付接口</h2>
              <span>重要参数请谨慎配置，填写错误将无法正常使用在线支付</span>
              {/*<a href="/pay-help-doc" target="_blank">*/}
              {/*查看帮助*/}
              {/*</a>*/}
            </div>
            <div style={{ width: 640, marginTop: 20 }}>
              <GateWaysForm ref={(form) => (this._form = form)} />
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  _handleOk() {
    const gatewayForm = this._form as WrappedFormUtils;
    const { onSaveChannel } = this.props.relaxProps;
    gatewayForm.validateFields(null, (errs) => {
      if (!errs) {
        onSaveChannel();
      }
    });
  }
}

class GateWaysForm extends React.Component<any, any> {
  _store: Store;

  //声明上下文依赖
  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
  }

  render() {
    const channelJson = this._store.state().get('channelJson');
    if (!channelJson) return;
    const onFormValueChange = this._store.onFormValueChange;

    const fromValue = channelJson.get('payGatewayConfig');
    const { getFieldDecorator } = this.props.form;
    return (
      <Form>
        <FormItem {...formItemLayout} label="App ID" required={true}>
          {getFieldDecorator('appId', {
            initialValue: fromValue.get('appId'),
            rules: [
              { required: true, whitespace: true, message: '请输入App ID' },
              { max: 40, message: '最多40字符' }
            ]
          })(
            <Input
              placeholder="请填写您在支付宝平台的应用ID（App ID）"
              onChange={(e) => {
                onFormValueChange(
                  'payGatewayConfig.appId',
                  (e.target as any).value
                );
              }}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="支付宝公钥" required={true}>
          {getFieldDecorator('publicKey', {
            initialValue: fromValue.get('publicKey'),
            rules: [
              { required: true, whitespace: true, message: '请输入支付宝公钥' },
              { max: 1200, message: '最多1200字符' }
            ]
          })(
            <Input.TextArea
              placeholder="请填写您在支付宝管理平台配置的支付宝公钥"
              onChange={(e) => {
                onFormValueChange(
                  'payGatewayConfig.publicKey',
                  (e.target as any).value
                );
              }}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="商户私钥" required={true}>
          {getFieldDecorator('privateKey', {
            initialValue: fromValue.get('privateKey'),
            rules: [
              { required: true, whitespace: true, message: '请输入商户私钥' },
              { max: 2000, message: '最多3000字符' }
            ]
          })(
            <Input.TextArea
              placeholder="请填写您在支付宝管理平台配置的商户私钥"
              onChange={(e) => {
                onFormValueChange(
                  'payGatewayConfig.privateKey',
                  (e.target as any).value
                );
              }}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="回调url" required={true}>
          {getFieldDecorator('bossBackUrl', {
            initialValue: fromValue.get('bossBackUrl'),
            rules: [
              { required: true, message: '请输入BOSS后台地址' },
              { max: 200, message: '最多200字符' },
              { validator: this.checkWebsite }
            ]
          })(
            <Input
              placeholder="请填写BOSS后台地址"
              onChange={(e) => {
                onFormValueChange(
                  'payGatewayConfig.bossBackUrl',
                  (e.target as any).value
                );
              }}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="是否启用" required={true}>
          <Switch
            checkedChildren="开"
            unCheckedChildren="关"
            onChange={(e) => {
              onFormValueChange('isOpen', e ? 1 : 0);
            }}
            defaultChecked={channelJson.get('isOpen') == 1}
          />
        </FormItem>
      </Form>
    );
  }
  checkWebsite = (_rule, value, callback) => {
    if (!value) {
      callback();
      return;
    }
    const pcWebsiteReg = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/;
    if (!pcWebsiteReg.test(value)) {
      callback(new Error('请输入正确的网址'));
      return;
    }
    callback();
  };
}
