import React from 'react';
import { Form,message } from 'antd';
import { Headline,BreadCrumb,checkAuth, AuthWrapper } from 'qmkit';
import { StoreProvider } from 'plume2';
import InfoForm from './components/info-form';
import AppStore from './store';
import { FormattedMessage } from 'react-intl';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class CompanyInformation extends React.Component<any, any> {
  store: AppStore;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if(checkAuth('f_companyInformation_0')){
      this.store.init();
    }else{
      message.error('You do not have permission to access this feature');
    }
  }

  render() {
    const InfoFormDetail = Form.create()(InfoForm);

    return (
      <div>
        <BreadCrumb/>
        {
          <AuthWrapper functionName="f_companyInformation_0">
           <div className="container">
              <Headline title={<FormattedMessage id="Setting.CompanyInformation" />} />
              <InfoFormDetail />
           </div>
          </AuthWrapper>
        }
      </div>
    );
  }
}
