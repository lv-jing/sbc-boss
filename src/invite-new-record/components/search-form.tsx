import React from 'react';
import { Relax, IMap } from 'plume2';
import { Form, Select, Input, Button, AutoComplete, message } from 'antd';
import moment from 'moment';
import {
  noop,
  Const,
  SelectGroup,
  DatePickerLaber,
  AuthWrapper,
  ExportModal,
  checkAuth
} from 'qmkit';
import { List, fromJS } from 'immutable';
type TList = List<IMap>;
const FormItem = Form.Item;
const Option = AutoComplete.Option;

@Relax
export default class SearchForm extends React.Component<any, any> {
  props: {
    form?: any;
    relaxProps?: {
      onSearch: Function;
      inviteSearchSelect: IMap;
      searchParams: IMap;
      distributionSearchSelect: IMap;
      inviteSearchText: string;
      distributionSearchText: string;
      setSearchKind: Function;
      saveCustomerFilter: Function;
      saveDistributionCustomerFilter: Function;
      filterCustomerData: TList;
      filterDistributionCustomerData: TList;
      saveSearchParams: Function;
      searchCustomers: Function;
      searchDistributionCustomers: Function;

      onExportByParams: Function;
      onExportByIds: Function;
      onExportModalChange: Function;
      onExportModalHide: Function;
      exportModalData: IMap;
    };
  };

  static relaxProps = {
    onSearch: noop,
    inviteSearchSelect: 'inviteSearchSelect',
    distributionSearchSelect: 'distributionSearchSelect',
    searchParams: 'searchParams',
    //搜索文字
    inviteSearchText: 'inviteSearchText',
    distributionSearchText: 'distributionSearchText',
    setSearchKind: noop,
    saveCustomerFilter: noop,
    saveDistributionCustomerFilter: noop,
    filterCustomerData: 'filterCustomerData',
    filterDistributionCustomerData: 'filterDistributionCustomerData',
    saveSearchParams: noop,
    searchCustomers: noop,
    searchDistributionCustomers: noop,

    onExportByParams: noop,
    onExportByIds: noop,
    onExportModalChange: noop,
    onExportModalHide: noop,
    exportModalData: 'exportModalData'
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {
      onSearch,
      distributionSearchSelect,
      inviteSearchSelect,
      inviteSearchText,
      distributionSearchText,
      filterCustomerData,
      saveCustomerFilter,
      saveDistributionCustomerFilter,
      saveSearchParams,
      searchParams,
      searchCustomers,
      searchDistributionCustomers,
      filterDistributionCustomerData,

      exportModalData,
      onExportModalHide
    } = this.props.relaxProps;
    const children = filterCustomerData.map((item) => (
      <Option key={item.get('key')} value={item.get('value')}>
        {item.get('value')}
      </Option>
    ));

    const distributionChildren = filterDistributionCustomerData.map((item) => (
      <Option key={item.get('key')} value={item.get('value')}>
        {item.get('value')}
      </Option>
    ));

    return (
      <Form className="filter-content" layout="inline">
        <FormItem>
          <Input.Group compact>
            <Select
              defaultValue={inviteSearchSelect.get(
                inviteSearchSelect.get('checked')
              )}
              onChange={(value) => this._setSearchKind('invite', value)}
            >
              <Select.Option key={0} value={0}>
                {inviteSearchSelect.get('0')}
              </Select.Option>
              <Select.Option key={1} value={1}>
                {inviteSearchSelect.get('1')}
              </Select.Option>
            </Select>

            <AutoComplete
              dataSource={[]}
              allowClear={true}
              value={inviteSearchText}
              onChange={(value) => searchCustomers(value)}
              onSelect={(value) => saveCustomerFilter(value)}
            >
              {children as any}
            </AutoComplete>
          </Input.Group>
        </FormItem>

        <FormItem>
          <Input.Group compact>
            <Select
              defaultValue={distributionSearchSelect.get(
                inviteSearchSelect.get('checked')
              )}
              onChange={(value) => this._setSearchKind('distribution', value)}
            >
              <Select.Option key={0} value={0}>
                {distributionSearchSelect.get('0')}
              </Select.Option>
              <Select.Option key={1} value={1}>
                {distributionSearchSelect.get('1')}
              </Select.Option>
            </Select>
            <AutoComplete
              value={distributionSearchText}
              optionLabelProp={'123'}
              allowClear={true}
              dataSource={[]}
              onChange={(value) => searchDistributionCustomers(value)}
              onSelect={(value) => saveDistributionCustomerFilter(value)}
            >
              {distributionChildren as any}
            </AutoComplete>
          </Input.Group>
        </FormItem>

        <FormItem>
          <SelectGroup
            getPopupContainer={() => document.getElementById('page-content')}
            defaultValue=""
            label="是否分销员"
            onChange={(value) => {
              saveSearchParams({
                field: 'isDistributor',
                value: value
              });
            }}
          >
            <Option value="">全部</Option>
            <Option value="1">是</Option>
            <Option value="0">否</Option>
          </SelectGroup>
        </FormItem>

        <FormItem>
          <DatePickerLaber
            label="下单时间"
            getCalendarContainer={() => document.getElementById('page-content')}
            value={
              searchParams.get('firstOrderStartTime')
                ? [
                    moment(
                      searchParams.get('firstOrderStartTime'),
                      Const.DAY_FORMAT
                    ),
                    moment(
                      searchParams.get('firstOrderEndTime'),
                      Const.DAY_FORMAT
                    )
                  ]
                : null
            }
            onChange={(e) => {
              let beginTime = '';
              let endTime = '';
              if (e.length > 0) {
                beginTime = e[0].format(Const.DAY_FORMAT);
                endTime = e[1].format(Const.DAY_FORMAT);
              }
              saveSearchParams({
                field: 'firstOrderStartTime',
                value: beginTime
              });
              saveSearchParams({ field: 'firstOrderEndTime', value: endTime });
            }}
          />
        </FormItem>

        <FormItem>
          <DatePickerLaber
            getCalendarContainer={() => document.getElementById('page-content')}
            label="订单完成时间"
            value={
              searchParams.get('orderFinishStartTime')
                ? [
                    moment(
                      searchParams.get('orderFinishStartTime'),
                      Const.DAY_FORMAT
                    ),
                    moment(
                      searchParams.get('orderFinishEndTime'),
                      Const.DAY_FORMAT
                    )
                  ]
                : null
            }
            onChange={(e) => {
              let beginTime = '';
              let endTime = '';
              if (e.length > 0) {
                beginTime = e[0].format(Const.DAY_FORMAT);
                endTime = e[1].format(Const.DAY_FORMAT);
              }
              saveSearchParams({
                field: 'orderFinishStartTime',
                value: beginTime
              });
              saveSearchParams({ field: 'orderFinishEndTime', value: endTime });
            }}
          />
        </FormItem>

        <FormItem>
          <Input
            value={searchParams.get('orderCode')}
            addonBefore="订单编号"
            onChange={(e) =>
              saveSearchParams({ field: 'orderCode', value: e.target.value })
            }
          />
        </FormItem>

        <FormItem>
          <DatePickerLaber
            label="奖励入账时间"
            getCalendarContainer={() => document.getElementById('page-content')}
            value={
              searchParams.get('rewardRecordedStartTime')
                ? [
                    moment(
                      searchParams.get('rewardRecordedStartTime'),
                      Const.DAY_FORMAT
                    ),
                    moment(
                      searchParams.get('rewardRecordedEndTime'),
                      Const.DAY_FORMAT
                    )
                  ]
                : null
            }
            onChange={(e) => {
              let beginTime = '';
              let endTime = '';
              if (e.length > 0) {
                beginTime = e[0].format(Const.DAY_FORMAT);
                endTime = e[1].format(Const.DAY_FORMAT);
              }
              saveSearchParams({
                field: 'rewardRecordedStartTime',
                value: beginTime
              });
              saveSearchParams({
                field: 'rewardRecordedEndTime',
                value: endTime
              });
            }}
          />
        </FormItem>

        <FormItem>
          <Button type="primary" onClick={() => onSearch()} htmlType="submit">
            搜索
          </Button>
        </FormItem>

        <div className="handle-bar">
          <FormItem>
            {/*导出邀新记录权限*/}
            <AuthWrapper functionName={'f_invite_new_record_export'}>
              <Button type="primary" onClick={() => this._handleBatchExport()}>
                批量导出
              </Button>
            </AuthWrapper>
          </FormItem>
          <ExportModal
            data={exportModalData}
            onHide={onExportModalHide}
            handleByParams={exportModalData.get('exportByParams')}
            handleByIds={exportModalData.get('exportByIds')}
            alertInfo={fromJS({
              message: '操作说明:',
              description:
                '为保证效率,每次最多支持' +
                '导出1000条记录，如需导出更多，请更换筛选条件后再次导出'
            })}
            alertVisible={true}
          />
        </div>
      </Form>
    );
  }

  //搜索种类，名称or账号,受邀人or分销员
  _setSearchKind = (kind, value) => {
    const { setSearchKind } = this.props.relaxProps;
    setSearchKind({ kind, value });
  };

  async _handleBatchExport() {
    // 校验是否有导出权限
    const haveAuth = checkAuth('f_invite_new_record_export');
    if (haveAuth) {
      const { onExportByParams, onExportByIds } = this.props.relaxProps;
      this.props.relaxProps.onExportModalChange({
        visible: true,
        byParamsTitle: '导出筛选出的邀新记录',
        byIdsTitle: '导出选中的邀新记录',
        exportByParams: onExportByParams,
        exportByIds: onExportByIds
      });
    } else {
      message.error('此功能您没有权限访问');
    }
  }
}
