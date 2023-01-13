import * as React from 'react';
import { IMap, Relax } from 'plume2';
import PropTypes from 'prop-types';
import { Alert, Form, Icon, Input, message, Modal, Switch, Upload } from 'antd';
import { noop } from 'qmkit';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import Store from '../store';
import Const from '../../../web_modules/qmkit/config';

const Dragger = Upload.Dragger;

const header = {
  Accept: 'application/json',
  authorization: 'Bearer ' + (window as any).token
};
const FILE_MAX_SIZE = 50 * 1024;

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
    sm: { span: 18 }
  }
};

@Relax
export default class WxPayModal extends React.Component<any, any> {
  _form;
  GateWaysForm: any;

  constructor(props) {
    super(props);
    this.GateWaysForm = Form.create()(GateWaysForm as any);
  }

  props: {
    relaxProps?: {
      wx_pay_visible: boolean;
      onSaveChannel: Function;
      onCancelWxPayModal: Function;
      channelJson: IMap;
      onFormValueChange: Function;
    };
  };

  static relaxProps = {
    wx_pay_visible: 'wx_pay_visible',
    onSaveChannel: noop,
    onCancelWxPayModal: noop,
    channelJson: 'channelJson',
    onFormValueChange: noop
  };

  render() {
    const { wx_pay_visible, onCancelWxPayModal } = this.props.relaxProps;

    const GateWaysForm = this.GateWaysForm;

    if (!wx_pay_visible) {
      return null;
    }
    return (
       <Modal  maskClosable={false}
        width={1100}
        title={'配置微信支付'}
        visible={true}
        onOk={() => this._handleOk()}
        onCancel={() => onCancelWxPayModal()}
      >
        <div>
          <Alert
            message={
              <ul>
                <li>
                  1、我们已经接入了微信支付，在微信商户平台注册完成后，在产品中心开通对应的产品。
                </li>
                <li>2、在微信商户平台获取相应参数后，完成下方参数配置。</li>
                <li>
                  4、App微信支付需在微信开放平台中创建移动应用后单独进行开通，开通完成后请完成APP支付配置
                </li>
                <li>5、该支付功能同聚合支付中微信支付功能互斥不可同时开通</li>
              </ul>
            }
            type="info"
          />
          <div>
            <div className="pay-title">
              <h2>微信支付接口</h2>
              <span>重要参数请谨慎配置，填写错误将无法正常使用在线支付</span>
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
    this.state = {
      current: 0,
      ext: '',
      fileName: '',
      err: false,
      errBtn: false,
      loading: false,
      isImport: true,
      openErr: false,
      openFileName: ''
    };
  }

  render() {
    const channelJson = this._store.state().get('channelJson');
    if (!channelJson) return;
    const onFormValueChange = this._store.onFormValueChange;

    const fromValue = channelJson.get('payGatewayConfig');
    const { getFieldDecorator } = this.props.form;
    const { fileName, err, openFileName, openErr } = this.state;
    return (
      <Form>
        <FormItem {...formItemLayout} label="微信公众号App ID" required={true}>
          {getFieldDecorator('appId', {
            initialValue: fromValue.get('appId'),
            rules: [
              { required: false, message: '请输入微信公众号App ID' },
              { max: 40, message: '最多40字符' }
            ]
          })(
            <Input
              placeholder="开通微信公众号支付需在此配置您的微信公众号App ID"
              onChange={(e) => {
                onFormValueChange(
                  'payGatewayConfig.appId',
                  (e.target as any).value
                );
              }}
            />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="微信公众号App Secret"
          required={true}
        >
          {getFieldDecorator('secret', {
            initialValue: fromValue.get('secret'),
            rules: [
              { required: false, message: '请输入微信公众号Secret Key' },
              { max: 60, message: '最多60字符' }
            ]
          })(
            <Input
              placeholder="开通微信公众号支付需在此配置您的微信公众号 App Secret"
              onChange={(e) => {
                onFormValueChange(
                  'payGatewayConfig.secret',
                  (e.target as any).value
                );
              }}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="商户号" required={true}>
          {getFieldDecorator('account', {
            initialValue: fromValue.get('account'),
            rules: [
              { required: true, whitespace: true, message: '请输入商户号' },
              { max: 30, message: '最多30字符' }
            ]
          })(
            <Input
              placeholder="商户号"
              onChange={(e) => {
                onFormValueChange(
                  'payGatewayConfig.account',
                  (e.target as any).value
                );
              }}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="API密钥" required={true}>
          {getFieldDecorator('apiKey', {
            initialValue: fromValue.get('apiKey'),
            rules: [
              { required: true, whitespace: true, message: '请输入API密钥' },
              { max: 100, message: '最多100字符' }
            ]
          })(
            <Input
              placeholder="请填写您获得的API密钥"
              onChange={(e) => {
                onFormValueChange(
                  'payGatewayConfig.apiKey',
                  (e.target as any).value
                );
              }}
            />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="开放平台App ID" required={true}>
          {getFieldDecorator('openPlatformAppId', {
            initialValue: fromValue.get('openPlatformAppId'),
            rules: [
              { required: false, message: '请输入微信开放平台App ID' },
              { max: 100, message: '最多100字符' }
            ]
          })(
            <Input
              placeholder="开通微信app支付需在此配置您的微信开放平台App ID"
              onChange={(e) => {
                onFormValueChange(
                  'payGatewayConfig.openPlatformAppId',
                  (e.target as any).value
                );
              }}
            />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="开放平台App Secret"
          required={true}
        >
          {getFieldDecorator('openPlatformSecret', {
            initialValue: fromValue.get('openPlatformSecret'),
            rules: [
              { required: false, message: '请输入开放平台Secret Key' },
              { max: 100, message: '最多100字符' }
            ]
          })(
            <Input
              placeholder="开通微信app支付需在此配置您的微信公众号 App Secret"
              onChange={(e) => {
                onFormValueChange(
                  'payGatewayConfig.openPlatformSecret',
                  (e.target as any).value
                );
              }}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="开放平台商户号" required={true}>
          {getFieldDecorator('openPlatformAccount', {
            initialValue: fromValue.get('openPlatformAccount'),
            rules: [
              {
                required: true,
                whitespace: true,
                message: '请输入开放平台商户号'
              },
              { max: 30, message: '最多30字符' }
            ]
          })(
            <Input
              placeholder="开放平台商户号"
              onChange={(e) => {
                onFormValueChange(
                  'payGatewayConfig.openPlatformAccount',
                  (e.target as any).value
                );
              }}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="开放平台API密钥" required={true}>
          {getFieldDecorator('openPlatformApiKey', {
            initialValue: fromValue.get('openPlatformApiKey'),
            rules: [
              {
                required: true,
                whitespace: true,
                message: '请输入开放平台API密钥'
              },
              { max: 100, message: '最多100字符' }
            ]
          })(
            <Input
              placeholder="请填写您获得的开放平台API密钥"
              onChange={(e) => {
                onFormValueChange(
                  'payGatewayConfig.openPlatformApiKey',
                  (e.target as any).value
                );
              }}
            />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="通知url" required={true}>
          {getFieldDecorator('bossBackUrl', {
            initialValue: fromValue.get('bossBackUrl'),
            rules: [
              { required: true, message: '通知url' },
              { max: 200, message: '最多200字符' },
              { validator: this.checkWebsite }
            ]
          })(
            <Input
              placeholder="通知url"
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
        <FormItem {...formItemLayout} label="微信公众平台支付证书">
          <div className="steps-content" style={styles.center}>
            <Dragger
              name="uploadFile"
              multiple={false}
              showUploadList={false}
              accept=".p12"
              headers={header}
              action={
                Const.HOST +
                `/tradeManage/uploadPayCertificate?gatewayConfigId=${fromValue.get(
                  'id'
                )}&type=1`
              }
              beforeUpload={this._checkUploadFile}
              onChange={this.upload}
            >
              <div style={styles.content}>
                <p
                  className="ant-upload-hint"
                  style={{ fontSize: 14, color: 'black' }}
                >
                  {' '}
                  <Icon type="upload" />选择文件上传
                </p>
              </div>
            </Dragger>
            <div style={styles.tip}>{fileName}</div>
            {err ? (
              <div style={styles.tip}>
                <span style={styles.error}>导入失败！</span>
              </div>
            ) : null}
            <p style={styles.grey}>
              请选择正确的微信支付证书上传（上传成功即替换成功）。
            </p>
          </div>
        </FormItem>
        <FormItem {...formItemLayout} label="微信开放平台支付证书">
          <div className="steps-content" style={styles.center}>
            <Dragger
              name="uploadFile"
              multiple={false}
              showUploadList={false}
              accept=".p12"
              headers={header}
              action={
                Const.HOST +
                `/tradeManage/uploadPayCertificate?gatewayConfigId=${fromValue.get(
                  'id'
                )}&type=2`
              }
              beforeUpload={this._checkUploadFile}
              onChange={this.openUpload}
            >
              <div style={styles.content}>
                <p
                  className="ant-upload-hint"
                  style={{ fontSize: 14, color: 'black' }}
                >
                  {' '}
                  <Icon type="upload" />选择文件上传
                </p>
              </div>
            </Dragger>
            <div style={styles.tip}>{openFileName}</div>
            {openErr ? (
              <div style={styles.tip}>
                <span style={styles.error}>导入失败！</span>
              </div>
            ) : null}
            <p style={styles.grey}>
              请选择正确的微信支付证书上传（上传成功即替换成功）。
            </p>
          </div>
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

  /**
   * 检查文件格式
   */
  _checkUploadFile = (file) => {
    let fileName = file.name.toLowerCase();
    // 支持的图片格式：jpg、jpeg、png、gif
    if (fileName.endsWith('.p12')) {
      if (file.size <= FILE_MAX_SIZE) {
        return true;
      } else {
        message.error('文件大小不能超过50KB');
        return false;
      }
    } else {
      message.error('文件格式错误');
      return false;
    }
  };

  upload = (info) => {
    const status = info.file.status;
    let loading = true;
    let err = false;
    if (status == 'uploading') {
      const fileName = '';
      const ext = '';
      this.setState({ ext, fileName, loading, err });
    }
    if (status === 'done') {
      let fileName = '';
      let ext = '';
      loading = false;
      if (info.file.response.code == Const.SUCCESS_CODE) {
        fileName = info.file.name;
        ext = info.file.response.context;
        let isImport = false;
        this.setState({ isImport });
        message.success(fileName + '上传成功');
      } else {
        if (info.file.response === 'Method Not Allowed') {
          message.error('此功能您没有权限访问');
        } else {
          message.error(info.file.response.message);
        }
      }
      this.setState({ ext, fileName, loading, err });
      return;
    } else if (status === 'error') {
      message.error('上传失败');
      loading = false;
      this.setState({ loading, err });
      return;
    }
  };

  openUpload = (info) => {
    const status = info.file.status;
    let loading = true;
    let openErr = false;
    if (status == 'uploading') {
      const openFileName = '';
      const ext = '';
      this.setState({ ext, openFileName, loading, openErr });
    }
    if (status === 'done') {
      let openFileName = '';
      let ext = '';
      loading = false;
      if (info.file.response.code == Const.SUCCESS_CODE) {
        openFileName = info.file.name;
        ext = info.file.response.context;
        let isImport = false;
        this.setState({ isImport });
        message.success(openFileName + '上传成功');
      } else {
        if (info.file.response === 'Method Not Allowed') {
          message.error('此功能您没有权限访问');
        } else {
          message.error(info.file.response.message);
        }
      }
      this.setState({ ext, openFileName, loading, openErr });
      return;
    } else if (status === 'error') {
      message.error('上传失败');
      loading = false;
      this.setState({ loading, openErr });
      return;
    }
  };
}

const styles = {
  uploadTit: {
    margin: '40px 200px'
  },
  content: {
    background: '#fcfcfc',
    padding: '50px 0'
  },
  grey: {
    color: '#999999',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10
  },
  tip: {
    marginTop: 10,
    marginLeft: 10,
    color: '#333'
  },
  error: {
    color: '#e10000'
  },
  grey1: {
    color: '#666666',
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 10
  },
  center: {
    textAlign: 'center'
  },
  greyBig: {
    color: '#333333',
    fontSize: 16,
    fontWeight: 'bold'
  } as any
};
