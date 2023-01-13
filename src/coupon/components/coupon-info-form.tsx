import React, { Component } from 'react';

import {
  Form,
  Input,
  Select,
  DatePicker,
  Radio,
  Tree,
  TreeSelect,
  Button,
  Row,
  Col,
  message
} from 'antd';
import { IList } from 'typings/globalType';
import styled from 'styled-components';

import { noop, QMMethod, Const, ValidConst, history } from 'qmkit';
import moment from 'moment';
import { fromJS } from 'immutable';

const TreeNode = Tree.TreeNode;

const ErrorDiv = styled.div`
  margin-top: -25px;
  margin-bottom: -25px;
  .ant-form-explain {
    margin-top: 0;
  }
`;

const RightContent = styled.div`
  width: 680px;
`;

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    xl: { span: 5 }
  },
  wrapperCol: {
    xl: { span: 18 }
  }
};
const formItemSmall = {
  labelCol: {
    xl: { span: 5 }
  },
  wrapperCol: {
    xl: { span: 12 }
  }
};

const Option = Select.Option;

const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;
const { TextArea } = Input;

export default class CouponInfoForm extends Component<any, any> {
  props: {
    form: any;
    location: any;
    relaxProps?: {
      // 优惠券类型
      couponType: Number;
      // 优惠券Id
      couponId: string;
      // 优惠券名称
      couponName: string;
      // 优惠券分类
      couponCates: IList;
      // 优惠券分类选中Id
      couponCateIds: IList;
      // 起止时间类型 0：按起止时间，1：按N天有效
      rangeDayType: Number;
      // 优惠券开始时间
      startTime: string;
      // 优惠券结束时间
      endTime: string;
      // 有效天数
      effectiveDays: Number;
      // 优惠券面值
      denomination: Number;
      // 购满类型 0：无门槛，1：满N元可使用
      fullBuyType: Number;
      // 购满多少钱
      fullBuyPrice: Number;
      // 营销类型(0,1,2,3) 0全部商品，1品牌，2平台类目/店铺分类，3自定义货品（店铺可用）
      scopeType: Number;
      // 商品品牌
      brands: IList;
      // 商品分类
      cates: IList;
      // 选中的品牌
      chooseBrandIds: IList;
      // 选中的分类
      chooseCateIds: IList;
      // 优惠券
      couponDesc: string;
      // 按钮禁用
      btnDisabled: boolean;
      // 聚合分类Ids
      reducedCateIds: IList;

      // 键值设置方法
      fieldsValue: Function;
      // 修改时间区间方法
      changeDateRange: Function;
      // 修改营销类型方法
      chooseScopeType: Function;
      // 新增优惠券
      addCoupon: Function;
      // 修改优惠券
      editCoupon: Function;
      // 改变按钮禁用状态
      changeBtnDisabled: Function;
      dealErrorCode: Function;
    };
  };

  static relaxProps = {
    couponType: 'couponType',
    couponId: 'couponId',
    couponName: 'couponName',
    couponCates: 'couponCates',
    couponCateIds: 'couponCateIds',
    rangeDayType: 'rangeDayType',
    startTime: 'startTime',
    endTime: 'endTime',
    effectiveDays: 'effectiveDays',
    denomination: 'denomination',
    fullBuyType: 'fullBuyType',
    fullBuyPrice: 'fullBuyPrice',
    scopeType: 'scopeType',
    brands: 'brands',
    cates: 'cates',
    chooseBrandIds: 'chooseBrandIds',
    chooseCateIds: 'chooseCateIds',
    couponDesc: 'couponDesc',
    btnDisabled: 'btnDisabled',
    reducedCateIds: 'reducedCateIds',

    fieldsValue: noop,
    changeDateRange: noop,
    chooseScopeType: noop,
    addCoupon: noop,
    editCoupon: noop,
    changeBtnDisabled: noop,
    dealErrorCode: noop
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      couponType,
      couponName,
      couponCates,
      couponCateIds,
      rangeDayType,
      startTime,
      endTime,
      effectiveDays,
      denomination,
      fullBuyType,
      fullBuyPrice,
      scopeType,
      couponDesc,
      btnDisabled,

      fieldsValue,
      changeDateRange,
      chooseScopeType
    } = this.props.relaxProps;

    return (
      <RightContent>
        <Form>
          <FormItem {...formItemSmall} label="优惠券名称" required={true}>
            {getFieldDecorator('couponName', {
              initialValue: couponName,
              rules: [
                {
                  validator: (rule, value, callback) => {
                    QMMethod.validatorTrimMinAndMax(
                      rule,
                      value,
                      callback,
                      '优惠券名称',
                      1,
                      10
                    );
                  }
                }
              ]
            })(
              <Input
                placeholder="优惠券名称不超过10个字"
                maxLength={'10' as any}
                onChange={(e) => {
                  fieldsValue({
                    field: 'couponName',
                    value: e.currentTarget.value
                  });
                }}
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="优惠券分类">
            <Col span={16}>
              {getFieldDecorator('couponCateIds', {
                initialValue: couponCateIds.toJS(),
                rules: [
                  {
                    validator: (_rule, value, callback) => {
                      if (value && value.length > 3) {
                        callback('最多可选三个分类');
                        return;
                      }
                      callback();
                    }
                  }
                ]
              })(
                <Select
                  mode="multiple"
                  placeholder="请选择优惠券分类"
                  onChange={this.chooseCouponCateIds}
                >
                  {couponCates.map((cate) => {
                    return (
                      <Option key={cate.get('couponCateId')}>
                        {cate.get('couponCateName')}
                      </Option>
                    );
                  })}
                </Select>
              )}
            </Col>
            <Col span={8}>
              <span style={styles.greyColor}>&nbsp;&nbsp;最多可选三个分类</span>
            </Col>
          </FormItem>
          <FormItem {...formItemLayout} label="起止时间" required={true}>
            <RadioGroup
              value={rangeDayType}
              onChange={(e) => {
                this.changeRangeDayType((e as any).target.value);
              }}
            >
              <FormItem>
                <Radio value={0} style={styles.radioStyle}>
                  {getFieldDecorator('rangeDay', {
                    initialValue: startTime &&
                      endTime && [moment(startTime), moment(endTime)],
                    rules: [
                      {
                        required: rangeDayType === 0,
                        message: '请输入起止时间'
                      }
                    ]
                  })(
                    <RangePicker
                      disabledDate={this.disabledDate}
                      disabled={rangeDayType === 1}
                      getCalendarContainer={() =>
                        document.getElementById('page-content')
                      }
                      format={Const.DAY_FORMAT}
                      placeholder={['起始时间', '结束时间']}
                      onChange={(e) => {
                        if (e.length > 0) {
                          changeDateRange({
                            startTime: e[0].format(Const.DAY_FORMAT),
                            endTime: e[1].format(Const.DAY_FORMAT)
                          });
                        }
                      }}
                    />
                  )}
                  <span style={styles.greyColor}>
                    &nbsp;&nbsp;开始前可以领取但不能使用
                  </span>
                </Radio>
              </FormItem>
              <FormItem>
                <Radio value={1} style={styles.lastRadioStyle}>
                  <span style={styles.darkColor}>领取当天开始&nbsp;&nbsp;</span>
                  {getFieldDecorator('effectiveDays', {
                    initialValue: effectiveDays,
                    rules: [
                      { required: rangeDayType === 1, message: '请输入天数' },
                      {
                        validator: (_rule, value, callback) => {
                          if (
                            rangeDayType == 1 &&
                            (!ValidConst.noZeroNumber.test(value) ||
                              value < 1 ||
                              value > 365)
                          ) {
                            callback('只允许输入1-365之间的整数');
                            return;
                          }
                          callback();
                        }
                      }
                    ]
                  })(
                    <Input
                      style={{ width: 'auto' }}
                      disabled={rangeDayType === 0}
                      placeholder="1-365间的整数"
                      maxLength={'3' as any}
                      onChange={(e) => {
                        fieldsValue({
                          field: 'effectiveDays',
                          value: e.currentTarget.value
                        });
                      }}
                    />
                  )}
                  <span style={styles.darkColor}>
                    &nbsp;&nbsp;天内有效，填写1则领取当天24:00失效
                  </span>
                </Radio>
              </FormItem>
            </RadioGroup>
          </FormItem>
          <ErrorDiv>
            <FormItem {...formItemSmall} label="优惠券面值" required={true}>
              <Row>
                <Col span={12}>
                  {getFieldDecorator('denomination', {
                    initialValue: denomination,
                    rules: [
                      { required: true, message: '请输入优惠券面值' },
                      {
                        validator: (_rule, value, callback) => {
                          if (
                            !ValidConst.noZeroNumber.test(value) ||
                            (value < 1 || value > 99999)
                          ) {
                            callback('只允许输入1-99999间的整数');
                            return;
                          }
                          callback();
                        }
                      }
                    ]
                  })(
                    <Input
                      placeholder="1-99999间的整数"
                      maxLength={'5' as any}
                      onChange={async (e) => {
                        await fieldsValue({
                          field: 'denomination',
                          value: e.currentTarget.value
                        });
                        this.props.form.validateFields(['fullBuyPrice'], {
                          force: true
                        });
                      }}
                    />
                  )}
                </Col>
                <Col span={5}>
                  <span style={styles.darkColor}>&nbsp;&nbsp;元</span>
                </Col>
              </Row>
            </FormItem>

            <FormItem {...formItemLayout} label="使用门槛" required={true}>
              <RadioGroup
                value={fullBuyType}
                onChange={(e) =>
                  this.changeFullBuyType((e as any).target.value)
                }
              >
                <FormItem>
                  <Radio value={1} style={styles.radioStyle}>
                    <span style={styles.darkColor}>
                      {couponType == 2 && '单次提交订单'}满 &nbsp;&nbsp;
                    </span>
                    {getFieldDecorator('fullBuyPrice', {
                      initialValue: fullBuyPrice,
                      rules: [
                        {
                          required: fullBuyType === 1,
                          message: '请输入使用门槛'
                        },
                        {
                          validator: (_rule, value, callback) => {
                            if (fullBuyType == 1 && (value || value === 0)) {
                              if (
                                !ValidConst.noZeroNumber.test(value) ||
                                (value < 1 || value > 99999)
                              ) {
                                callback('只允许输入1-99999间的整数');
                                return;
                              } else if (value <= parseInt(`${denomination}`)) {
                                callback('使用门槛必须大于优惠券面值');
                                return;
                              }
                            }
                            callback();
                          }
                        }
                      ]
                    })(
                      <Input
                        style={{ maxWidth: 170 }}
                        disabled={fullBuyType === 0}
                        placeholder="1-99999间的整数"
                        maxLength={'5' as any}
                        onChange={(e) => {
                          fieldsValue({
                            field: 'fullBuyPrice',
                            value: e.currentTarget.value
                          });
                        }}
                      />
                    )}
                    <span style={styles.darkColor}>&nbsp;&nbsp;元可使用</span>
                  </Radio>
                </FormItem>
                <FormItem>
                  <Radio
                    value={0}
                    style={{...styles.lastRadioStyle, width: 80 }}
                  >
                    <span style={styles.darkColor}>无门槛</span>
                  </Radio>
                </FormItem>
              </RadioGroup>
            </FormItem>
          </ErrorDiv>
          {couponType == 0 && (
            <FormItem {...formItemLayout} label="选择商品" required={true}>
              <RadioGroup
                value={scopeType}
                onChange={(e) => chooseScopeType((e as any).target.value)}
              >
                <Radio value={0}>
                  <span style={styles.darkColor}>全部商品</span>
                </Radio>
                <Radio value={1}>
                  <span style={styles.darkColor}>按品牌</span>
                </Radio>
                <Radio value={2}>
                  <span style={styles.darkColor}>按类目</span>
                </Radio>
              </RadioGroup>
            </FormItem>
          )}
          {couponType == 0 && (
            <FormItem {...formItemSmall} label="已选商品" id={'page-content'}>
              {this.chooseGoods().dom}
            </FormItem>
          )}
          <FormItem {...formItemLayout} label="使用说明">
            {getFieldDecorator('couponDesc', {
              initialValue: couponDesc,
              rules: [{ max: 500, message: '使用说明最多500个字符' }]
            })(
              <TextArea
                maxLength={'500' as any}
                placeholder={'0-500字'}
                onChange={(e) => {
                  fieldsValue({
                    field: 'couponDesc',
                    value: e.target.value
                  });
                }}
              />
            )}
          </FormItem>
        </Form>
        <div className="bar-button">
          <Button
            disabled={btnDisabled}
            type="primary"
            onClick={() => this.saveCoupon()}
            style={{ marginRight: 10 }}
          >
            保存
          </Button>
          <Button onClick={() => history.goBack()} style={{ marginLeft: 10 }}>
            取消
          </Button>
        </div>
      </RightContent>
    );
  }

  /**
   * 优惠券分类选择
   */
  chooseCouponCateIds = (value) => {
    this.props.relaxProps.fieldsValue({ field: 'couponCateIds', value });
  };

  /**
   * 禁用昨天及昨天之前的日期
   */
  disabledDate = (current) => {
    return current && current.endOf('day') < moment().endOf('day');
  };

  /**
   * 品牌选择结构
   */
  _getBrandSelect = () => {
    const { brands, fieldsValue } = this.props.relaxProps;
    return (
      <Select
        showSearch
        getPopupContainer={() => document.getElementById('page-content')}
        placeholder="请选择品牌"
        notFoundContent="暂无品牌"
        mode="multiple"
        optionFilterProp="children"
        filterOption={(input, option: any) => {
          return typeof option.props.children == 'string'
            ? option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            : true;
        }}
        onChange={(value) => {
          fieldsValue({ field: 'chooseBrandIds', value });
        }}
      >
        {brands.map((item) => {
          return (
            <Option key={item.get('brandId')} value={`${item.get('brandId')}`}>
              {item.get('brandName')}
            </Option>
          );
        })}
      </Select>
    );
  };

  //处理分类的树形图结构数据
  loop = (cateList) =>
    cateList.map((item) => {
      if (item.get('goodsCateList') && item.get('goodsCateList').count()) {
        // 一二级类目不允许选择
        return (
          <TreeNode
            key={item.get('cateId')}
            value={`${item.get('cateId')}`}
            title={item.get('cateName')}
          >
            {this.loop(item.get('goodsCateList'))}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          key={item.get('cateId')}
          value={`${item.get('cateId')}`}
          title={item.get('cateName')}
        />
      );
    });

  /**
   * 已选商品结构
   */
  chooseGoods = () => {
    const {
      scopeType,
      chooseBrandIds,
      chooseCateIds,
      cates
    } = this.props.relaxProps;
    const { getFieldDecorator } = this.props.form;
    if (scopeType === 0) {
      return { dom: '全部商品' };
    } else if (scopeType === 1) {
      return {
        dom: getFieldDecorator('chooseBrandIds', {
          initialValue: chooseBrandIds.toJS(),
          rules: [{ required: true, message: '请选择品牌' }]
        })(this._getBrandSelect())
      };
    } else if (scopeType === 2) {
      return {
        dom: getFieldDecorator('chooseCateIds', {
          initialValue: chooseCateIds.toJS(),
          rules: [{ required: true, message: '请选择类目' }]
        })(
          <TreeSelect
            treeCheckable={true}
            getPopupContainer={() => document.getElementById('page-content')}
            placeholder="请选择平台商品类目"
            notFoundContent="暂无平台商品类目"
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            showCheckedStrategy={(TreeSelect as any).SHOW_PARENT}
            onChange={(value) => {
              this.chooseCate(value);
            }}
          >
            {this.loop(cates)}
          </TreeSelect>
        )
      };
    }
  };

  /**
   * 保存优惠券
   */
  saveCoupon = () => {
    const {
      addCoupon,
      editCoupon,
      couponId,
      changeBtnDisabled,
      startTime,
      rangeDayType,
      dealErrorCode
    } = this.props.relaxProps;
    changeBtnDisabled();
    if (!couponId) {
      //强制校验创建时间
      if (
        rangeDayType == 0 &&
        moment(new Date())
          .hour(0)
          .minute(0)
          .second(0)
          .unix() > moment(startTime).unix()
      ) {
        this.props.form.setFields({
          rangeDay: {
            errors: [new Error('开始时间不能小于当前时间')]
          }
        });
        changeBtnDisabled();
        return;
      }
    }
    this.props.form.validateFields(null, async (errs) => {
      //如果校验通过
      if (!errs) {
        const res = await (couponId ? editCoupon() : addCoupon());
        //成功时候没有返回
        if (!res) {
          return;
        }
        if (res.code == 'K-080103') {
          const ids = await dealErrorCode(res);
          this.props.form.setFieldsValue({
            couponCateIds: ids.toJS()
          });
        } else {
          message.error(res.message);
        }
      } else {
        changeBtnDisabled();
      }
    });
  };

  /**
   * 修改区间天数类型
   */
  changeRangeDayType = (value) => {
    const { fieldsValue } = this.props.relaxProps;
    const { resetFields, setFieldsValue } = this.props.form;
    if (value === 0 || value === 1) {
      resetFields(['effectiveDays', 'rangeDay']);
    }
    if (value == 0) {
      setFieldsValue({ effectiveDays: '' });
    } else if (value == 1) {
      setFieldsValue({ rangeDay: [0, 0] });
    }
    fieldsValue({ field: 'rangeDayType', value });
  };

  /**
   * 修改使用门槛类型
   */
  changeFullBuyType = (value) => {
    const { fieldsValue } = this.props.relaxProps;
    const { resetFields, setFieldsValue } = this.props.form;
    resetFields('fullBuyPrice');
    if (value == 0) {
      setFieldsValue({ fullBuyPrice: null });
    }
    fieldsValue({
      field: 'fullBuyType',
      value
    });
  };

  chooseCate = (value) => {
    const { fieldsValue, reducedCateIds } = this.props.relaxProps;
    let ids = fromJS([]);
    fromJS(value).forEach((v) => {
      const cate = reducedCateIds.find((c) => c.get('cateId') == v);
      if (cate) {
        ids = ids.concat(cate.get('cateIds'));
      } else {
        ids = ids.push(v);
      }
    });
    fieldsValue({ field: 'chooseCateIds', value: ids });
  };
}

const styles = {
  greyColor: {
    fontSize: 12,
    color: '#999'
  },
  darkColor: {
    fontSize: 12,
    color: '#333'
  },
  radioStyle: {
    display: 'block',
    lineHeight: '39px'
  },
  lastRadioStyle: {
    display: 'block',
    lineHeight: '32px'
  }
} as any;
