import React, { Component } from 'react';
import { Relax, IMap } from 'plume2';

import { Form, Table } from 'antd';
import { IList } from 'typings/globalType';
import { QMFloat } from 'qmkit';
import moment from 'moment';
import { Const } from 'qmkit';
import styled from 'styled-components';
const FormDiv = styled.div`
  h3 {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.65);
    font-weight: normal;
  }
  .bubbleBox {
    width: 50%;
    margin-bottom: -8px;
    span {
      border: 1px solid #ddd;
      border-radius: 3px;
      padding: 0 10px;
      display: inline-block;
      line-height: 28px;
      margin: 0 10px 8px 0;
    }
  }
`;
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    sm: { span: 5 },
    lg: { span: 4 },
    xl: { span: 3 },
    xxl: { span: 2 }
  },
  wrapperCol: {
    sm: { span: 18 },
    lg: { span: 19 },
    xl: { span: 20 },
    xxl: { span: 21 }
  }
};

const columns = [
  {
    title: 'SKU编码',
    dataIndex: 'goodsInfoNo',
    key: 'goodsInfoNo',
    width: '20%'
  },
  {
    title: '商品名称',
    dataIndex: 'goodsInfoName',
    key: 'goodsInfoName',
    width: '40%'
  },
  {
    title: '规格',
    dataIndex: 'specText',
    key: 'specText',
    width: '20%'
  },
  {
    title: '单价',
    key: 'priceType',
    dataIndex: 'salePrice',
    render: (text) => <span>{`￥${QMFloat.addZero(text)}`}</span>,
    width: '20%'
  }
];

@Relax
export default class CouponBasicInfo extends Component<any, any> {
  props: {
    relaxProps?: {
      // 优惠券分类
      couponCates: IList;
      // 优惠券信息
      coupon: IMap;
      // 商品品牌
      skuBrands: IList;
      // 商品分类
      skuCates: IList;
      // 商品
      skus: IList;
    };
  };

  static relaxProps = {
    couponCates: 'couponCates',
    coupon: 'coupon',
    skuBrands: 'skuBrands',
    skuCates: 'skuCates',
    skus: 'skus'
  };

  render() {
    const {
      couponCates,
      coupon,
      skuBrands,
      skuCates,
      skus
    } = this.props.relaxProps;
    const {
      couponName,
      rangeDayType,
      startTime,
      endTime,
      effectiveDays,
      denomination,
      fullBuyType,
      fullBuyPrice,
      platformFlag,
      scopeType,
      couponDesc,
      couponType
    } = coupon.toJS();
    return (
      <FormDiv>
        <Form>
          <FormItem {...formItemLayout} label="优惠券名称">
            {couponName}
          </FormItem>
          <FormItem {...formItemLayout} label="优惠券分类">
            <div className="bubbleBox">
              {couponCates.map((cate) => <span key={cate}>{cate}</span>)}
            </div>
          </FormItem>
          <FormItem {...formItemLayout} label="起止时间">
            {this._buildRangeDayType(
              rangeDayType,
              startTime,
              endTime,
              effectiveDays
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="优惠券面值">
            {denomination}元
          </FormItem>
          <FormItem {...formItemLayout} label="使用门槛">
            {this._buildFullBuyType(fullBuyType, fullBuyPrice, couponType)}
          </FormItem>
          {(couponType === 0 || couponType === 1) && (
            <FormItem {...formItemLayout} label="商品">
              {this._buildSkus(
                platformFlag,
                scopeType,
                skuBrands,
                skuCates,
                skus
              )}
            </FormItem>
          )}
          <FormItem {...formItemLayout} label="使用说明">
            <div
              style={{ wordBreak: 'break-all' }}
              dangerouslySetInnerHTML={{
                __html: couponDesc ? couponDesc.replace(/\n/g, '<br/>') : ''
              }}
            />
          </FormItem>
        </Form>
      </FormDiv>
    );
  }

  /**
   * 构建起止时间结构
   */
  _buildRangeDayType = (rangeDayType, startTime, endTime, effectiveDays) => {
    if (rangeDayType === 0) {
      return (
        moment(startTime)
          .format(Const.TIME_FORMAT)
          .toString() +
        ' ~ ' +
        moment(endTime)
          .format(Const.TIME_FORMAT)
          .toString()
      );
    } else if (rangeDayType === 1) {
      return `领取当天开始${effectiveDays}天内有效`;
    }
  };

  /**
   * 构建使用门槛结构
   */
  _buildFullBuyType = (fullBuyType, fullBuyPrice, couponType) => {
    if (fullBuyType === 0) {
      return '无门槛';
    } else if (fullBuyType === 1) {
      if (couponType === 2) {
        return `单次提交订单满${fullBuyPrice}元可使用`;
      } else if (couponType === 0 || couponType === 1) {
        return `满${fullBuyPrice}元可使用`;
      }
    }
  };

  /**
   * 构建商品结构
   */
  _buildSkus = (platformFlag, scopeType, skuBrands, skuCates, skus) => {
    if (scopeType === 0) {
      return '全部商品';
    } else if (scopeType === 1) {
      return (
        <div>
          <h3>按品牌</h3>
          <div className="bubbleBox">
            {skuBrands.size == 0
              ? '-'
              : skuBrands.map((brand, index) => (
                  <span key={index}>{brand}</span>
                ))}
          </div>
        </div>
      );
    } else if (scopeType === 2) {
      return (
        <div>
          <h3>按类目</h3>
          <div className="bubbleBox">
            {skuCates.size == 0
              ? '-'
              : skuCates.map((cate, index) => <span key={index}>{cate}</span>)}
          </div>
        </div>
      );
    } else if (platformFlag === 1 && scopeType === 4) {
      return (
        <div>
          <h3>自定义选择</h3>
          <Table
            pagination={false}
            rowKey={(record: any) => record.skuId}
            columns={columns}
            dataSource={skus.toJS()}
            bordered
            scroll={{ y: 216 }}
          />
        </div>
      );
    }
  };
}
