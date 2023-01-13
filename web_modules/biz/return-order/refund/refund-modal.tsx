import React from 'react';
import { StoreProvider } from 'plume2';
import { Button, DatePicker, Form, Input, Modal, Select, Alert } from 'antd';
import { IList } from 'typings/globalType';
import { Const, QMMethod, ValidConst } from 'qmkit';
import AppStore from './store';

const FormItem = Form.Item;
const Option = Select.Option;

@StoreProvider(AppStore, { debug: __DEV__ })
export default class RefundModal extends React.Component<any, any> {
  store: AppStore;
  _form: any;
  WrapperForm: any;

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create()(RefundForm);
  }

  state = {
    posting: false,
    visible: false
  };

  componentWillReceiveProps(nextProps) {
    const visible = nextProps.data.get('visible');
    if (visible != this.state.visible) {
      if (visible) {
        this.store.init(nextProps.data.get('customerId'));
      }
      this.setState({ visible: visible });
    }
  }

  render() {
    const WrapperForm = this.WrapperForm;
    const { data, onHide, handleOk } = this.props;
    if (!data.get('visible')) {
      return null;
    }

    const formInitialData = {
      customerId: data.get('customerId'),
      accounts: this.store.state().get('accounts'),
      customerAccounts: this.store.state().get('customerAccounts'),
      refundAmount: data.get('refundAmount') || '',
      customerOfflineAccountName: data.get('customerOfflineAccountName') || '',
      customerOfflineAccountBank: data.get('customerOfflineAccountBank') || '',
      customerOfflineAccountNo: data.get('customerOfflineAccountNo') || ''
    };

    return (
       <Modal  maskClosable={false}
        title="添加退款记录"
        visible={data.get('visible')}
        onCancel={() => onHide()}
        footer={[
          <Button key="back" size="large" onClick={() => onHide()}>
            取消
          </Button>,
          <Button
            key="submit"
            type="primary"
            size="large"
            loading={this.state.posting}
            onClick={() => this._handleOk(handleOk)}
          >
            保存
          </Button>
        ]}
      >
        <WrapperForm
          ref={(form) => (this['_form'] = form)}
          {...formInitialData}
        />
      </Modal>
    );
  }

  _handleOk(handleOk: Function) {
    const { data, onHide } = this.props;
    this._form.validateFields(null, (errs, values) => {
      if (!errs) {
        values.createTime = values.createTime.format(Const.DATE_FORMAT);
        // customerId
        values.customerId = this.props.data.get('customerId');
        this.setState({ posting: true });
        handleOk(data.get('rid'), values)
          .then(() => {
            this.setState({ posting: false });
            onHide();
          })
          .catch(() => {
            this.setState({ posting: false });
          });
      }
    });
  }
}

class RefundForm extends React.Component<any, any> {
  props: {
    form: any;
    customerId: string;
    accounts: IList;
    customerAccounts: IList;
    refundAmount: number;
    customerOfflineAccountName: string;
    customerOfflineAccountBank: string;
    customerOfflineAccountNo: string;
  };

  state = {
    selectedAccountId: '' as string,
    // 是否新增客户账户
    isAddCustomerAccount: false as boolean
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    let createTime = {};
    let offlineAccountId = {};
    let refundAmount = this.props.refundAmount
      ? this.props.refundAmount.toString()
      : '';
    if (refundAmount) {
      refundAmount = parseFloat(refundAmount).toFixed(2);
    }

    return (
      <div style={styles.container}>
        <Alert message="请确认您已线下退款后再保存退款记录" type="info" />
        <Form>
          <FormItem>
            <Input type="hidden" value={this.props.customerId} />
          </FormItem>
          <FormItem {...formItemLayout} label="收款账户">
            <label style={{ wordBreak: 'break-all' }}>
              {this.props.customerOfflineAccountName}
            </label>
            <br />
            <label style={{ wordBreak: 'break-all' }}>
              {this.props.customerOfflineAccountBank}
            </label>
            <br />
            <label style={{ wordBreak: 'break-all' }}>
              {this.props.customerOfflineAccountNo}
            </label>
          </FormItem>
          {this.state.isAddCustomerAccount ? (
            <div>
              <FormItem {...formItemLayout} label="账户名">
                {getFieldDecorator('customerAccountName', {
                  rules: [
                    {
                      required: true,
                      message: '请填写账户名'
                    },
                    {
                      validator: (rule, value, callback) => {
                        QMMethod.validatorMinAndMax(
                          rule,
                          value,
                          callback,
                          '账户名',
                          1,
                          50
                        );
                      }
                    }
                  ]
                })(<Input />)}
              </FormItem>
              <FormItem {...formItemLayout} label="账号">
                {getFieldDecorator('customerAccountNo', {
                  rules: [
                    { required: true, message: '请填写账号' },
                    { max: 30, message: '账号长度必须为1-30个数字之间' },
                    { pattern: ValidConst.number, message: '请输入正确的账号' }
                  ]
                })(<Input />)}
              </FormItem>
              <FormItem {...formItemLayout} label="开户行">
                {getFieldDecorator('customerBankName', {
                  rules: [
                    {
                      required: true,
                      message: '请填写开户行'
                    },
                    {
                      validator: (rule, value, callback) => {
                        QMMethod.validatorMinAndMax(
                          rule,
                          value,
                          callback,
                          '开户行',
                          1,
                          50
                        );
                      }
                    }
                  ]
                })(<Input />)}
              </FormItem>
            </div>
          ) : null}

          <FormItem {...formItemLayout} label="退款账户">
            {getFieldDecorator('offlineAccountId', {
              ...offlineAccountId,
              rules: [{ required: true, message: '请选择退款账户' }]
            })(<Select>{this._renderOfflineBank()}</Select>)}
          </FormItem>

          <FormItem {...formItemLayout} label="退款日期">
            {getFieldDecorator('createTime', {
              ...createTime,
              rules: [{ required: true, message: '请选择退款日期' }]
            })(
              <DatePicker
                format={'YYYY-MM-DD'}
                disabledDate={this.disabledDate}
              />
            )}
          </FormItem>
        </Form>
      </div>
    );
  }

  /**
   * 客户收款账户选中
   * @param customerAccountId
   */
  onCustomerAccountSelect(customerAccountId) {
    this.setState({ isAddCustomerAccount: customerAccountId === '0' });
  }

  /**
   * 渲染银行名称
   * @param customerAccount customerAccount
   * @returns {string}
   * @private
   */
  _renderBankName(customerAccount) {
    return `${customerAccount.get('customerBankName')} ${customerAccount.get(
      'customerAccountNo'
    )}`;
  }

  /**
   *
   * @param offlineAccounts
   * @private
   */
  _renderOfflineBank() {
    const offlineAccounts = this.props.accounts;
    return offlineAccounts.map((offlineAccount) => {
      return (
        <Option
          value={offlineAccount.get('accountId').toString()}
          key={offlineAccount.get('accountId')}
        >
          {this._renderOfflineBankName(offlineAccount)}
        </Option>
      );
    });
  }

  _renderOfflineBankName(offlineAccount) {
    return `${offlineAccount.get('bankName')} ${offlineAccount.get('bankNo')}`;
  }

  disabledDate(current) {
    // Can not select days before today and today
    return current && current.valueOf() > Date.now();
  }
}

const formItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    span: 24,
    xs: { span: 24 },
    sm: { span: 14 }
  }
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 10
  },
  text: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 14
  },
  record: {
    color: '#333',
    fontSize: 14,
    paddingLeft: 30,
    paddingTop: 5,
    paddingBottom: 5
  } as any
} as any;
