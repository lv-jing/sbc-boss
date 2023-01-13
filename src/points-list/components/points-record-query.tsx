import React, { Component } from 'react';
import { Relax } from 'plume2';
import { Button, DatePicker, Form, Input } from 'antd';
import {Const,noop} from 'qmkit';
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
@Relax
export default class SearchHead extends Component<any, any> {
  props: {
    relaxProps?: {
      onFormFieldChange: Function;
      onSearch: Function;
    };
  };

  static relaxProps = {
    onFormFieldChange: noop,
    onSearch: noop
  };

  render() {
    const { onFormFieldChange, onSearch } = this.props.relaxProps;
    return (
      <div>
        <Form className="filter-content" layout="inline">
          <FormItem>
            <Input
              addonBefore="客户名称"
              onChange={(e: any) => {
                onFormFieldChange('customerName',
                  e.target.value);
              }}
            />
          </FormItem>
          <FormItem>
            <Input
              addonBefore="客户账号"
              onChange={(e: any) => {
                onFormFieldChange('customerAccount',
                 e.target.value);
              }}
            />
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
                  'opTimeBegin',
                  beginTime ? beginTime : null
                );
                onFormFieldChange('opTimeEnd', endTime ? endTime : null);
              
              }}
            />
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              icon="search"
              onClick={() => {
                onSearch();
              }}
              htmlType="submit"
            >
              搜索
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}
