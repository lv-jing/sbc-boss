import React from 'react';
import { Relax } from 'plume2';
import { Form, Select, Icon, Button, Input } from 'antd';

import { SelectGroup, noop, AuthWrapper } from 'qmkit';

const FormItem = Form.Item;
const Option = Select.Option;

@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      //改变支付方式
      changePayWay: Function;
      changeTradeNo: Function;
      payWaysObj: any;
      incomeDetail: any;
      kind: string;
      //导出收入明细
      exportIncomeDetail: Function;
      exportRefundDetail: Function;
      refundDetail: any;
      storeName: string;
    };
    name?: string;
  };

  static relaxProps = {
    changePayWay: noop,
    changeTradeNo: noop,
    payWaysObj: 'payWaysObj',
    incomeDetail: 'incomeDetail',
    refundDetail: 'refundDetail',
    kind: 'kind',
    exportIncomeDetail: noop,
    exportRefundDetail: noop,
    storeName: 'storeName'
  };

  render() {
    const {
      changePayWay,
      changeTradeNo,
      kind,
      exportIncomeDetail,
      exportRefundDetail,
      incomeDetail,
      refundDetail,
      storeName
    } = this.props.relaxProps;
    return (
      <div>
        <div style={styles.head}>
          <Form className="filter-content" layout="inline">
            <FormItem>
              <SelectGroup
                onChange={(value) => changePayWay(value)}
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                label={this.props.name}
                style={{ width: 80 }}
              >
                <Option value={null}>全部</Option>
                <Option value="ALIPAY">支付宝</Option>
                <Option value="CASH">转账汇款</Option>
                <Option value="UNIONPAY">银联</Option>
                <Option value="WECHAT">微信</Option>
                <Option value="UNIONPAY_B2B">企业银联</Option>
                <Option value="POINT">积分兑换</Option>
                <Option value="BALANCE">余额</Option>
              </SelectGroup>
            </FormItem>

            <FormItem>
              <Input
                addonBefore="交易流水号"
                onChange={(e) => changeTradeNo(e.target.value)}
              />
            </FormItem>

            <AuthWrapper functionName="f_finance_export_b">
              <FormItem>
                {kind == 'income' ? (
                  <Button
                    type="primary"
                    disabled={incomeDetail.toJS().length <= 0}
                    onClick={() => exportIncomeDetail()}
                  >
                    导出
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    disabled={refundDetail.toJS().length <= 0}
                    onClick={() => exportRefundDetail()}
                  >
                    导出
                  </Button>
                )}
              </FormItem>
            </AuthWrapper>
          </Form>
          <div>
            <Icon type="shop" style={styles.shopIcon} />
            {storeName}
            {/*{*/}
            {/*kind == 'income' ? incomeDetail.toJS().length > 0 ? incomeDetail.toJS()[0].storeName : '' :*/}
            {/*refundDetail.toJS().length > 0 ? refundDetail.toJS()[0].storeName : ''*/}
            {/*}*/}
          </div>
        </div>
      </div>
    );
  }
}

const styles = {
  head: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  } as any,
  shopIcon: {
    color: '#3d85cc',
    fontSize: 16,
    marginRight: 5
  }
};
