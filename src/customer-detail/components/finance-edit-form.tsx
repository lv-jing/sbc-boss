import React from 'react';
import { Relax } from 'plume2';
import { List } from 'immutable';
import { Modal } from 'antd';
import AccountInfo from '../../../web_modules/biz/account-info/index';
import { OneAuthWrapper } from 'qmkit';

type TList = List<any>;

/**
 * 添加/编辑银行账号
 */
@Relax
export default class AccountEditForm extends React.Component<any, any> {
  _accountInfoForm: any;
  props: {
    relaxProps?: {
      editAccountIndex: number;
      accountList: TList;
      accountFormVisible: boolean;
      addCustomerAccount: Function;
      updateCustomerAccount: Function;
      switchAccountFormVisible: Function;
    };
  };

  static relaxProps = {
    accountList: 'accountList',
    editAccountIndex: 'editAccountIndex',
    accountFormVisible: 'accountFormVisible',
    updateCustomerAccount: () => {},
    addCustomerAccount: () => {},
    switchAccountFormVisible: () => {}
  };

  render() {
    const {
      accountList,
      editAccountIndex,
      accountFormVisible,
      addCustomerAccount,
      updateCustomerAccount,
      switchAccountFormVisible
    } = this.props.relaxProps;

    const isEdit = editAccountIndex != -1;
    let accountInfo = null;
    if (isEdit) {
      accountInfo = accountList.get(editAccountIndex).toJS();
    }
    return (
      <div>
        {accountFormVisible && (
          <OneAuthWrapper
            functionName={
              'f_customer_detail_edit,f_enterprise_customer_detail_edit'
            }
          >
            <Modal
              maskClosable={false}
              title="银行账户"
              visible={accountFormVisible}
              onOk={() =>
                this._addAccount(
                  isEdit,
                  accountInfo && accountInfo.customerAccountId
                    ? accountInfo.customerAccountId
                    : null,
                  addCustomerAccount,
                  updateCustomerAccount
                )
              }
              onCancel={switchAccountFormVisible.bind(this, false)}
              okText="确认"
              cancelText="取消"
            >
              <AccountInfo
                account={accountInfo}
                ref={(accountInfo) => (this._accountInfoForm = accountInfo)}
              />
            </Modal>
          </OneAuthWrapper>
        )}
      </div>
    );
  }

  _addAccount = (
    isEdit: boolean,
    customerAccountId,
    addCustomerAccount,
    updateCustomerAccount
  ) => {
    this._accountInfoForm.data((values) => {
      if (isEdit) {
        updateCustomerAccount({
          ...values,
          customerAccountId
        });
      } else {
        addCustomerAccount(values);
      }
    });
  };
}
