import React from 'react';
import { Icon, Tooltip, Radio, Select } from 'antd';
import { StoreProvider } from 'plume2';

import { StatisticsHeader, WMChart, DownloadModal } from 'biz';
import { DataModal, BreadCrumb } from 'qmkit';
import ChinaMap from './component/chinachart/index';

import CustomerStatisticsList from './component/list';
import CustomerStatisticsMultiList from './component/multiList';
import WMPieChart from './component/pieChart';
import AppStore from './store';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;

enum dayChoice {
  today = 0,
  yesterday = 1,
  sevenDays = 2,
  thirtyDays = 3
}

enum chartType {
  level = 0,
  area = 1
}

@StoreProvider(AppStore, { debug: __DEV__ })
export default class CustomerStatistics extends React.Component<any, any> {
  store: AppStore;

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.store.init();
  }

  render() {
    const currentDayChoice = this.store.state().get('dayChoice');
    const currentChart = this.store.state().get('chartType');

    const viewData = this.store.state().get('viewData');
    const chartData = this.store.state().get('chartData');
    const dateRange = this.store.state().get('dateRange');

    return (
      <div>
        <BreadCrumb />
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>数谋</Breadcrumb.Item>
          <Breadcrumb.Item>统计报表</Breadcrumb.Item>
          <Breadcrumb.Item>客户统计</Breadcrumb.Item>
        </Breadcrumb> */}
        <div style={{ margin: '12px 12px 0 12px' }}>
          <div style={styles.content}>
            <div>
              <h4 style={styles.h4}>客户概况</h4>
              <div style={{ marginBottom: 20 }}>
                <div style={styles.headBox}>
                  <ul style={styles.box}>
                    <li>
                      <a
                        style={
                          currentDayChoice == dayChoice.today
                            ? styles.itemCur
                            : styles.item
                        }
                        onClick={() => this._changeChoice('day', dayChoice.today)}
                      >
                        今天
                    </a>
                    </li>
                    <li>
                      <a
                        style={
                          currentDayChoice == dayChoice.yesterday
                            ? styles.itemCur
                            : styles.item
                        }
                        onClick={() =>
                          this._changeChoice('day', dayChoice.yesterday)
                        }
                      >
                        昨天
                    </a>
                    </li>
                    <li>
                      <a
                        style={
                          currentDayChoice == dayChoice.sevenDays
                            ? styles.itemCur
                            : styles.item
                        }
                        onClick={() =>
                          this._changeChoice('day', dayChoice.sevenDays)
                        }
                      >
                        7天前
                    </a>
                    </li>
                    <li>
                      <a
                        style={
                          currentDayChoice == dayChoice.thirtyDays
                            ? styles.itemCur
                            : styles.item
                        }
                        onClick={() =>
                          this._changeChoice('day', dayChoice.thirtyDays)
                        }
                      >
                        30天前
                    </a>
                    </li>
                  </ul>
                  <Select
                    showSearch
                    allowClear={true}
                    style={{ width: 300, marginRight: 20 }}
                    placeholder="请选择店铺"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option.props.children as any)
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    onChange={(value) => this._changeStore(value)}
                  >
                    {this._renderOption(this.store.state().get('allShops'))}
                  </Select>
                  <div style={{ textAlign: 'right' }}>
                    <Tooltip placement="left" title={this._renderTitle}>
                      <a style={{ fontSize: 14 }}>
                        <Icon type="question-circle-o" />&nbsp;&nbsp;统计说明
                    </a>
                    </Tooltip>
                  </div>
                </div>

                <div style={styles.rowAway}>
                  <div>
                    <p style={styles.total}>客户总数</p>
                    <h2 style={styles.h2}>
                      {viewData.get('total') ? viewData.get('total') : 0}
                    </h2>
                  </div>
                  <div>
                    <RadioGroup
                      value={currentChart}
                      onChange={(e) =>
                        this._changeChoice('chart', (e as any).target.value)
                      }
                    >
                      {this.store.state().get('companyId') ? (
                        <RadioButton value={chartType.level}>
                          等级分布
                      </RadioButton>
                      ) : null}
                      <RadioButton value={chartType.area}>
                        地区分布
                    </RadioButton>
                    </RadioGroup>
                  </div>
                </div>

                {viewData &&
                  viewData.get('viewList') &&
                  viewData.get('viewList').size > 0 ? (
                    <div style={{ height: 400 }}>
                      {currentChart == 0 ? (
                        <WMPieChart
                          content={viewData.get('viewList').toJS()}
                          height={400}
                        />
                      ) : (
                          <ChinaMap
                            title="客户地区分布"
                            style={{ height: '400px' }}
                            dataJson={viewData.get('viewList').toJS()}
                            height={400}
                            showProvince={false}
                          />
                        )}
                    </div>
                  ) : (
                    <div style={{ height: 400 }}>
                      {currentChart == 0 ? (
                        <WMPieChart
                          content={[{ "levelId": "-1", "levelName": "无", "centage": "100.00%", "num": 0 }]}
                          height={400}
                        />
                      ) : (
                          <ChinaMap
                            title="客户地区分布"
                            style={{ height: '400px' }}
                            dataJson={[]}
                            height={400}
                            showProvince={false}
                          />
                        )}
                    </div>
                  )}
              </div>
            </div>
          </div>

          <StatisticsHeader
            noTitle={true}
            onClick={(param) =>
              this.store.setDateRange(param[0], param[1], param[2])
            }
          />

          {chartData && (
            <WMChart
              title="客户增长趋势"
              startTime={new Date(dateRange.get('startTime'))}
              endTime={new Date(dateRange.get('endTime'))}
              dataDesc={this._renderWmChartIndex()}
              radioClickBack={(value) => this._dateRangeChanged(value)}
              currentWeekly={this.store.state().get('weekly')}
              content={this._renderWmChartDataIndex(chartData).toJS()}
              xAxisKey={'xValue'}
            />
          )}

          <div style={styles.content}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 10
              }}
            >
              <h4 style={styles.h4}>客户增长报表</h4>
              <DownloadModal
                visible={false}
                reportType={5}
                companyId={this.store.state().get('companyId')}
              />
            </div>
            <CustomerStatisticsList />
          </div>

          <div style={styles.content}>
            <h4 style={styles.h4}>客户订货报表</h4>
            <CustomerStatisticsMultiList />
          </div>
        </div>


        <DataModal />
      </div>
    );
  }

  /**
   * 渲染WmChart的折线图是否有注册客户数
   *
   * 当选择了商家之后，删除注册客户数图例
   *
   * @returns {({title: string, key: string}|{title: string, key: string}|{title: string, key: string})[]}
   * @private
   */
  _renderWmChartIndex = () => {
    let array = [
      {
        title: '客户总数',
        key: 'customerAllCount'
      },
      {
        title: '新增客户数',
        key: 'customerDayGrowthCount'
      },
      {
        title: '注册客户数',
        key: 'customerDayRegisterCount'
      }
    ];
    if (this.store.state().get('companyId')) {
      array.pop();
    }
    return array;
  };

  /**
   * 渲染WmChart的折线图是否有注册客户数
   *
   * 当选择了商家之后，删除注册客户数图例
   *
   * @returns {({title: string, key: string}|{title: string, key: string}|{title: string, key: string})[]}
   * @private
   */
  _renderWmChartDataIndex = (array) => {
    if (this.store.state().get('companyId')) {
      return array.map((item) =>
        item
          .delete('customerDayRegisterCount')
          .delete('setCustomerDayRegisterCount')
      );
    } else {
      return array;
    }
  };

  _dateRangeChanged = (value) => {
    this.store.getChartData(1 === value);
    this.store.setCurrentChartWeekly(1 === value);
  };

  _changeChoice = async (choiceType, choiceValue) => {
    //切换时间时
    if (choiceType == 'day') {
      //companyId为真
      if (this.store.state().get('companyId')) {
        //获取图表类型
        const chartType = this.store.state().get('chartType');
        await this.store.getViewData(choiceValue, chartType);
      } else {
        //只能获取地区分布
        await this.store.getViewData(choiceValue, 1);
      }
    } else {
      //等级分布与地区分布切换时
      const dayChoice = this.store.state().get('dayChoice');
      if (this.store.state().get('companyId')) {
        await this.store.getViewData(dayChoice, choiceValue);
      }
    }
    // //有companyId时，为day,没有的时候为area
    // let trueChoiceType = this.store.state().get('companyId') ? 'day' : 'chart'
    // const currentDayChoice = this.store.state().get('dayChoice');
    //
    // if (trueChoiceType == 'day' && choiceValue != currentDayChoice && this.store.state().get('companyId')) {
    //   await this.store.getViewData(choiceValue,choiceType);
    //   //this.setState({currentDayChoice: choiceValue});
    // } else if (trueChoiceType == 'chart' && this.store.state().get('compayId')) {
    //   await this.store.getViewData(choiceValue, choiceType);
    //   //this.setState({currentDayChoice: choiceValue, currentChart: currentChart});
    // } else {
    //   await this.store.getViewData(choiceValue, choiceType);
    //   //this.setState({currentDayChoice: choiceValue});
    // }
  };

  _renderTitle = () => {
    return (
      <div>
        <p>
          <span>1、当前统计不区分PC/H5/APP端；</span>
        </p>
        <p>
          <span>2、当前统计不区分订货端和管理端；</span>
        </p>
        <p>
          <span>
            3、订单在提交成功后纳入统计，订单金额以订单提交成功时为准；
          </span>
        </p>
        <p>
          <span>4、退单在完成后纳入统计，退货金额以退单完成时为准；</span>
        </p>
        <p>
          <span>
            5、统计时间内商品没有销售/退货，客户没有订单/退单，则不在报表中体现；
          </span>
        </p>
      </div>
    );
  };

  _renderOption = (data: any) => {
    return data.map((v) => {
      return (
        <Option
          key={v.companyInfoId}
          value={v.companyInfoId + '_' + v.storeName}
        >
          {v.storeName}
        </Option>
      );
    });
  };

  /**
   * 选择店铺
   * @param value
   * @private
   */
  _changeStore = (value) => {
    if (value) {
      this.store.setCompanyInfoId(value.split('_')[0]);
    } else {
      //清空
      this.store.setCompanyInfoId(null);
    }
  };
}

const styles = {
  content: {
    background: '#ffffff',
    padding: 20,
    marginTop: 10
  },
  title: {
    fontSize: 18,
    marginBottom: 30,
    display: 'block',
    color: '#333333'
  } as any,
  h4: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 10
  },
  nav: {
    fontSize: 14,
    color: '#666666',
    padding: 5
  },
  num: {
    color: '#333333',
    fontSize: 16,
    padding: 5
  },
  static: {
    background: '#fafafa',
    padding: 10,
    marginTop: 10
  },
  item: {
    color: '#666',
    fontSize: 14,
    display: 'block',
    padding: 5,
    marginRight: 20
  },
  box: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '60%'
  } as any,
  itemCur: {
    color: '#F56C1D',
    fontSize: 14,
    borderBottom: '2px solid #F56C1D',
    padding: 5,
    marginRight: 20
  },
  total: {
    fontSize: 12,
    color: '#666666',
    marginTop: 20
  },
  h2: {
    fontSize: 18,
    color: '#333333'
  },
  rowAway: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between'
  } as any,
  headBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  } as any
};
