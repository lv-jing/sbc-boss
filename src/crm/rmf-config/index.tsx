import React from 'react';
import { StoreProvider } from 'plume2';
import { AuthWrapper, BreadCrumb, Headline } from 'qmkit';
import RmfAlert from './components/rmf-alert';
import RmfForm from './components/rmf-form';
import AppStore from './store';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class AboutUs extends React.Component<any, any> {
  store: AppStore;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.store.init();
  }

  render() {
    return (
      <AuthWrapper functionName={'f_rfm_param'}>
        <BreadCrumb/>
        <div className="container rmf-config">
          <Headline title="RFM模型调参" />
          <RmfAlert />
          <RmfForm />
        </div>
      </AuthWrapper>
    );
  }
}
