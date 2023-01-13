import React from 'react';
import { Row, Col, Icon, Button, Input, Form, Switch, message } from 'antd';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import {
  Const,
  ValidConst,
  QMUpload,
  Headline,
  AuthWrapper,
  isSystem
} from 'qmkit';
import Store from '../store';
import { WrappedFormUtils } from 'antd/lib/form/Form';
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 6,
    xs: { span: 6 },
    sm: { span: 6 }
  },
  wrapperCol: {
    span: 14,
    xs: { span: 14 },
    sm: { span: 18 }
  }
};

const GreyText = styled.span`
  color: #999999;
  margin-left: 5px;
`;

export default class ShareForm extends React.Component<any, any> {
  form;

  _store: Store;

  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const state = this._store.state();
    const required = state.get('enabled');

    if (state.get('loading')) {
      return null;
    }

    return (
      <Form
        style={{ paddingBottom: 50, maxWidth: 900 }}
        onSubmit={isSystem(this._handleSubmit)}
      >
        <Headline title="基础信息" />
        <Row>
          <Col span={18}>
            <FormItem {...formItemLayout} label="App分享开关">
              {getFieldDecorator('enabled', {
                initialValue: state.get('enabled')
              })(
                <Switch
                  checkedChildren="开"
                  unCheckedChildren="关"
                  checked={state.get('enabled')}
                  onChange={(e) => {
                    this._store.onFormFieldChange('enabled', e);
                    this.props.form.resetFields();
                  }}
                />
              )}
              <GreyText>开启后，App端个人中心展示分享App功能</GreyText>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={18}>
            <FormItem
              {...formItemLayout}
              label="App分享标题"
              required={required}
            >
              {getFieldDecorator('title', {
                initialValue: state.get('title'),
                rules: [
                  { required: required, message: '请填写App分享标题' },
                  { max: 30, message: '最多30个字' }
                ]
              })(
                <Input
                  placeholder="最多30个字"
                  onChange={(e) =>
                    this._store.onFormFieldChange(
                      'title',
                      (e.target as any).value
                    )
                  }
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={18}>
            <FormItem
              {...formItemLayout}
              label="App分享描述"
              required={required}
            >
              {getFieldDecorator('desc', {
                initialValue: state.get('desc'),
                rules: [
                  { required: required, message: '请填写App分享描述' },
                  { max: 30, message: '最多30个字' }
                ]
              })(
                <Input
                  placeholder="最多30个字"
                  onChange={(e) =>
                    this._store.onFormFieldChange(
                      'desc',
                      (e.target as any).value
                    )
                  }
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={18}>
            <FormItem required={required} {...formItemLayout} label="App图标">
              {getFieldDecorator('icon', {
                initialValue: state.getIn(['icon', 0, 'url']),
                rules: [
                  {
                    required: required,
                    message: '请上传App图标'
                  }
                ]
              })(<Input type="hidden" />)}
              <div className="clearfix logoImg">
                <QMUpload
                  style={styles.box}
                  action={Const.HOST + '/uploadImage'}
                  listType="picture-card"
                  name="uploadFile"
                  onChange={(fileEntity) =>
                    this.onImgChange('icon', fileEntity)
                  }
                  fileList={state.get('icon').toJS()}
                  beforeUpload={(file) => this._beforeUpload(file, 5)}
                >
                  {state.get('icon').size >= 1 ? null : (
                    <div>
                      <Icon type="plus" style={styles.plus} />
                    </div>
                  )}
                </QMUpload>
              </div>
              <GreyText>
                建议大小78*78 支持的图片格式:jpg、png、gif、jpeg
              </GreyText>
            </FormItem>
          </Col>
        </Row>

        <Headline title="下载信息" />
        <Row>
          <Col span={18}>
            <FormItem
              {...formItemLayout}
              label="IOS下载包地址"
              required={required}
            >
              {getFieldDecorator('iosUrl', {
                initialValue: state.get('iosUrl'),
                rules: [
                  { required: required, message: '请填写IOS下载包地址' },
                  { validator: this._checkUrl }
                ]
              })(
                <Input
                  placeholder="请维护ftp下载包地址，请系统工程师上传后进行维护"
                  onChange={(e) =>
                    this._store.onFormFieldChange(
                      'iosUrl',
                      (e.target as any).value
                    )
                  }
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={18}>
            <FormItem
              {...formItemLayout}
              label="Android下载包地址"
              required={required}
            >
              {getFieldDecorator('androidUrl', {
                initialValue: state.get('androidUrl'),
                rules: [
                  { required: required, message: '请填写Android下载包地址' },
                  { validator: this._checkUrl }
                ]
              })(
                <Input
                  placeholder="请维护ftp下载包地址，请系统工程师上传后进行维护"
                  onChange={(e) =>
                    this._store.onFormFieldChange(
                      'androidUrl',
                      (e.target as any).value
                    )
                  }
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={18}>
            <FormItem
              {...formItemLayout}
              label="App下载页面链接"
              required={required}
            >
              {getFieldDecorator('downloadUrl', {
                initialValue: state.get('downloadUrl'),
                rules: [
                  { required: required, message: '请填写App下载页面链接' },
                  { validator: this._checkUrl }
                ]
              })(
                <Input
                  placeholder="请维护下载页面链接"
                  onChange={(e) =>
                    this._store.onFormFieldChange(
                      'downloadUrl',
                      (e.target as any).value
                    )
                  }
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={18}>
            <FormItem
              required={required}
              {...formItemLayout}
              label="App下载图片"
            >
              {getFieldDecorator('downloadImg', {
                initialValue: state.getIn(['downloadImg', 0, 'url']),
                rules: [
                  {
                    required: required,
                    message: '请上传App下载图片'
                  }
                ]
              })(<Input type="hidden" />)}
              <div className="clearfix logoImg" style={{ marginBottom: 40 }}>
                <QMUpload
                  style={styles.box}
                  action={Const.HOST + '/uploadImage'}
                  listType="picture-card"
                  name="uploadFile"
                  onChange={(fileEntity) =>
                    this.onImgChange('downloadImg', fileEntity)
                  }
                  fileList={state.get('downloadImg').toJS()}
                  beforeUpload={(file) => this._beforeUpload(file, 5)}
                >
                  {state.get('downloadImg').size >= 1 ? null : (
                    <div>
                      <Icon type="plus" style={styles.plus} />
                    </div>
                  )}
                </QMUpload>
              </div>
              <GreyText>
                建议大小750*1334 支持的图片格式:jpg、png、gif、jpeg
              </GreyText>
            </FormItem>
          </Col>
        </Row>

        <Headline title="分享图片" />
        <Row>
          <Col span={18}>
            <FormItem
              required={required}
              {...formItemLayout}
              label="App分享图片"
            >
              {getFieldDecorator('shareImg', {
                initialValue: state.getIn(['shareImg', 0, 'url']),
                rules: [
                  {
                    required: required,
                    message: '请上传App分享图片'
                  }
                ]
              })(<Input type="hidden" />)}
              <div className="clearfix logoImg" style={{ marginBottom: 40 }}>
                <QMUpload
                  style={styles.box}
                  action={Const.HOST + '/uploadImage'}
                  listType="picture-card"
                  name="uploadFile"
                  onChange={(fileEntity) =>
                    this.onImgChange('shareImg', fileEntity)
                  }
                  fileList={state.get('shareImg').toJS()}
                  beforeUpload={(file) => this._beforeUpload(file, 5)}
                >
                  {state.get('shareImg').size >= 1 ? null : (
                    <div>
                      <Icon type="plus" style={styles.plus} />
                    </div>
                  )}
                </QMUpload>
              </div>
              <GreyText>
                建议大小750*1334
                支持的图片格式:jpg、png、gif、jpeg，请维护包含下载地址二维码的图片
              </GreyText>
            </FormItem>
          </Col>
        </Row>

        <AuthWrapper functionName="f_share_app_edit">
          <div className="bar-button">
            <Button type="primary" htmlType="submit">
              保存
            </Button>
          </div>
        </AuthWrapper>
      </Form>
    );
  }

  /**
   * 提交
   */
  _handleSubmit = (e) => {
    e.preventDefault();
    const form = this.props.form as WrappedFormUtils;
    form.validateFields(null, (errs) => {
      if (!errs) {
        this._store.save(form.getFieldsValue());
      }
    });
  };

  /**
   * 检查文件格式
   */
  _beforeUpload(file, size) {
    const isSupportImage =
      file.type === 'image/jpeg' ||
      file.type === 'image/gif' ||
      file.type == 'image/png';
    if (!isSupportImage) {
      message.error('只能上传jpg, png, gif类型的图片');
    }
    const isLt = file.size / 1024 / 1024 < size;
    if (!isLt) {
      message.error(`图片大小不能超过${size}MB!`);
    }
    return isSupportImage && isLt;
  }

  /**
   * 改变图片
   */
  onImgChange = (key, { file, fileList }) => {
    switch (file.status) {
      case 'error':
        message.error('上传失败');
        break;
      case 'removed':
        this._store.onFormFieldChange(key, []);
        this.props.form.setFieldsValue({ [key]: null });
        break;
      default:
        let response = fileList[0].response;
        this.props.form.setFieldsValue({
          [key]: response ? response[0] : ''
        });
        this._store.onFormFieldChange(key, fileList);
    }
  };

  /**
   * 校验url
   */
  _checkUrl = (_rule, value, callback) => {
    if (!value) {
      callback();
      return;
    }
    if (!ValidConst.url.test(value)) {
      callback(new Error('请输入正确的地址'));
      return;
    }
    if (value.length > 100) {
      callback(new Error('限制100个字符'));
      return;
    }
    callback();
  };
}

const styles = {
  box: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  } as any,
  plus: {
    color: '#999',
    fontSize: '28px'
  },
  alertBox: {
    marginLeft: 10
  },
  toolBox: {
    marginLeft: 10,
    height: 40,

    flexDirection: 'row',
    alignItems: 'center'
  } as any
};
