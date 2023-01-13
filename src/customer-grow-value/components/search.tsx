import React, { Component } from 'react';
import { Relax } from 'plume2';
import { Button, DatePicker, Form, Select } from 'antd';
import { AuthWrapper, Const, SelectGroup, noop, checkAuth } from 'qmkit';
import { IMap } from 'typings/globalType';

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
const serviceTypeName = [
  { type: null, name: '全部' },
  { type: 0, name: '签到' },
  { type: 1, name: '注册' },
  { type: 2, name: '分享商品' },
  { type: 3, name: '分享注册' },
  { type: 4, name: '分享购买' },
  { type: 5, name: '评论商品' },
  { type: 6, name: '晒单' },
  { type: 7, name: '完善基本信息' },
  { type: 8, name: '绑定微信' },
  { type: 9, name: '添加收货地址' },
  { type: 10, name: '关注店铺' },
  { type: 11, name: '订单完成' }
];

@Relax
export default class SearchHead extends Component<any, any> {
  props: {
    relaxProps?: {
      form: IMap;
      onFormFieldChange: Function;
      onSearch: Function;
    };
  };

  static relaxProps = {
    form: 'form',
    onFormFieldChange: noop,
    onSearch: noop
  };

  render() {
    const { onFormFieldChange, onSearch } = this.props.relaxProps;
    return (
      <div>
        <Form className="filter-content" layout="inline">
          <FormItem>
            <SelectGroup
              getPopupContainer={() => document.getElementById('page-content')}
              onChange={(value) => {
                onFormFieldChange('growthValueServiceType', value);
              }}
              label="业务类型"
              defaultValue=""
            >
              {serviceTypeName.map((value) => (
                <Option value={value.type}>{value.name}</Option>
              ))}
            </SelectGroup>
          </FormItem>
          <FormItem>
            <RangePicker
              getCalendarContainer={() =>
                document.getElementById('page-content')
              }
              onChange={(e) => {
                let beginTime = '';
                let endTime = '';

                if (e.length > 0) {
                  beginTime = e[0].format(Const.TIME_FORMAT);
                  endTime = e[1].format(Const.TIME_FORMAT);
                }
                onFormFieldChange(
                  'gteGainStartDate',
                  beginTime ? beginTime : null
                );
                onFormFieldChange('lteGainEndDate', endTime ? endTime : null);
                this.setState({
                  gteGainStartDate: beginTime,
                  lteGainEndDate: endTime
                });
              }}
            />
          </FormItem>
          <FormItem>
            {(checkAuth('f_customer-grow-value_list') ||
              checkAuth('f_enterprise_customer-grow-value_list')) && (
              <Button
                type="primary"
                icon="search"
                htmlType="submit"
                onClick={() => {
                  onSearch();
                }}
              >
                搜索
              </Button>
            )}
          </FormItem>
        </Form>
      </div>
    );
  }
}
