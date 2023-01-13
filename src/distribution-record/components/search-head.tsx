import React, { Component } from 'react';
import { IMap, Relax } from 'plume2';
import { Form, Input, Select, Button, AutoComplete, message } from 'antd';
import {
  Headline,
  noop,
  Const,
  DatePickerLaber,
  AuthWrapper,
  checkAuth,
  ExportModal
} from 'qmkit';
import { IList } from 'typings/globalType';
import { List } from 'immutable';
import { fromJS } from 'immutable';

type TList = List<IMap>;
const FormItem = Form.Item;
const Option = AutoComplete.Option;

/**
 * 分销记录查询头
 */
@Relax
export default class SearchHead extends Component<any, any> {
  props: {
    relaxProps?: {
      onSearch: Function;

      distributionSearchSelect: IMap;
      customerSearchSelect: IMap;
      goodsInfoSearchSelect: IMap;
      storeInfoSearchSelect: IMap;

      searchDistributionCustomers: Function;
      searchCustomerInfos: Function;
      searchGoodsInfos: Function;
      searchStoreInfos: Function;

      saveDistributionCustomerFilter: Function;
      saveCustomerInfosFilter: Function;
      saveGoodsInfoFilter: Function;
      saveStoreInfoFilter: Function;

      filterCustomerData: TList;
      filterDistributionCustomerData: TList;
      filterStoreData: TList;
      filterGoodsInfoData: TList;

      setSearchKind: Function;
      saveSearchParams: Function;

      tab: IMap;
      dataList: IList;

      onExportByParams: Function;
      onExportByIds: Function;
      onExportModalChange: Function;
      onExportModalHide: Function;
      exportModalData: IMap;
      customerAccount: any;
    };
  };

  static relaxProps = {
    onSearch: noop,
    tab: 'tab',
    dataList: 'dataList',

    setSearchKind: noop,
    saveSearchParams: noop,

    searchDistributionCustomers: noop,
    searchCustomerInfos: noop,
    searchGoodsInfos: noop,
    searchStoreInfos: noop,

    saveDistributionCustomerFilter: noop,
    saveCustomerInfosFilter: noop,
    saveGoodsInfoFilter: noop,
    saveStoreInfoFilter: noop,

    distributionSearchSelect: 'distributionSearchSelect',
    customerSearchSelect: 'customerSearchSelect',
    goodsInfoSearchSelect: 'goodsInfoSearchSelect',
    storeInfoSearchSelect: 'storeInfoSearchSelect',

    filterDistributionCustomerData: 'filterDistributionCustomerData',
    filterCustomerData: 'filterCustomerData',
    filterStoreData: 'filterStoreData',
    filterGoodsInfoData: 'filterGoodsInfoData',

    onExportByParams: noop,
    onExportByIds: noop,
    onExportModalChange: noop,
    onExportModalHide: noop,
    exportModalData: 'exportModalData',
    customerAccount: 'customerAccount'
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {
      onSearch,
      filterDistributionCustomerData,
      filterCustomerData,
      filterStoreData,
      filterGoodsInfoData,

      distributionSearchSelect,
      customerSearchSelect,
      goodsInfoSearchSelect,
      storeInfoSearchSelect,

      searchDistributionCustomers,
      searchCustomerInfos,
      searchGoodsInfos,
      searchStoreInfos,

      saveDistributionCustomerFilter,
      saveCustomerInfosFilter,
      saveGoodsInfoFilter,
      saveStoreInfoFilter,

      saveSearchParams,

      exportModalData,
      onExportModalHide,
      customerAccount
    } = this.props.relaxProps;

    const distributionChildren = filterDistributionCustomerData.map((item) => (
      <Option key={item.get('key')} value={item.get('value')}>
        {item.get('value')}
      </Option>
    ));

    const customerChildren = filterCustomerData.map((item) => (
      <Option key={item.get('key')} value={item.get('value')}>
        {item.get('value')}
      </Option>
    ));

    const goodsInfoChildren = filterGoodsInfoData.map((item) => (
      <Option key={item.get('key')} value={item.get('value')}>
        {item.get('value')}
      </Option>
    ));

    const storeChildren = filterStoreData.map((item) => (
      <Option key={item.get('key')} value={item.get('value')}>
        {item.get('value')}
      </Option>
    ));

    return (
      <div>
        <Headline title="分销记录" />
        <div>
          <Form className="filter-content" layout="inline">
            <FormItem>
              <Input
                addonBefore="订单编号"
                onChange={(e) => {
                  saveSearchParams({ field: 'tradeId', value: e.target.value });
                }}
              />
            </FormItem>

            <FormItem>
              <Input.Group compact>
                <Select
                  defaultValue={goodsInfoSearchSelect.get(
                    customerSearchSelect.get('checked')
                  )}
                  onChange={(value) => this._setSearchKind('goodsInfo', value)}
                >
                  <Select.Option key={0} value={0}>
                    {goodsInfoSearchSelect.get('0')}
                  </Select.Option>
                  <Select.Option key={1} value={1}>
                    {goodsInfoSearchSelect.get('1')}
                  </Select.Option>
                </Select>
                <AutoComplete
                  allowClear={true}
                  dataSource={[]}
                  onChange={(value) => searchGoodsInfos(value)}
                  onSelect={(value) => saveGoodsInfoFilter(value)}
                >
                  {goodsInfoChildren as any}
                </AutoComplete>
              </Input.Group>
            </FormItem>

            <FormItem>
              <Input.Group compact>
                <Select
                  defaultValue={customerSearchSelect.get(
                    customerSearchSelect.get('checked')
                  )}
                  onChange={(value) => this._setSearchKind('customer', value)}
                >
                  <Select.Option key={0} value={0}>
                    {customerSearchSelect.get('0')}
                  </Select.Option>
                  <Select.Option key={1} value={1}>
                    {customerSearchSelect.get('1')}
                  </Select.Option>
                </Select>
                <AutoComplete
                  allowClear={true}
                  dataSource={[]}
                  onChange={(value) => searchCustomerInfos(value)}
                  onSelect={(value) => saveCustomerInfosFilter(value)}
                >
                  {customerChildren as any}
                </AutoComplete>
              </Input.Group>
            </FormItem>

            <FormItem>
              <Input.Group compact>
                <Select
                  defaultValue={storeInfoSearchSelect.get(
                    storeInfoSearchSelect.get('checked')
                  )}
                  onChange={(value) => this._setSearchKind('store', value)}
                >
                  <Select.Option key={0} value={0}>
                    {storeInfoSearchSelect.get('0')}
                  </Select.Option>
                  <Select.Option key={1} value={1}>
                    {storeInfoSearchSelect.get('1')}
                  </Select.Option>
                </Select>
                <AutoComplete
                  allowClear={true}
                  dataSource={[]}
                  onChange={(value) => searchStoreInfos(value)}
                  onSelect={(value) => saveStoreInfoFilter(value)}
                >
                  {storeChildren as any}
                </AutoComplete>
              </Input.Group>
            </FormItem>

            <FormItem>
              <Input.Group compact>
                <Select
                  defaultValue={distributionSearchSelect.get(
                    customerSearchSelect.get('checked')
                  )}
                  onChange={(value) =>
                    this._setSearchKind('distributor', value)
                  }
                >
                  <Select.Option key={0} value={0}>
                    {distributionSearchSelect.get('0')}
                  </Select.Option>
                  <Select.Option key={1} value={1}>
                    {distributionSearchSelect.get('1')}
                  </Select.Option>
                </Select>
                <AutoComplete
                  value={customerAccount}
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
              <DatePickerLaber
                label="付款时间"
                getCalendarContainer={() =>
                  document.getElementById('page-content')
                }
                onChange={(e) => {
                  let createTimeBegin;
                  let createTimeEnd;
                  if (e.length > 0) {
                    createTimeBegin =
                      e[0].format(Const.DAY_FORMAT) + ' 00:00:00';
                    createTimeEnd = e[1].format(Const.DAY_FORMAT) + ' 23:59:59';
                  }
                  saveSearchParams({
                    field: 'payTimeBegin',
                    value: createTimeBegin
                  });
                  saveSearchParams({
                    field: 'payTimeEnd',
                    value: createTimeEnd
                  });
                }}
              />
            </FormItem>
            <FormItem>
              <DatePickerLaber
                label="订单完成时间"
                getCalendarContainer={() =>
                  document.getElementById('page-content')
                }
                onChange={(e) => {
                  let finishTimeBegin;
                  let finishTimeEnd;
                  if (e.length > 0) {
                    finishTimeBegin =
                      e[0].format(Const.DAY_FORMAT) + ' 00:00:00';
                    finishTimeEnd = e[1].format(Const.DAY_FORMAT) + ' 23:59:59';
                  }
                  saveSearchParams({
                    field: 'finishTimeBegin',
                    value: finishTimeBegin
                  });
                  saveSearchParams({
                    field: 'finishTimeEnd',
                    value: finishTimeEnd
                  });
                }}
              />
            </FormItem>
            <FormItem>
              <DatePickerLaber
                label="佣金入账时间"
                getCalendarContainer={() =>
                  document.getElementById('page-content')
                }
                onChange={(e) => {
                  let missionReceivedTimeBegin;
                  let missionReceivedTimeEnd;
                  if (e.length > 0) {
                    missionReceivedTimeBegin =
                      e[0].format(Const.DAY_FORMAT) + ' 00:00:00';
                    missionReceivedTimeEnd =
                      e[1].format(Const.DAY_FORMAT) + ' 23:59:59';
                  }
                  saveSearchParams({
                    field: 'missionReceivedTimeBegin',
                    value: missionReceivedTimeBegin
                  });
                  saveSearchParams({
                    field: 'missionReceivedTimeEnd',
                    value: missionReceivedTimeEnd
                  });
                }}
              />
            </FormItem>

            <FormItem>
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
            </FormItem>
          </Form>

          <div className="handle-bar">
            {/*导出分销记录权限*/}
            <AuthWrapper functionName={'f_invition_record_export'}>
              <Button type="primary" onClick={() => this._handleBatchExport()}>
                批量导出
              </Button>
            </AuthWrapper>
          </div>
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
      </div>
    );
  }

  //搜索种类
  _setSearchKind = (kind, value) => {
    const { setSearchKind } = this.props.relaxProps;
    setSearchKind({ kind, value });
  };

  async _handleBatchExport() {
    // 校验是否有导出权限
    const haveAuth = checkAuth('f_invition_record_export');
    if (haveAuth) {
      const { onExportByParams, onExportByIds } = this.props.relaxProps;
      this.props.relaxProps.onExportModalChange({
        visible: true,
        byParamsTitle: '导出筛选出的分销记录',
        byIdsTitle: '导出选中的分销记录',
        exportByParams: onExportByParams,
        exportByIds: onExportByIds
      });
    } else {
      message.error('此功能您没有权限访问');
    }
  }
}
