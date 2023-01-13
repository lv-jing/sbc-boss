import React from 'react';
import { Relax, IMap } from 'plume2';
import { Form, Select, Input, Button } from 'antd';
import {
  SelectGroup,
  noop,
  Const,
  InputGroupCompact,
  DatePickerLaber
} from 'qmkit';
import { List } from 'immutable';

type TList = List<IMap>;
const FormItem = Form.Item;
const Option = Select.Option;

const OPTION_TYPE = {
  0: 'customerAccount',
  1: 'customerName'
};
const OPTION_PLACE_HOLDER = {
  0: '分销员账号',
  1: '分销员名称'
};

@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      form?: any;
      changeOption: Function;
      onFormChange: Function;
      onSearch: Function;
      distributorLevelIds: TList;
    };
  };

  static relaxProps = {
    // 搜索项
    form: 'form',
    changeOption: noop,
    onFormChange: noop,
    onSearch: noop,
    distributorLevelIds: 'distributorLevelIds'
  };

  state = {
    startValue: null,
    endValue: null
  };
  render() {
    const {
      form,
      onFormChange,
      onSearch,
      distributorLevelIds
    } = this.props.relaxProps;
    // const { startValue, endValue } = this.state;
    const {
      customerName,
      customerAccount,
      inviteCountStart,
      inviteCountEnd,
      inviteAvailableCountStart,
      inviteAvailableCountEnd,
      rewardCashStart,
      rewardCashEnd,
      distributionTradeCountStart,
      distributionTradeCountEnd,
      salesStart,
      salesEnd,
      commissionStart,
      commissionEnd
    } = form.toJS();

    const searchText = customerName || customerAccount;
    return (
      <Form className="filter-content" layout="inline">
        <FormItem>
          <Input
            placeholder={OPTION_PLACE_HOLDER[form.get('optType')]}
            addonBefore={this._renderCustomerOptionSelect()}
            value={searchText}
            onChange={(e: any) => this._setField(e.target.value)}
          />
        </FormItem>
        <FormItem>
          <SelectGroup
            getPopupContainer={() => document.getElementById('page-content')}
            label="分销员等级"
            style={{ width: 80 }}
            onChange={(value) => {
              onFormChange({
                field: 'distributorLevelId',
                value
              });
            }}
          >
            <Option value="">全部</Option>
            {distributorLevelIds &&
              distributorLevelIds.map((v) => (
                <Option
                  key={v.get('distributorLevelId').toString()}
                  value={v.get('distributorLevelId').toString()}
                >
                  {v.get('distributorLevelName')}
                </Option>
              ))}
          </SelectGroup>
        </FormItem>
        <FormItem>
          <DatePickerLaber
            label="加入时间"
            getCalendarContainer={() => document.getElementById('page-content')}
            onChange={(e) => {
              let createTimeBegin;
              let createTimeEnd;
              if (e.length > 0) {
                createTimeBegin = e[0];
                createTimeEnd = e[1];
              }
              this._onStartChange(createTimeBegin);
              this._onEndChange(createTimeEnd);
            }}
          />
        </FormItem>
        <FormItem>
          <SelectGroup
            getPopupContainer={() => document.getElementById('page-content')}
            label="账号状态"
            style={{ width: 80 }}
            onChange={(value) => {
              value = value === '' ? null : value;
              onFormChange({
                field: 'forbiddenFlag',
                value
              });
            }}
          >
            <Option value="">全部</Option>
            <Option value="0">启用</Option>
            <Option value="1">禁用</Option>
          </SelectGroup>
        </FormItem>

        <FormItem>
          <InputGroupCompact
            title="邀新人数"
            startMin={0}
            start={inviteCountStart}
            onStartChange={(val) =>
              onFormChange({
                field: 'inviteCountStart',
                value: val
              })
            }
            endMin={0}
            end={inviteCountEnd}
            onEndChange={(val) =>
              onFormChange({
                field: 'inviteCountEnd',
                value: val
              })
            }
          />
        </FormItem>

        <FormItem>
          <InputGroupCompact
            title="有效邀新"
            startMin={0}
            start={inviteAvailableCountStart}
            onStartChange={(val) =>
              onFormChange({
                field: 'inviteAvailableCountStart',
                value: val
              })
            }
            endMin={0}
            end={inviteAvailableCountEnd}
            onEndChange={(val) =>
              onFormChange({
                field: 'inviteAvailableCountEnd',
                value: val
              })
            }
          />
        </FormItem>

        <FormItem>
          <InputGroupCompact
            precision={2}
            title="已入账邀新奖金"
            startMin={0}
            start={rewardCashStart}
            onStartChange={(val) =>
              onFormChange({
                field: 'rewardCashStart',
                value: val
              })
            }
            endMin={0}
            end={rewardCashEnd}
            onEndChange={(val) =>
              onFormChange({
                field: 'rewardCashEnd',
                value: val
              })
            }
          />
        </FormItem>

        <FormItem>
          <InputGroupCompact
            title="分销订单"
            startMin={0}
            start={distributionTradeCountStart}
            onStartChange={(val) =>
              onFormChange({
                field: 'distributionTradeCountStart',
                value: val
              })
            }
            endMin={0}
            end={distributionTradeCountEnd}
            onEndChange={(val) =>
              onFormChange({
                field: 'distributionTradeCountEnd',
                value: val
              })
            }
          />
        </FormItem>

        <FormItem>
          <InputGroupCompact
            precision={2}
            title="销售额"
            startMin={0}
            start={salesStart}
            onStartChange={(val) =>
              onFormChange({
                field: 'salesStart',
                value: val
              })
            }
            endMin={0}
            end={salesEnd}
            onEndChange={(val) =>
              onFormChange({
                field: 'salesEnd',
                value: val
              })
            }
          />
        </FormItem>

        <FormItem>
          <InputGroupCompact
            precision={2}
            title="已入账分销佣金"
            startMin={0}
            start={commissionStart}
            onStartChange={(val) =>
              onFormChange({
                field: 'commissionStart',
                value: val
              })
            }
            endMin={0}
            end={commissionEnd}
            onEndChange={(val) =>
              onFormChange({
                field: 'commissionEnd',
                value: val
              })
            }
          />
        </FormItem>

        <FormItem>
          <Button type="primary" onClick={() => onSearch()}   htmlType="submit">
            搜索
          </Button>
        </FormItem>
      </Form>
    );
  }
  _renderCustomerOptionSelect = () => {
    const { form } = this.props.relaxProps;
    return (
      <Select
        value={form.get('optType')}
        getPopupContainer={() => document.getElementById('page-content')}
        onChange={(val) => this._changeOptions(val)}
      >
        <Option value="0">分销员账号</Option>
        <Option value="1">分销员名称</Option>
      </Select>
    );
  };
  /**
   * 更改Option
   */
  _changeOptions = (val) => {
    this.props.relaxProps.changeOption(val);
  };
  /**
   * 搜索项设置搜索信息
   */
  _setField = (val) => {
    const { onFormChange, form } = this.props.relaxProps;
    // 搜索项设置placeholder
    onFormChange({ field: OPTION_TYPE[form.get('optType')], value: val });
  };

  _disabledStartDate = (startValue) => {
    const endValue = this.state.endValue;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };

  _disabledEndDate = (endValue) => {
    const startValue = this.state.startValue;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  _onStartChange = (value) => {
    let time = value;
    if (time != null) {
      time = time.format(Const.DAY_FORMAT) + ' 00:00:00';
    }
    const { onFormChange } = this.props.relaxProps;
    onFormChange({
      field: 'createTimeBegin',
      value: time
    });
    this._onChange('startValue', value);
  };

  _onEndChange = (value) => {
    let time = value;
    if (time != null) {
      time = time.format(Const.DAY_FORMAT) + ' 23:59:59';
    }
    const { onFormChange } = this.props.relaxProps;
    onFormChange({
      field: 'createTimeEnd',
      value: time
    });
    this._onChange('endValue', value);
  };

  _onChange = (field, value) => {
    this.setState({
      [field]: value
    });
  };
}
