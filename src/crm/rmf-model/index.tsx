import React from 'react';
import { StoreProvider } from 'plume2';
import { Headline, AuthWrapper, BreadCrumb } from 'qmkit';
import RmfAlert from './components/rmf-alert';
import AppStore from './store';
import RmfPieContext from './components/rmf-pie-context';
import RmfBar from './components/rmf-bar'
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
      <AuthWrapper functionName={'f_rfm_model_list'}>
        <BreadCrumb />
        <div className="container">
          <Headline title="RFM模型调参" />
          <RmfAlert />
          <RmfPieContext />
          <RmfBar />
        </div>
      </AuthWrapper>
    );
  }
}
