import React from 'react';
import { Relax, IMap } from 'plume2';
import {
  Form,
  Select,
  Input,
  Button,
  AutoComplete,
  Row,
  Col,
  message
} from 'antd';
import moment from 'moment';
import {
  noop,
  Const,
  AuthWrapper,
  ExportModal,
  checkAuth,
  DatePickerLaber,
  SelectGroup
} from 'qmkit';
import { List, fromJS } from 'immutable';
type TList = List<IMap>;
const FormItem = Form.Item;
const Option = AutoComplete.Option;
@Relax
export default class GeneralCommission extends React.Component<any, any> {
  props: {
    form?: any;
    relaxProps?: {
      onSearch: Function;
      inviteSearchSelect: IMap;
      searchParams: IMap;
      distributionSearchSelect: IMap;
      distributionSearchText: string;
      setSearchKind: Function;
      saveDistributionCustomerFilter: Function;
      filterDistributionCustomerData: TList;
      saveSearchParams: Function;
      searchDistributionCustomers: Function;
      statistics: IMap;

      onExportByParams: Function;
      onExportByIds: Function;
      onExportModalChange: Function;
      onExportModalHide: Function;
      exportModalData: IMap;

      distributorLevelIds: TList;
    };
  };

  static relaxProps = {
    onSearch: noop,
    inviteSearchSelect: 'inviteSearchSelect',
    distributionSearchSelect: 'distributionSearchSelect',
    searchParams: 'searchParams',
    distributionSearchText: 'distributionSearchText',
    setSearchKind: noop,
    saveDistributionCustomerFilter: noop,
    filterDistributionCustomerData: 'filterDistributionCustomerData',
    saveSearchParams: noop,
    searchDistributionCustomers: noop,
    statistics: 'statistics',

    onExportByParams: noop,
    onExportByIds: noop,
    onExportModalChange: noop,
    onExportModalHide: noop,
    exportModalData: 'exportModalData',
    distributorLevelIds: 'distributorLevelIds'
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {
      onSearch,
      distributionSearchSelect,
      distributionSearchText,
      inviteSearchSelect,
      saveDistributionCustomerFilter,
      saveSearchParams,
      searchParams,
      searchDistributionCustomers,
      filterDistributionCustomerData,
      statistics,

      exportModalData,
      onExportModalHide,
      distributorLevelIds
    } = this.props.relaxProps;
    const distributionChildren = filterDistributionCustomerData.map((item) => (
      <Option key={item.get('key')} value={item.get('value')}>
        {item.get('value')}
      </Option>
    ));

    return (
      <div style={styles.content}>
        <div>
          <div style={styles.static}>
            <Row>
              <Col span={4}>
                <p style={styles.nav}>已入账佣金总额</p>
                <p style={styles.num}>
                  {this._changeToCash(statistics.get('commissionTotal'))}
                </p>
              </Col>
              <Col span={5}>
                <p style={styles.nav}>已入账分销佣金总额</p>
                <p style={styles.num}>
                  {this._changeToCash(statistics.get('commission'))}
                </p>
              </Col>
              <Col span={5}>
                <p style={styles.nav}>已入账邀新奖金总额</p>
                <p style={styles.num}>
                  {this._changeToCash(statistics.get('rewardCash'))}
                </p>
              </Col>
              <Col span={5}>
                <p style={styles.nav}>未入账分销佣金总额</p>
                <p style={styles.num}>
                  {this._changeToCash(statistics.get('commissionNotRecorded'))}
                </p>
              </Col>
              <Col span={5}>
                <p style={styles.nav}>未入账邀新奖金总额</p>
                <p style={styles.num}>
                  {this._changeToCash(statistics.get('rewardCashNotRecorded'))}
                </p>
              </Col>
            </Row>
          </div>

          <Form className="filter-content" layout="inline">
            <FormItem>
              <Input.Group compact>
                <Select
                  style={{ width: 120 }}
                  defaultValue={distributionSearchSelect.get(
                    inviteSearchSelect.get('checked')
                  )}
                  onChange={(value) => this._setSearchKind(value)}
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
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                label="分销员等级"
                style={{ width: 80 }}
                onChange={(value) => {
                  saveSearchParams({
                    field: 'distributorLevelId',
                    value: value
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
                getCalendarContainer={() =>
                  document.getElementById('page-content')
                }
                value={
                  searchParams.get('createStartTime')
                    ? [
                        moment(
                          searchParams.get('createStartTime'),
                          Const.TIME_FORMAT
                        ),
                        moment(
                          searchParams.get('createEndTime'),
                          Const.TIME_FORMAT
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
                    field: 'createStartTime',
                    value: beginTime
                  });
                  saveSearchParams({
                    field: 'createEndTime',
                    value: endTime
                  });
                }}
              />
            </FormItem>

            <FormItem>
              <Button
                icon="search"
                type="primary"
                onClick={() => onSearch()}
                htmlType="submit"
              >
                搜索
              </Button>
            </FormItem>
          </Form>
        </div>
        <div className="handle-bar">
          {/*导出权限*/}
          <AuthWrapper functionName={'f_distribution_commission_export'}>
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
    );
  }

  async _handleBatchExport() {
    // 校验是否有导出权限
    const haveAuth = checkAuth('f_distribution_commission_export');
    if (haveAuth) {
      const { onExportByParams, onExportByIds } = this.props.relaxProps;
      this.props.relaxProps.onExportModalChange({
        visible: true,
        byParamsTitle: '导出筛选出的分销员佣金记录',
        byIdsTitle: '导出选中的分销员佣金记录',
        exportByParams: onExportByParams,
        exportByIds: onExportByIds
      });
    } else {
      message.error('此功能您没有权限访问');
    }
  }

  //分销员搜索类型切换
  _setSearchKind = (value) => {
    const { setSearchKind } = this.props.relaxProps;
    setSearchKind(value);
  };

  _changeToCash = (money) => {
    return money ? '￥' + money.toFixed(2) : '￥0.00';
  };
}

const styles = {
  content: {
    background: '#ffffff',
    padding: 10
  },
  title: {
    fontSize: 18,
    marginBottom: 30,
    display: 'block',
    color: '#333333'
  } as any,
  h4: {
    fontSize: 14,
    color: '#333333'
  },
  nav: {
    fontSize: 14,
    color: '#666666',
    padding: 5
  },
  num: {
    color: '#F56C1D',
    fontSize: 16,
    padding: 5
  },
  static: {
    background: '#fafafa',
    padding: 10,
    marginBottom: 16
  },
  box: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 20
  } as any,
  item: {
    color: '#666',
    fontSize: 14,
    display: 'block',
    padding: 5,
    marginRight: 20
  },
  itemCur: {
    color: '#F56C1D',
    fontSize: 14,
    borderBottom: '2px solid #F56C1D',
    padding: 5,
    marginRight: 20
  }
};
