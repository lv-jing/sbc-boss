import * as React from 'react';
import { Relax, IMap } from 'plume2';
import {
  Input,
  Button,
  Form,
  Select,
  DatePicker,
  AutoComplete,
  Modal,
  message
} from 'antd';

import {
  SelectGroup,
  noop,
  Const,
  AutoCompleteGroup,
  AuthWrapper
} from 'qmkit';
import { List } from 'immutable';

type TList = List<IMap>;
const FormItem = Form.Item;
const Option = Select.Option;
const AutoOption = AutoComplete.Option;
const confirm = Modal.confirm;

declare type IList = List<any>;
@Relax
export default class Search extends React.Component<any, any> {
  props: {
    relaxProps?: {
      form: any;
      setFormField: Function;
      init: Function;
      queryStoreByName: Function;
      storeMap: IMap;
      selected: IList;
      onBatchChecked: Function;
      batchSetSticky: Function;
      grouponCateIdList: TList;
    };
  };

  static relaxProps = {
    // 搜索项
    form: 'form',
    setFormField: noop,
    init: noop,
    queryStoreByName: noop,
    storeMap: 'storeMap',
    selected: 'selected',
    onBatchChecked: noop,
    batchSetSticky: noop,
    grouponCateIdList: 'grouponCateIdList'
  };
  state = {
    startValue: null,
    endValue: null
  };
  render() {
    const {
      form,
      setFormField,
      init,
      storeMap,
      grouponCateIdList
    } = this.props.relaxProps;
    const { startValue, endValue } = this.state;
    const { goodsName, tabType, sticky } = form.toJS();
    return (
      <div>
        <Form className="filter-content" layout="inline">
          <FormItem>
            <AutoCompleteGroup
              size="default"
              label="店铺名称"
              style={{ width: 180 }}
              dataSource={this._renderOption(storeMap.toJS())}
              onSelect={(value) => setFormField('storeId', value)}
              onChange={(value) => this._handleOnStoreNameChange(value)}
              allowClear={true}
              placeholder=""
            />
          </FormItem>

          <FormItem>
            <Input
              addonBefore="商品名称"
              value={goodsName}
              onChange={(e: any) => setFormField('goodsName', e.target.value)}
            />
          </FormItem>
          <FormItem>
            <SelectGroup
              getPopupContainer={() => document.getElementById('page-content')}
              label="拼团分类"
              style={{ width: 80 }}
              onChange={(value) => {
                value = value === '' ? null : value;
                setFormField('grouponCateId', value);
              }}
            >
              <Option value="">全部</Option>
              {grouponCateIdList &&
                grouponCateIdList.map((v,index) => (
                    index && ( <Option
                    key={v.get('grouponCateId').toString()}
                    value={v.get('grouponCateId').toString()}
                  >
                    {v.get('grouponCateName')}
                  </Option>)
                ))}
            </SelectGroup>
          </FormItem>

          <FormItem>
            <DatePicker
              allowClear={true}
              disabledDate={this._disabledStartDate}
              format={Const.DAY_FORMAT}
              value={startValue}
              placeholder="开始时间"
              onChange={this._onStartChange}
              showToday={false}
            />
          </FormItem>

          <FormItem>
            <DatePicker
              allowClear={true}
              disabledDate={this._disabledEndDate}
              format={Const.DAY_FORMAT}
              value={endValue}
              placeholder="结束时间"
              onChange={this._onEndChange}
              showToday={false}
            />
          </FormItem>
          <FormItem>
            <SelectGroup
              getPopupContainer={() => document.getElementById('page-content')}
              label="精选"
              defaultValue=""
              onChange={(e) => setFormField('sticky', e.valueOf())}
              value={sticky}
            >
              <Option key="-1" value="">
                全部
              </Option>
              <Option key="0" value="false">
                否
              </Option>
              <Option key="1" value="true">
                是
              </Option>
            </SelectGroup>
          </FormItem>
          <FormItem>
            <Button type="primary" onClick={() => init()}   htmlType="submit">
              搜索
            </Button>
          </FormItem>
          {(tabType == '0' || tabType == '1' || tabType == '2') && (
            <AuthWrapper functionName="f_groupon-activity-sticky">
              <div className="handle-bar">
                <Button type="primary" onClick={this._setSticky}>
                  设置精选
                </Button>
              </div>
            </AuthWrapper>
          )}
          {(tabType == '3' || tabType == '4') && (
            <AuthWrapper functionName="f_groupon-activity-batch-pass">
              <div className="handle-bar">
                <Button type="primary" onClick={this._onBatchChecked}>
                  批量通过
                </Button>
              </div>
            </AuthWrapper>
          )}
        </Form>
      </div>
    );
  }

  /**
   * autoComplete中选项
   * @param item
   * @returns {any}
   */
  _renderOption = (storeMap) => {
    let optionArray = [];
    for (let store in storeMap) {
      optionArray.push(<AutoOption key={store}>{storeMap[store]}</AutoOption>);
    }
    return optionArray;
  };

  /**
   * 根据商铺名称模糊查询
   * @param value
   * @private
   */
  _handleOnStoreNameChange = (value) => {
    const { queryStoreByName, setFormField } = this.props.relaxProps;
    if (value) {
      queryStoreByName(value);
    } else {
      setFormField('storeId', null);
    }
  };

  _onChange = (field, value) => {
    this.setState({
      [field]: value
    });
  };

  _disabledStartDate = (startValue) => {
    const endValue = this.state.endValue;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };

  _disabledEndDate = (endValue) => {
    const startValue = this.state.startValue;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  _onStartChange = (value) => {
    let time = value;
    if (time != null) {
      time = time.format(Const.DAY_FORMAT) + ' 00:00:00';
    }
    const { setFormField } = this.props.relaxProps;
    setFormField('startTime', time);
    setFormField('startValue', value);
    this._onChange('startValue', value);
  };

  _onEndChange = (value) => {
    let time = value;
    if (time != null) {
      time = time.format(Const.DAY_FORMAT) + ' 23:59:59';
    }
    const { setFormField } = this.props.relaxProps;
    setFormField('endTime', time);
    setFormField('endValue', value);
    this._onChange('endValue', value);
  };

  /**
   * 批量审核通过
   * @private
   */
  _onBatchChecked = () => {
    const { selected, onBatchChecked } = this.props.relaxProps;
    if (selected.count() < 1) {
      message.error('请先选择拼团活动');
      return;
    }
    confirm({
      title: '提示',
      content: '是否确定批量审核通过所选拼团活动？',
      onOk() {
        onBatchChecked(selected);
      }
    });
  };

  /**
   * 批量设置精选
   * @private
   */
  _setSticky = () => {
    const { selected, batchSetSticky } = this.props.relaxProps;
    if (selected.count() < 1) {
      message.error('请先选择拼团活动');
      return;
    }
    confirm({
      title: '提示',
      content: '是否确定批量设置精选所选拼团活动？',
      onOk() {
        batchSetSticky(selected);
      }
    });
  };
}
