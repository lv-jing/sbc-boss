import React from 'react';
import { Button, Form, Input, DatePicker, Select } from 'antd';
import { Relax } from 'plume2';
import { noop, Const } from 'qmkit';
import SelectGroup from '../../../../web_modules/qmkit/search-form/select-group';
import { IList } from '../../../../typings/globalType';

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onSearch: Function;
      groupInfoList: IList;
      queryGroupInfoList: Function;
    };
  };

  static relaxProps = {
    onSearch: noop,
    groupInfoList: 'groupInfoList',
    queryGroupInfoList: noop
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { onSearch, groupInfoList } = this.props.relaxProps;
    return (
      <div style={{ marginTop: 10 }}>
        <Form className="filter-content" layout="inline">
          <FormItem>
            <Input
              addonBefore={'计划名称'}
              onChange={(e) => {
                this.setState({
                  planName: e.target.value
                });
              }}
            />
          </FormItem>
          <FormItem>
            {/*<Input*/}
            {/*addonBefore={'目标人群'}*/}
            {/*onChange={(e) => {*/}
            {/*this.setState({*/}
            {/*receiveValueName: e.target.value*/}
            {/*});*/}
            {/*}}*/}
            {/*/>*/}
            <SelectGroup
              label="目标人群"
              placeholder="输入人群名称搜索"
              style={{ width: 160 }}
              filterOption={false}
              showSearch
              onSearch={(value) => {
                this._onSearchGroupInfoList(value);
              }}
              onChange={(value) => {
                this.setState({
                  receiveValueName: value
                });
              }}
            >
              <Option value={null}>全部</Option>
              {groupInfoList.map((groupInfo) => {
                return (
                  <Option key={groupInfo.groupId} value={groupInfo.groupName}>
                    {groupInfo.groupName}
                  </Option>
                );
              })}
            </SelectGroup>
          </FormItem>
          <FormItem>
            <SelectGroup
              getPopupContainer={() => document.getElementById('page-content')}
              label="触发条件"
              style={{ width: 80 }}
              onChange={(e) => {
                this.setState({
                  triggerCondition: e
                });
              }}
              defaultValue={null}
            >
              <Option value={null}>全部</Option>
              <Option value={'0'}>无</Option>
              <Option value={'1'}>有访问</Option>
              <Option value={'2'}>有收藏</Option>
              <Option value={'3'}>有加购</Option>
              <Option value={'4'}>有下单</Option>
              <Option value={'5'}>有付款</Option>
            </SelectGroup>
          </FormItem>
          <FormItem>
            <RangePicker
              getCalendarContainer={() =>
                document.getElementById('page-content')
              }
              format={Const.DAY_FORMAT}
              placeholder={['计划开始时间', '计划结束时间']}
              onChange={(date, dateStr) => {
                let startDate = null;
                let endDate = null;
                if (date.length > 0) {
                  startDate = dateStr[0];
                  endDate = dateStr[1];
                }
                this.setState({ startDate, endDate });
              }}
            />
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              icon="search"
              onClick={() => {
                const params = this.state;
                onSearch(params);
              }}
            >
              搜索
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }

  _onSearchGroupInfoList = async (value) => {
    const { queryGroupInfoList } = this.props.relaxProps;
    await queryGroupInfoList({ groupName: value });
  };
}
