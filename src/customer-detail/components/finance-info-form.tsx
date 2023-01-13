import React from 'react';
import { Relax } from 'plume2';
import { List } from 'immutable';
import { Form, Popconfirm, Button, Row, Col } from 'antd';
import { OneAuthWrapper, noop } from 'qmkit';
import AccountEditForm from './finance-edit-form';

type TList = List<any>;

const formItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 2 }
  },
  wrapperCol: {
    span: 20,
    xs: { span: 24 },
    sm: { span: 24 }
  }
};

/**
 * 财务信息
 * 银行账号+增专资质
 */
@Relax
export default class FinanceInfoForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      accountList: TList;
      onEditAccount: Function;
      onDeleteAccount: Function;
      switchAccountFormVisible: Function;
      showAdd: boolean;
    };
  };

  static relaxProps = {
    accountList: 'accountList',
    onEditAccount: noop,
    onDeleteAccount: noop,
    switchAccountFormVisible: noop,
    showAdd: 'showAdd'
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {
      accountList,
      onEditAccount,
      onDeleteAccount,
      switchAccountFormVisible,
      showAdd
    } = this.props.relaxProps;
    return (
      <div>
        {accountList.isEmpty() ? (
          <span
            style={{
              color: '#999',
              display: 'block',
              marginTop: '5px',
              marginBottom: '15px'
            }}
          >
            该客户暂无银行账号
          </span>
        ) : (
          <span
            style={{
              color: '#999',
              display: 'block',
              marginTop: '5px',
              marginBottom: '15px'
            }}
          >
            最多可保存5个银行账号
          </span>
        )}
        <Form>
          <Form.Item hasFeedback {...formItemLayout}>
            {!accountList.isEmpty() &&
              accountList.map((v, k) => (
                <div key={k}>
                  <Row>
                    <Col span={6}>{v.get('customerAccountName')}</Col>
                    <Col span={6}>{v.get('customerAccountNo')}</Col>
                    <Col span={6}>{v.get('customerBankName')}</Col>

                    <OneAuthWrapper
                      functionName={
                        'f_customer_detail_edit,f_enterprise_customer_detail_edit'
                      }
                    >
                      <Col span={6}>
                        <a
                          href="javascript:void(0);"
                          onClick={() => onEditAccount(k)}
                        >
                          编辑
                        </a>
                        &nbsp;
                        <Popconfirm
                          title="确定删除当前的银行账号?"
                          onConfirm={() => {
                            onDeleteAccount(v.get('customerAccountId'));
                          }}
                          okText="确定"
                          cancelText="取消"
                        >
                          <a href="javascript:void(0);">删除</a>
                        </Popconfirm>
                      </Col>
                    </OneAuthWrapper>
                  </Row>
                </div>
              ))}
            {/*新增收货地址*/}
            <OneAuthWrapper
              functionName={
                'f_customer_detail_edit,f_enterprise_customer_detail_edit'
              }
            >
              <div className="handle-bar">
                <Button
                  type="primary"
                  disabled={showAdd}
                  onClick={switchAccountFormVisible.bind(this, true)}
                >
                  新增银行账号
                </Button>
              </div>
            </OneAuthWrapper>
          </Form.Item>
          <AccountEditForm />
        </Form>
      </div>
    );
  }
}
