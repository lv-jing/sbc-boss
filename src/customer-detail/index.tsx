import * as React from 'react';
import { StoreProvider } from 'plume2';
import { Breadcrumb } from 'antd';
import { Headline, BreadCrumb } from 'qmkit';
import AppStore from './store';
import CustomerDetailForm from './components/tab-edit-form';
import AddressInfoForm from './components/address-info-form';
import InvoiceSet from './components/invoice-set';
import CustomerEditForm from './components/customer-edit-form';
import './modal.less';
@StoreProvider(AppStore, { debug: __DEV__ })
export default class CustomerDetail extends React.Component<any, any> {
  store: AppStore;
  _form: any;
  componentDidMount() {
    const customerId =
      this.props.customerId || this.props.match.params.customerId;
    this.store.initCustomer(customerId);
  }

  render() {
    let tabIndex = this.props.tabIndex;
    return (
      <div>
        {/*导航面包屑*/}
        {!tabIndex && (
          <BreadCrumb>
            <Breadcrumb.Item>客户详情</Breadcrumb.Item>
          </BreadCrumb>
        )}
        {!tabIndex && (
          <div className="container">
            <Headline title="客户详情" />

            {/*客户详情编辑页面*/}
            <CustomerDetailForm />
          </div>
        )}
        {tabIndex === 1 && (
          <CustomerEditForm
            ref="_customerEditForm"
            type="modal"
            closeModal={this.props.closeModal}
            crmFlag={this.props.crmFlag}
          />
        )}
        {tabIndex === 2 && <AddressInfoForm />}
        {tabIndex === 3 && <InvoiceSet type="modal" />}
      </div>
    );
  }
}
