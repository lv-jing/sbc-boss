import React from 'react';
import { Form, Input, Radio } from 'antd';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Store } from 'plume2';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 }
  }
};
const FormDiv = styled.div`
  font-size: 12px;
  .title {
    font-size: 14px;
    color: #333;
    margin-bottom: 15px;
  }
  .upload-tip {
    position: absolute;
    top: 0;
    right: 34px;
    color: #999;
  }
  .app-main {
    font-size: 14px;
    color: #999;
  }
`;

export default class WchatForm extends React.Component<any, any> {
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
    const store = this._store;
    const wxloginSet = store.state().get('wxloginSet');
    const changeWxFormValue = (this._store as any).changeWxFormValue;
    const { getFieldDecorator } = this.props.form;

    const mobileRequired = wxloginSet.get('mobileServerStatus') == 1;
    const pcRequired = wxloginSet.get('pcServerStatus') == 1;

    return (
      <FormDiv>
        <Form className="login-form">
          <p className="title">微信公众平台（微信商城）</p>
          <FormItem {...formItemLayout} label="启用开关" required>
            {getFieldDecorator('mobileServerStatus', {
              initialValue: wxloginSet.get('mobileServerStatus'),
              rules: [{ required: true, message: '请设置启用开关' }]
            })(
              <RadioGroup
                onChange={async (e) => {
                  await changeWxFormValue(
                    'mobileServerStatus',
                    (e as any).target.value
                  );
                  this.props.form.validateFields(
                    ['mobileAppId', 'mobileAppSecret'],
                    { force: true }
                  );
                }}
              >
                <Radio value={1}>启用</Radio>
                <Radio value={0}>禁用</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="AppID(应用ID)"
            required={mobileRequired}
          >
            {getFieldDecorator('mobileAppId', {
              initialValue: wxloginSet.get('mobileAppId'),
              rules: [
                { required: mobileRequired, message: '请输入AppID(应用ID)' },
                { max: 50, message: '最多50个字符' }
              ]
            })(
              <Input
                onChange={(e) =>
                  changeWxFormValue('mobileAppId', (e as any).target.value)
                }
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="AppSecret(应用密钥)"
            required={mobileRequired}
          >
            {getFieldDecorator('mobileAppSecret', {
              initialValue: wxloginSet.get('mobileAppSecret'),
              rules: [
                {
                  required: mobileRequired,
                  message: '请输入AppSecret(应用密钥)'
                },
                { max: 50, message: '最多50个字符' }
              ]
            })(
              <Input
                onChange={(e) =>
                  changeWxFormValue('mobileAppSecret', (e as any).target.value)
                }
              />
            )}
          </FormItem>
          <p className="title">微信开放平台网页应用（PC端）</p>
          <FormItem {...formItemLayout} label="启用开关" required>
            {getFieldDecorator('pcServerStatus', {
              initialValue: wxloginSet.get('pcServerStatus'),
              rules: [{ required: true, message: '请设置启用开关' }]
            })(
              <RadioGroup
                onChange={async (e) => {
                  await changeWxFormValue(
                    'pcServerStatus',
                    (e as any).target.value
                  );
                  this.props.form.validateFields(['pcAppId', 'pcAppSecret'], {
                    force: true
                  });
                }}
              >
                <Radio value={1}>启用</Radio>
                <Radio value={0}>禁用</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="AppID(应用ID)"
            required={pcRequired}
          >
            {getFieldDecorator('pcAppId', {
              initialValue: wxloginSet.get('pcAppId'),
              rules: [
                { required: pcRequired, message: '请输入AppID(应用ID)' },
                { max: 50, message: '最多50个字符' }
              ]
            })(
              <Input
                onChange={(e) =>
                  changeWxFormValue('pcAppId', (e as any).target.value)
                }
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="AppSecret(应用密钥)"
            required={pcRequired}
          >
            {getFieldDecorator('pcAppSecret', {
              initialValue: wxloginSet.get('pcAppSecret'),
              rules: [
                { required: pcRequired, message: '请输入AppSecret(应用密钥)' },
                { max: 50, message: '最多50个字符' }
              ]
            })(
              <Input
                onChange={(e) =>
                  changeWxFormValue('pcAppSecret', (e as any).target.value)
                }
              />
            )}
          </FormItem>
          <p className="title">微信开放平台移动端应用（APP）</p>
          <FormItem {...formItemLayout} label="启用开关" required>
            {getFieldDecorator('appServerStatus', {
              initialValue: wxloginSet.get('appServerStatus'),
              rules: [{ required: true, message: '请设置启用开关' }]
            })(
              <RadioGroup
                onChange={(e) =>
                  changeWxFormValue('appServerStatus', (e as any).target.value)
                }
              >
                <Radio value={1}>启用</Radio>
                <Radio value={0}>禁用</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <p className="app-main">
            申请移动端应用，获取APPID(应用ID)AppSecret(应用密钥)后，由相应开发人员对APP相应配置后，才可启用
          </p>
        </Form>
      </FormDiv>
    );
  }
}
