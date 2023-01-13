import React from 'react';
import { Form, Input, Alert } from 'antd';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Store } from 'plume2';

const FormItem = Form.Item;
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
    a {
      float: right;
    }
  }
  .set-content {
    font-size: 14px;
    color: #999;
    line-height: 28px;
    margin-bottom: 12px;
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
    const wxShareSet = store.state().get('wxShareSet');
    const changeWxFormValue = (this._store as any).changeWxFormValue;
    const { getFieldDecorator } = this.props.form;
    const shareRequired = true;
    return (
      <FormDiv>
        <Form className="login-form">
          <p className="title">微信分享参数配置</p>
          <div className="set-content">
            <Alert
              message={
                <ul>
                  <li>
                    1、我们已经接通了微信分享功能，正确配置参数后您可使用商品、店铺分享功能；
                  </li>
                  <li>
                    2、微信内访问商城并进行微信分享，需申请并获得微信公众平台-公众号相关参数；
                  </li>
                  <li>
                    3、App商城进行微信分享，需申请并获得微信开放平台-移动应用的相关参数；
                  </li>
                  <li>
                    4、所需的微信公众号、微信开放平台移动应用参数可以与本系统内支付配置、登录接口所配参数一致；
                  </li>
                  <li>5、参数配置在点击保存后生效。</li>
                </ul>
              }
              type="info"
            />
          </div>
          {/* <div className="set-content">
            1、我们已经接通了微信分享功能，正确配置参数后您可使用商品、店铺分享功能；<br />
            2、微信内访问商城并进行微信分享，需申请并获得微信公众平台-公众号相关参数；<br />
            3、App商城进行微信分享，需申请并获得微信开放平台-移动应用的相关参数；<br />
            4、所需的微信公众号、微信开放平台移动应用参数可以与本系统内支付配置、登录接口所配参数一致；<br />
            5、参数配置在点击保存后生效。
          </div> */}
          <p className="title">
            微信公众号分享
            <a href="/wechat-share-doc" target="_blank" style={{}}>
              帮助
            </a>
          </p>

          <FormItem
            {...formItemLayout}
            label="AppID(应用ID)"
            required={shareRequired}
          >
            {getFieldDecorator('shareAppId', {
              initialValue: wxShareSet.get('shareAppId'),
              rules: [
                { required: shareRequired, message: '请输入AppID(应用ID)' },
                { max: 50, message: '最多50个字符' }
              ]
            })(
              <Input
                onChange={(e) =>
                  changeWxFormValue('shareAppId', (e as any).target.value)
                }
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="AppSecret(应用密钥)"
            required={shareRequired}
          >
            {getFieldDecorator('shareAppSecret', {
              initialValue: wxShareSet.get('shareAppSecret'),
              rules: [
                {
                  required: shareRequired,
                  message: '请输入AppSecret(应用密钥)'
                },
                { max: 50, message: '最多50个字符' }
              ]
            })(
              <Input
                onChange={(e) =>
                  changeWxFormValue('shareAppSecret', (e as any).target.value)
                }
              />
            )}
          </FormItem>
          <p className="title">微信App分享</p>
          <p className="app-main">
            请将您的App创建为您微信开放平台的移动应用，获取App ID、App
            Secret后，再由开发人员对App进行配置
          </p>
        </Form>
      </FormDiv>
    );
  }
}
