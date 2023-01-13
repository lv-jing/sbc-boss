import React from 'react';
import { Relax, IMap } from 'plume2';
import moment from 'moment';
import { Button, Form, DatePicker, AutoComplete } from 'antd';

import { noop } from 'qmkit';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const AutoOption = AutoComplete.Option;

@Relax
export default class SearchForm extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      beginTime: moment(nextProps.relaxProps.dateRange.get('beginTime')),
      endTime: moment(nextProps.relaxProps.dateRange.get('endTime')),
      pickErrorInfo: '',
      storeName: ''
    });
  }

  state = {
    beginTime: moment(this.props.relaxProps.dateRange.get('beginTime')),
    endTime: moment(this.props.relaxProps.dateRange.get('endTime')),
    pickOpen: false,
    pickErrorInfo: '',
    storeName: ''
  };

  props: {
    relaxProps?: {
      dateRange: any;
      //改变日期范围
      changeDateRange: Function;
      //根据日期搜索
      searchByDate: Function;
      tabKey: string;
      queryStoreByName: Function;
      storeMap: IMap;
      storeName: string;
      storeQueryName: Function;
    };
  };

  static relaxProps = {
    dateRange: 'dateRange',
    changeDateRange: noop,
    searchByDate: noop,
    tabKey: 'tabKey',
    queryStoreByName: noop,
    storeMap: 'storeMap',
    storeName: 'storeName',
    storeQueryName: noop
  };

  render() {
    const { searchByDate, storeMap, storeName } = this.props.relaxProps;
    const { beginTime, endTime, pickErrorInfo, pickOpen } = this.state;
    const options = {
      onFocus: () => {
        this.setState({ pickOpen: true });
      },
      onBlur: () => {
        this.setState({ pickOpen: false });
      }
    };
    return (
      <div>
        <Form className="filter-content" layout="inline">
          <FormItem>
            <RangePicker
              getCalendarContainer={() =>
                document.getElementById('page-content')
              }
              allowClear={false}
              format="YYYY-MM-DD"
              placeholder={['起始时间', '结束时间']}
              onChange={(date, dateString) =>
                this._handleDateParams(date, dateString)
              }
              renderExtraFooter={() =>
                pickErrorInfo != '' && (
                  <span style={{ color: 'red' }}>{pickErrorInfo}</span>
                )
              }
              value={[beginTime, endTime]}
              open={pickOpen}
              onOpenChange={() => this.setState({ pickErrorInfo: '' })}
              {...options}
            />
          </FormItem>
          <FormItem>
            <AutoComplete
              value={storeName}
              defaultValue={this.state.storeName}
              size="default"
              dataSource={this._renderOption(storeMap.toJS())}
              onSelect={(value, option: any) =>
                this._storeName(value, option.props.children)
              }
              style={{ width: 180 }}
              onChange={(value) => this._handleOnStoreNameChange(value)}
              allowClear={true}
              placeholder="店铺名称"
            />
          </FormItem>
          <FormItem>
            <Button type="primary" onClick={() => searchByDate()} htmlType="submit">
              搜索
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }

  /**
   * 操作时间段的选择
   * @param date
   * @param dateString
   * @private
   */
  _handleDateParams = (date, _dateString) => {
    let startTime = date[0];
    let endTime = date[1];
    let endTimeClone: any = endTime.clone();
    if (startTime.valueOf() >= endTimeClone.subtract(3, 'months').valueOf()) {
      this.setState({
        pickOpen: false,
        pickErrorInfo: '',
        beginTime: startTime,
        endTime
      });
      const { changeDateRange } = this.props.relaxProps;
      changeDateRange('beginTime', startTime.format('YYYY-MM-DD').toString());
      changeDateRange('endTime', endTime.format('YYYY-MM-DD').toString());
    } else {
      this.setState({
        pickOpen: true,
        pickErrorInfo: '开始时间和结束时间需在三个月之内'
      });
    }
  };

  /**
   * 根据商铺名称模糊查询
   * @param value
   * @private
   */
  _handleOnStoreNameChange = (value) => {
    const { queryStoreByName, storeQueryName } = this.props.relaxProps;
    if (value) {
      queryStoreByName(value);
    } else {
      storeQueryName('');
    }
  };

  /**
   * autoComplete中选项
   * @param item
   * @returns {any}
   */
  _renderOption = (storeMap) => {
    let optionArray = [];
    for (let store in storeMap) {
      optionArray.push(
        <AutoOption key={storeMap[store]}>{storeMap[store]}</AutoOption>
      );
    }
    return optionArray;
  };

  /**
   * 店铺搜索关键字
   * @param value
   * @param name
   * @private
   */
  _storeName = (_value, name) => {
    this.props.relaxProps.storeQueryName(name);
  };
}
