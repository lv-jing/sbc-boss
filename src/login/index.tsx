import React from 'react';
import { Form } from 'antd';
import { StoreProvider } from 'plume2';
import LoginForm from './components/login-form';
const bg = require('./img/bg1.jpg');
import AppStore from './store';
@StoreProvider(AppStore, { debug: __DEV__ })
export default class Login extends React.Component<any, any> {
  store: AppStore;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.store.init();
  }

  render() {
    const LoginFormDetail = Form.create()(LoginForm);

    return (
      <div style={styles.container}>
        {
         this.store.state().get('refresh') && <LoginFormDetail />
        }       
      </div>
    );
  }
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#fff',
    backgroundImage: 'url(' + bg + ')',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
  } as any
};
