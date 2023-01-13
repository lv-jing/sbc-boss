import React from 'react';
import { DatePicker, Form, Input, Radio, Select } from 'antd';
import moment from 'moment';
import { Const, ValidConst } from 'qmkit';
import { IList, IMap } from 'typings/globalType';

const defaultImg = require('../img/none.png');
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    span: 24,
    xs: { span: 24 },
    sm: { span: 14 }
  }
};

const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;
const Option = Select.Option;

export default class EditForm extends React.Component<any, any> {
  props: {
    form: any;
    relaxProps?: {
      formData: IMap;
      editFormData: Function;
      cateList: IList;
    };
  };

  render() {
    const { formData, cateList } = this.props.relaxProps;
    const { getFieldDecorator } = this.props.form;
    const maxStock = formData.get('maxStock');
    return (
      <Form className="login-form errorFeedback">
        <FormItem {...formItemLayout} label="商品图片">
          {formData.get('goodsInfo').get('goodsInfoImg') ? (
            <img
              src={formData.get('goodsInfo').get('goodsInfoImg')}
              style={styles.imgItem}
            />
          ) : formData.get('goods').get('goodsImg') ? (
            <img
              src={formData.get('goods').get('goodsImg')}
              style={styles.imgItem}
            />
          ) : (
            <img src={defaultImg} style={styles.imgItem} />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="商品名称">
          {formData.get('goods').get('goodsName')}
        </FormItem>
        <FormItem {...formItemLayout} label="规格">
          {formData.get('specText')}
        </FormItem>
        <FormItem {...formItemLayout} label="商家名称">
          {formData.get('goodsInfo').get('storeName')}
        </FormItem>
        <FormItem {...formItemLayout} label="市场价格">
          {'￥' + formData.get('goodsInfo').get('marketPrice')}
        </FormItem>
        <FormItem {...formItemLayout} label="现有库存">
          {formData.get('goodsInfo').get('stock')}
        </FormItem>
        <FormItem {...formItemLayout} label="结算价格">
          {getFieldDecorator('settlementPrice', {
            rules: [
              {
                required: true,
                message: '请填写结算价'
              },
              {
                pattern: ValidConst.zeroPrice,
                message: '请填写两位小数的合法金额'
              },
              {
                type: 'number',
                max: 9999999.99,
                message: '最大值为9999999.99',
                transform: function(value) {
                  return isNaN(parseFloat(value)) ? 0 : parseFloat(value);
                }
              }
            ],
            initialValue:
              formData.get('settlementPrice') ||
              formData.get('settlementPrice') == 0
                ? formData.get('settlementPrice').toString()
                : null
          })(
            <Input
              onChange={(e) =>
                this._changeFormData('settlementPrice', e.target.value)
              }
              style={{ width: '70px' }}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="分类">
          {getFieldDecorator('cateId', {
            rules: [
              {
                required: true,
                message: '请选择分类'
              }
            ],
            initialValue: formData.get('pointsGoodsCate').get('cateName')
          })(
            <Select
              getPopupContainer={() => document.getElementById('page-content')}
              showSearch
              optionFilterProp="children"
              onChange={(e) => {
                this._changeFormData('cateId', e);
              }}
              style={{ width: '120px' }}
            >
              {cateList.map((v) => {
                return (
                  <Option value={v.get('cateId')} key={v.get('cateName')}>
                    {v.get('cateName')}
                  </Option>
                );
              })}
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="兑换数量">
          {getFieldDecorator('convertStock', {
            initialValue:
              formData.get('stock') || formData.get('stock') == 0
                ? formData.get('stock').toString()
                : null,
            rules: [
              { required: true, message: '必须输入兑换数量' },
              {
                pattern: ValidConst.noZeroNineNumber,
                message: '请输入1-999999999的整数'
              },
              {
                validator: (_rule, value, callback) => {
                  if (maxStock < value) {
                    callback('兑换数量不可大于剩余库存');
                    return;
                  }
                  callback();
                }
              }
            ]
          })(
            <Input
              onChange={(e) => this._changeFormData('stock', e.target.value)}
              style={{ width: '70px' }}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="兑换积分">
          {getFieldDecorator('convertPoints', {
            initialValue:
              formData.get('points') || formData.get('points') == 0
                ? formData.get('points').toString()
                : null,
            rules: [
              { required: true, message: '必须输入兑换积分' },
              {
                pattern: ValidConst.noZeroNineNumber,
                message: '请输入1-999999999的整数'
              }
            ]
          })(
            <Input
              onChange={(e) => this._changeFormData('points', e.target.value)}
              style={{ width: '70px' }}
            />
          )}
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
                this._changeFormData('beginTime', dateString[0] + ':00');
                this._changeFormData('endTime', dateString[1] + ':00');
              }
            },
            initialValue: formData.get('beginTime') &&
              formData.get('endTime') && [
                moment(formData.get('beginTime')),
                moment(formData.get('endTime'))
              ]
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
        <FormItem {...formItemLayout} label="是否推荐">
          {getFieldDecorator('recommendFlag', {
            rules: [{ required: true, message: '请选择是否推荐' }],
            onChange: (e) => this._changeFormData('recommendFlag', e.target.value),
            initialValue: formData.get('recommendFlag')
          })(
            <RadioGroup>
              <Radio value={1}>是</Radio>
              <Radio value={0}>否</Radio>
            </RadioGroup>
          )}
        </FormItem>
      </Form>
    );
  }

  /**
   * 修改表单字段
   */
  _changeFormData = (key, value) => {
    const { editFormData } = this.props.relaxProps;
    editFormData({ key, value });
  };

  /**
   * 开始兑换不可选的日期
   */
  _disabledDate(current) {
    return current < moment().startOf('day');
  }
}

const styles = {
  item: {
    float: 'left',
    width: '50%',
    display: 'flex',
    flexDirection: 'row',
    margin: '10px 0',
    height: 124
  },
  cell: {
    color: '#999',
    width: 200,
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  } as any,
  label: {
    color: '#999',
    width: 80,
    textAlign: 'right',
    display: 'inline-block'
  } as any,
  imgItem: {
    width: 60,
    height: 60,
    padding: 5,
    border: '1px solid #ddd',
    background: '#fff'
  },
  textCon: {
    width: 120,
    maxHeight: 62,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    webkitBoxOrient: 'vertical'
  } as any
} as any;
