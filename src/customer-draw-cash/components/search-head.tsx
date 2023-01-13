import React, { Component } from 'react';
import { IMap, Relax } from 'plume2';
import { Button, Form, Input, Select } from 'antd';
import { Const, noop, DatePickerLaber } from 'qmkit';
import { IList } from 'typings/globalType';

const FormItem = Form.Item;
const Option = Select.Option;

/**
 * 会员提现管理查询header
 */
@Relax
export default class SearchHead extends Component<any, any> {
  props: {
    relaxProps?: {
      onSearch: Function;
      tab: IMap;
      dataList: IList;
      onFormChange: Function;
      onFormChangeInput: Function;
      onBatchAudit: Function;
    };
  };

  static relaxProps = {
    onSearch: noop,
    tab: 'tab',
    dataList: 'dataList',
    onFormChange: noop,
    onFormChangeInput: noop,
    onBatchAudit: noop
  };

  constructor(props) {
    super(props);

    this.state = {
      drawCashNo: '',
      customerOptions: 'customerAccount',
      customerOptionsValue: '',
      drawCashOptions: 'drawCashAccount',
      drawCashOptionsValue: '',
      applyBeginTime: '',
      applyEndTime: '',
      finishBeginTime: '',
      finishEndTime: '',
      customerName: '',
      customerAccount: '',
      drawCashAccount: '',
      drawCashAccountName: ''
    };
  }

  render() {
    const { onSearch, onFormChange, onFormChangeInput } = this.props.relaxProps;
    return (
      <div>
        <div>
          <Form className="filter-content" layout="inline">
            {/*提现账号输入框*/}
            <FormItem>
              <Input
                addonBefore="提现单号"
                placeholder="提现单号"
                onChange={(e) => {
                  const value = (e.target as any).value;
                  this.setState({
                    drawCashNo: value
                  });
                  onFormChange({
                    field: 'drawCashNo',
                    value
                  });
                }}
              />
            </FormItem>

            {/*会员账号名称选择输入框*/}
            <FormItem>
              <Input
                addonBefore={this._renderCustomerOptionSelect()}
                onChange={(e) => {
                  const value = (e.target as any).value;
                  this.setState({
                    customerOptionsValue: value
                  });
                  onFormChangeInput({
                    field: 'customerOptionsValue',
                    value
                  });
                }}
              />
            </FormItem>

            {/*/!*提现账号名称选择输入框*!/*/}
            {/*<FormItem>*/}
            {/*<Input*/}
            {/*style={{ width: 300 }}*/}
            {/*addonBefore={this._renderDrawCashOptionSelect()}*/}
            {/*onChange={(e) => {*/}
            {/*const value = (e.target as any).value;*/}
            {/*this.setState({*/}
            {/*drawCashOptionsValue: value*/}
            {/*});*/}
            {/*onFormChangeInput({*/}
            {/*field: 'drawCashOptionsValue',*/}
            {/*value*/}
            {/*});*/}
            {/*}}*/}
            {/*/>*/}
            {/*</FormItem>*/}

            {/*提现账号输入框*/}
            <FormItem>
              <Input
                addonBefore="提现账户名称"
                placeholder="提现账户名称"
                onChange={(e) => {
                  const value = (e.target as any).value;
                  this.setState({
                    drawCashAccountName: value
                  });
                  onFormChange({
                    field: 'drawCashAccountName',
                    value
                  });
                }}
              />
            </FormItem>

            {/*申请开始时间结束时间选择框*/}
            <FormItem>
              <DatePickerLaber
                label="申请时间"
                placeholder={['开始时间', '结束时间']}
                getCalendarContainer={() =>
                  document.getElementById('page-content')
                }
                onChange={(e) => {
                  let applyBeginTime = null;
                  let applyEndTime = null;
                  if (e.length > 0) {
                    applyBeginTime = e[0].format(Const.DAY_FORMAT) + ' 00:00:00';
                    applyEndTime = e[1].format(Const.DAY_FORMAT) + ' 23:59:59';
                  }
                  // if (applyBeginTime != null) {
                  //   applyBeginTime = applyBeginTime ;
                  // }
                  // if (applyEndTime != null) {
                  //   applyEndTime = applyEndTime;
                  // }
                  onFormChange({
                    field: 'applyTimeBegin',
                    value: applyBeginTime
                  });
                  onFormChange({
                    field: 'applyTimeEnd',
                    value: applyEndTime
                  });
                }}
              />
            </FormItem>

            {/*完成开始时间结束时间选择框*/}
            <FormItem>
              <DatePickerLaber
                label="完成时间"
                placeholder={['开始时间', '结束时间']}
                getCalendarContainer={() =>
                  document.getElementById('page-content')
                }
                onChange={(e) => {
                  let finishBeginTime = null;
                  let finishEndTime = null;
                  if (e.length > 0) {
                    finishBeginTime = e[0].format(Const.DAY_FORMAT) + ' 00:00:00';
                    finishEndTime = e[1].format(Const.DAY_FORMAT) + ' 23:59:59';
                  }
                  // if (finishBeginTime != null) {
                  //   finishBeginTime = finishBeginTime;
                  // }
                  // if (finishEndTime != null) {
                  //   finishEndTime = finishEndTime;
                  // }
                  onFormChange({
                    field: 'finishTimeBegin',
                    value: finishBeginTime
                  });
                  onFormChange({
                    field: 'finishTimeEnd',
                    value: finishEndTime
                  });
                }}
              />
            </FormItem>

            {/*搜索按钮*/}
            <FormItem>
              <Button
                type="primary"
                icon="search"
                htmlType="submit"
                onClick={() => {
                  const {
                    drawCashNo,
                    customerOptions,
                    customerOptionsValue,
                    drawCashOptions,
                    drawCashOptionsValue,
                    customerName,
                    customerAccount,
                    drawCashAccount,
                    drawCashAccountName,
                    applyBeginTime,
                    applyEndTime,
                    finishBeginTime,
                    finishEndTime
                  } = this.state;

                  const params = {
                    drawCashNo,
                    customerOptions,
                    drawCashOptions,
                    customerOptionsValue,
                    drawCashOptionsValue,
                    [customerOptions]: customerOptionsValue,
                    [drawCashOptions]: drawCashOptionsValue,
                    customerName,
                    customerAccount,
                    drawCashAccount,
                    drawCashAccountName,
                    applyBeginTime,
                    applyEndTime,
                    finishBeginTime,
                    finishEndTime
                  };

                  onSearch(params);
                }}
              >
                搜索
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }

  _renderDrawCashOptionSelect = () => {
    const { onFormChange } = this.props.relaxProps;
    return (
      <Select
        getPopupContainer={() => document.getElementById('page-content')}
        onChange={(value) => {
          this.setState({
            drawCashOptions: value
          });
          onFormChange({
            field: 'drawCashOptions',
            value
          });
        }}
        value={this.state.drawCashOptions}
        style={{ width: 130 }}
      >
        <Option value="drawCashAccount">提现账户账号</Option>
        <Option value="drawCashAccountName">提现账户名称</Option>
      </Select>
    );
  };

  _renderCustomerOptionSelect = () => {
    const { onFormChange } = this.props.relaxProps;
    return (
      <Select
        getPopupContainer={() => document.getElementById('page-content')}
        onChange={(value) => {
          this.setState({
            customerOptions: value
          });
          onFormChange({
            field: 'customerOptions',
            value
          });
        }}
        value={this.state.customerOptions}
      >
        <Option value="customerAccount">会员账号</Option>
        <Option value="customerName">会员名称</Option>
      </Select>
    );
  };
}
