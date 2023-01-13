import React from 'react';
import { Relax } from 'plume2';
import { Form, Input, Select, DatePicker, Button } from 'antd';
import { SelectGroup, noop } from 'qmkit';
import { IList } from 'typings/globalType';

const { RangePicker } = DatePicker;
const { Option } = Select;
const FormItem = Form.Item;
const dateFormat = 'YYYY-MM-DD';

@Relax
export default class FormBar extends React.Component<any, any> {
  props: {
    relaxProps?: {
      accountList: IList;
      changeSearchInfo: Function;
      filter: Function;
      searchInfo: any;
      total: number;
    };
  };

  static relaxProps = {
    accountList: 'accountList',
    changeSearchInfo: noop,
    filter: noop,
    searchInfo: 'searchInfo',
    total: 'total'
  };

  render() {
    const { changeSearchInfo, filter } = this.props.relaxProps;
    return (
      <div>
        <Form className="filter-content" layout="inline">
          <FormItem>
            <Input
              addonBefore="店铺名称"
              onChange={(e: any) =>
                changeSearchInfo({
                  field: 'storeName',
                  value: e.target.value
                })
              }
            />
          </FormItem>
          <FormItem>
            <SelectGroup
              getPopupContainer={() => document.getElementById('page-content')}
              label="是否通过打款确认"
              defaultValue="全部"
              onChange={(value) =>
                changeSearchInfo({
                  field: 'remitAffirm',
                  value: value
                })
              }
            >
              <Option key="-1" value="-1">
                全部
              </Option>
              <Option key="0" value="0">
                否
              </Option>
              <Option key="1" value="1">
                是
              </Option>
            </SelectGroup>
          </FormItem>
          <FormItem label="入驻时间">
            <RangePicker
              format={dateFormat}
              onChange={(params) =>
                changeSearchInfo({
                  field: 'applyEnterTime',
                  value: params
                })
              }
            />
          </FormItem>
          <FormItem>
            <Button
              icon="search"
              type="primary"
              onClick={() => filter(0)}
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
