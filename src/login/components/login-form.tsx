import React from 'react';
import PropTypes from 'prop-types';
import { Form, Icon, Input, Button } from 'antd';
const FormItem = Form.Item;
const logo = require('../img/logo.png');
import { Store } from 'plume2';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { history, Const } from 'qmkit';

export default class LoginForm extends React.Component<any, any> {
  form;

  _store: Store;

  //声明上下文依赖
  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
    this.state = {
      loading: false
    };
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const loginLogo = this._store.state().get('loginLogo');

    return (
      <Form style={styles.loginForm}>
        <FormItem style={{ marginBottom: 15 }}>
          <div style={styles.header}>
            <img style={styles.logo} src={loginLogo ? loginLogo : logo} />
          </div>
          <strong style={styles.title}>Admin Portal</strong>
        </FormItem>
        <FormItem>
          {getFieldDecorator('account', {
            rules: [{ required: true, message: 'Please input account' }]
          })(
            <Input
              prefix={<Icon type="user" style={{ fontSize: 13 }} />}
              placeholder="Account"
            />
          )}
        </FormItem>
        <FormItem style={{ marginBottom: 0 }}>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input password' }]
          })(
            <Input
              prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
              type="password"
              placeholder="Password"
            />
          )}
        </FormItem>
        <FormItem>
          {/*{getFieldDecorator('isRemember', {
          })(
            <Checkbox>记住账号</Checkbox>
          )}*/}
          {/* <a
            style={{ float: 'left' }}
            onClick={() => history.push('/company-register')}
          >
            商家注册
          </a> */}
          <a
            style={{ float: 'right' }}
            onClick={() => history.push('/find-password')}
          >
            Forgot your password
          </a>
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
            loading={this.state.loading}
            style={styles.loginBtn}
            onClick={(e) => this._handleLogin(e)}
          >
            Log in
          </Button>
        </FormItem>
        <FormItem style={{ marginBottom: 0 }}>
          <div>
            {/* <p
              style={{ textAlign: 'center', lineHeight: '20px', color: '#999' }}
            >
              © 2017-2020 南京万米信息技术有限公司
            </p> */}
            {/* <p
              style={{ textAlign: 'center', lineHeight: '20px', color: '#999' }}
            >
              版本号：{Const.COPY_VERSION}
            </p> */}
          </div>
        </FormItem>
      </Form>
    );
  }

  _handleLogin = (e) => {
    e.preventDefault();
    const form = this.props.form as WrappedFormUtils;
    form.validateFields(null, (errs, values) => {
      //如果校验通过
      if (!errs) {
        this.setState({loading:true});
        (this._store as any).login(values, () => {
          this.setState({loading:false});
        });
      }
    });
  };
}

const styles = {
  loginForm: {
    width: 370,
    minHeight: 325,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 30,
    marginTop: -50,
    boxShadow: '0 0 20px 0 rgb(88 178 230 / 30%)'
  },
  loginBtn: {
    width: '100%'
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  logo: {
    display: 'block',
    width: 'auto',
    height: 42
  },
  title: {
    fontSize: 18,
    color: '#333',
    lineHeight: 1,
    textAlign: 'center',
    display: 'block'
  }
} as any;
