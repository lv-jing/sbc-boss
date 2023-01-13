import React from 'react';

import { Relax } from 'plume2';
import { DatePicker, Form, Input, Select, Button } from 'antd';
import { Const, noop, SelectGroup } from 'qmkit';
import { IList, IMap } from 'typings/globalType';

const FormItem = Form.Item;
@Relax
export default class SearchHead extends React.Component<any, any> {
  props: {
    relaxProps?: {
      form: IMap;
      levelList: IList;
      onFormFieldChange: Function;
      search: Function;
      checkIEPEnable: boolean;
    };
  };

  static relaxProps = {
    form: 'form',
    levelList: 'levelList',
    onFormFieldChange: noop,
    search: noop,
    checkIEPEnable: 'checkIEPEnable'
  };

  state = {
    startValue: null,
    endValue: null,
    endOpen: false
  };

  render() {
    const {
      form,
      onFormFieldChange,
      search,
      levelList,
      checkIEPEnable
    } = this.props.relaxProps;
    const { startValue, endValue } = this.state;
    return (
      <Form className="filter-content" layout="inline">
        <FormItem>
          <Input
            addonBefore="优惠券活动名称"
            value={form.get('activityName')}
            onChange={(e: any) => {
              onFormFieldChange('activityName', e.target.value);
            }}
          />
        </FormItem>

        <FormItem>
          <SelectGroup
            getPopupContainer={() => document.getElementById('page-content')}
            label="活动类型"
            defaultValue="不限"
            onChange={(value) => {
              onFormFieldChange('couponActivityType', value);
            }}
          >
            <Select.Option key="-1" value="-1">
              不限
            </Select.Option>
            <Select.Option key="0" value="0">
              全场赠券
            </Select.Option>
            <Select.Option key="1" value="1">
              精准发券
            </Select.Option>
            <Select.Option key="3" value="3">
              注册赠券
            </Select.Option>
            <Select.Option key="4" value="4">
              权益赠券
            </Select.Option>
            <Select.Option key="5" value="5">
              邀新赠券
            </Select.Option>
            <Select.Option key="6" value="6">
              积分兑换券
            </Select.Option>
            {checkIEPEnable ? (
              <Select.Option key="7" value="7">
                企业注册赠券
              </Select.Option>
            ) : null}
          </SelectGroup>
        </FormItem>

        <FormItem>
          <SelectGroup
            getPopupContainer={() => document.getElementById('page-content')}
            label="目标客户"
            defaultValue="不限"
            onChange={(value) => {
              onFormFieldChange('joinLevel', value);
            }}
          >
            <Select.Option key="-3" value="-3">
              不限
            </Select.Option>
            <Select.Option key="-1" value="-1">
              全平台客户
            </Select.Option>
            {levelList &&
              levelList.map((item) => {
                return (
                  <Select.Option key={item.get('key')} value={item.get('key')}>
                    {item.get('value')}
                  </Select.Option>
                );
              })}
            <Select.Option key="-2" value="-2">
              指定客户
            </Select.Option>
            {checkIEPEnable ? (
              <Select.Option key="-4" value="-4">
                企业会员
              </Select.Option>
            ) : null}
          </SelectGroup>
        </FormItem>

        <FormItem>
          <DatePicker
            allowClear={true}
            disabledDate={this.disabledStartDate}
            showTime={{ format: 'HH:mm' }}
            format={Const.DATE_FORMAT}
            value={startValue}
            placeholder="开始时间"
            onChange={this.onStartChange}
            showToday={false}
          />
        </FormItem>
        <FormItem>
          <DatePicker
            allowClear={true}
            disabledDate={this.disabledEndDate}
            showTime={{ format: 'HH:mm' }}
            format={Const.DATE_FORMAT}
            value={endValue}
            placeholder="结束时间"
            onChange={this.onEndChange}
            showToday={false}
          />
        </FormItem>

        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
            icon="search"
            onClick={() => {
              search();
            }}
          >
            搜索
          </Button>
        </FormItem>
      </Form>
    );
  }

  disabledStartDate = (startValue) => {
    const endValue = this.state.endValue;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };

  disabledEndDate = (endValue) => {
    const startValue = this.state.startValue;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  onChange = (field, value) => {
    this.setState({
      [field]: value
    });
  };

  onStartChange = (value) => {
    let time = value;
    if (time != null) {
      time = time.format(Const.DATE_FORMAT) + ':00';
    }
    const { onFormFieldChange } = this.props.relaxProps;
    onFormFieldChange('startTime', time);
    this.onChange('startValue', value);
  };

  onEndChange = (value) => {
    let time = value;
    if (time != null) {
      time = time.format(Const.DATE_FORMAT) + ':00';
    }
    const { onFormFieldChange } = this.props.relaxProps;
    onFormFieldChange('endTime', time);
    this.onChange('endValue', value);
  };
}
