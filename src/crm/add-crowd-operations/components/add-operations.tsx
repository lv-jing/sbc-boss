import React from 'react';
import { noop } from 'qmkit';
import { Relax } from 'plume2';
import { Form } from 'antd';
import AddOperationsForm from './add-operations-form';

const WrappedTemplateForm = Form.create({})(AddOperationsForm);

@Relax
export default class AddOperations extends React.Component<any, any> {
  _form: any;
  props: {
    relaxProps?: {
      setData: Function;
      ifModify: boolean;
      ifEdit: boolean;
      getCustomerGroupList: Function;
    };
  };

  static relaxProps = {
    setData: noop,
    ifEdit: 'ifEdit',
    ifModify: 'ifModify',
    customerGroupList: 'customerGroupList',
    operationForm: 'operationForm',
    saveOperation: noop,
    getCustomerTotal: noop,
    customerTotal: 'customerTotal',
    coupons: 'coupons',
    invalidCoupons: 'invalidCoupons',
    activity: 'activity',
    planSms: 'planSms',
    planAppPush: 'planAppPush',
    getCustomerGroupList: noop
  };

  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="add-operations">
        <WrappedTemplateForm
          ref={(form) => (this._form = form)}
          {...this.props.relaxProps}
        />
      </div>
    );
  }
}
