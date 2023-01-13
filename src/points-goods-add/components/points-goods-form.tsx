import React, { Component } from 'react';

import { Button, DatePicker, Form } from 'antd';
import { IList } from 'typings/globalType';

import { Const, history, noop, QMMethod } from 'qmkit';
import moment from 'moment';
import SelectedGoodsGrid from './selected-goods-grid';
import { GoodsModal } from 'biz';

const FormItem = Form.Item;

const formItemLayout = {
  title: {
    fontSize: 14,
    marginBottom: 10,
    display: 'block'
  }
};

const { RangePicker } = DatePicker;

export default class PointsGoodsForm extends Component<any, any> {
  props: {
    form: any;
    location: any;
    relaxProps?: {
      // 开始时间
      startTime: string;
      // 结束时间
      endTime: string;
      // 选中的商品
      chooseSkuIds: IList;
      goodsModalVisible: boolean;
      goodsRows: IList;
      // 按钮禁用
      btnDisabled: boolean;
      // 键值设置方法
      fieldsValue: Function;
      // 修改时间区间方法
      changeDateRange: Function;
      onCancelBackFun: Function;
      onOkBackFun: Function;
      doAdd: Function;
    };
  };

  static relaxProps = {
    startTime: 'startTime',
    endTime: 'endTime',
    chooseSkuIds: 'chooseSkuIds',
    goodsModalVisible: 'goodsModalVisible',
    goodsRows: 'goodsRows',
    btnDisabled: 'btnDisabled',

    fieldsValue: noop,
    changeDateRange: noop,
    onCancelBackFun: noop,
    onOkBackFun: noop,
    doAdd: noop
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      startTime,
      endTime,
      changeDateRange,
      onCancelBackFun,
      goodsModalVisible,
      chooseSkuIds,
      goodsRows,
      btnDisabled
    } = this.props.relaxProps;
    return (
      <div style={{ width: '100%' }}>
        <Form style={{ width: '100%' }}>
          <FormItem
            {...formItemLayout}
            label="选择商品"
            style={{ width: '100%' }}
          >
            {this.chooseGoods().dom}
          </FormItem>

          <FormItem {...formItemLayout} label="兑换时间">
            {getFieldDecorator('time', {
              rules: [
                { required: true, message: '请选择起止时间' },
                {
                  validator: (_rule, value, callback) => {
                    if (
                      value &&
                      moment(new Date()).unix() > moment(value[0]).unix()
                    ) {
                      callback('开始时间不能早于现在');
                    } else {
                      callback();
                    }
                  }
                }
              ],
              onChange: (date, dateString) => {
                if (date) {
                  changeDateRange({
                    startTime: dateString[0] + ':00',
                    endTime: dateString[1] + ':00'
                  });
                }
              },
              initialValue: startTime &&
                endTime && [moment(startTime), moment(endTime)]
            })(
              <RangePicker
                getCalendarContainer={() =>
                  document.getElementById('page-content')
                }
                allowClear={false}
                format={Const.DATE_FORMAT}
                placeholder={['起始时间', '结束时间']}
                disabledDate={this._disabledDate}
                showTime={{ format: 'HH:mm' }}
              />
            )}
          </FormItem>
        </Form>
        <div className="bar-button">
          <Button
            disabled={btnDisabled}
            type="primary"
            onClick={() => this.onAdd()}
            style={{ marginRight: 10 }}
          >
            保存
          </Button>
          <Button onClick={() => history.goBack()} style={{ marginLeft: 10 }}>
            取消
          </Button>
        </div>
        <GoodsModal
          showValidGood={true}
          // 是否仅勾选上架商品
          checkAddedGood={false}
          visible={goodsModalVisible}
          selectedSkuIds={chooseSkuIds.toJS()}
          selectedRows={goodsRows.toJS()}
          onOkBackFun={this._onOkBackFun}
          onCancelBackFun={onCancelBackFun}
          companyType={3}
        />
      </div>
    );
  }

  /**
   * 已选商品结构
   */
  chooseGoods = () => {
    const { chooseSkuIds } = this.props.relaxProps;
    const { getFieldDecorator } = this.props.form;
    return {
      dom: getFieldDecorator('chooseSkuIds', {
        initialValue: chooseSkuIds.toJS(),
        rules: [{ required: true, message: '请选择商品' }]
      })(<SelectedGoodsGrid form={this.props.form} />)
    };
  };

  /**
   *商品 点击确定之后的回调
   */
  _onOkBackFun = (skuIds, rows) => {
    this.props.form.setFieldsValue({
      chooseSkuIds: skuIds
    });
    // this.props.form.validateFields((_errs) => {});
    this.props.relaxProps.onOkBackFun(skuIds, rows);
  };

  /**
   * 开始兑换不可选的日期
   */
  _disabledDate(current) {
    return current < moment().startOf('day');
  }

  onAdd = QMMethod.onceFunc(async () => {
    const { doAdd } = this.props.relaxProps;
    this.props.form.validateFields((err) => {
      if (!err) {
        doAdd();
      } else {
        this.setState({
          flushStatus: Math.random()
        });
      }
    });
  }, 1000);
}
