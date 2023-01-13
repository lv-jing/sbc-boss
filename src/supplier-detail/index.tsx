import React from 'react';
import { StoreProvider } from 'plume2';
import { Breadcrumb, Tabs, Form, Button } from 'antd';
import { Headline, history, BreadCrumb, AuthWrapper } from 'qmkit';
import AppStore from './store';
import StepOne from './components/step-one';
import StepTwo from './components/step-two';
import StepThree from './components/step-three';
import StepFour from './components/step-four';
import { FormattedMessage } from 'react-intl';
const TabPane = Tabs.TabPane;
const StepTwoForm = Form.create()(StepTwo as any);
const StepOneForm = Form.create()(StepOne as any);
const StepFourForm = Form.create()(StepFour as any);

@StoreProvider(AppStore, { debug: __DEV__ })
export default class SupplierDetail extends React.Component<any, any> {
  store: AppStore;

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const { sid } = this.props.match.params;
    this.store.init(sid);
    this.store.initCountryDictionary();
    this.store.initCityDictionary();
    this.store.initLanguageDictionary();
    this.store.initCurrencyDictionary();
    this.store.initTimeZoneDictionary();
  }

  render() {
    const momentTab = this.store.state().get('momentTab');
    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>
            <FormattedMessage id="Store.MerchantDetails" />
          </Breadcrumb.Item>
        </BreadCrumb>
        <div className="container">
          <Headline title={<FormattedMessage id="Store.MerchantDetails" />} />
          <Tabs
            defaultActiveKey={momentTab}
            onChange={(data) => this.change(data)}
          >
            <TabPane
              tab={<FormattedMessage id="Store.BasicInformation" />}
              key="1"
            >
              <StepOneForm />
            </TabPane>
            <TabPane
              tab={<FormattedMessage id="Store.BusinessInformation" />}
              key="2"
            >
              <StepTwoForm />
            </TabPane>
            <TabPane tab={<FormattedMessage id="Store.ContractAgreement" />} key="3">
              <StepThree />
            </TabPane>
            <TabPane
              tab={<FormattedMessage id="Store.FinancialInformation" />}
              key="4"
            >
              <StepFourForm />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }

  /**
   * 切换tab页面
   */
  change = (value) => {
    this.store.setTab(value);
  };
}
