import React from 'react';
import { Relax } from 'plume2';
import { Link } from 'react-router-dom';
import { Checkbox, Spin, Pagination } from 'antd';
import { List, fromJS } from 'immutable';
import { noop, Const, AuthWrapper } from 'qmkit';
import Moment from 'moment';
import { allCheckedQL } from '../ql';

const defaultImg = require('../../goods-list/img/none.png');

const deliverStatus = (status) => {
  if (status == 'NOT_YET_SHIPPED') {
    return '未发货';
  } else if (status == 'SHIPPED') {
    return '全部发货';
  } else if (status == 'PART_SHIPPED') {
    return '部分发货';
  } else if (status == 'VOID') {
    return '作废';
  } else {
    return '未知';
  }
};

const payStatus = (status) => {
  if (status == 'NOT_PAID') {
    return '未付款';
  } else if (status == 'UNCONFIRMED') {
    return '待确认';
  } else if (status == 'PAID') {
    return '已付款';
  } else {
    return '未知';
  }
};

const flowState = (status) => {
  if (status == 'INIT') {
    return '待审核';
  } else if (status == 'AUDIT' || status == 'DELIVERED_PART') {
    return '待发货';
  } else if (status == 'DELIVERED') {
    return '待收货';
  } else if (status == 'CONFIRMED') {
    return '已收货';
  } else if (status == 'COMPLETED') {
    return '已完成';
  } else if (status == 'VOID') {
    return '已作废';
  }
};

const COUPON_TYPE = {
  0: '通用券',
  1: '店铺券',
  2: '运费券'
};

type TList = List<any>;

@Relax
export default class ListView extends React.Component<any, any> {
  props: {
    histroy?: Object;
    relaxProps?: {
      loading: boolean;
      total: number;
      pageSize: number;
      currentPage: number;
      dataList: TList;

      onChecked: Function;
      onCheckedAll: Function;
      allChecked: boolean;
      onAudit: Function;
      init: Function;
      onRetrial: Function;
      onConfirm: Function;
      onCheckReturn: Function;
      verify: Function;
    };
  };

  static relaxProps = {
    loading: 'loading',
    //当前的数据总数
    total: 'total',
    //当前的分页条数
    pageSize: 'pageSize',

    currentPage: 'currentPage',
    //当前的客户列表
    dataList: 'dataList',

    onChecked: noop,
    onCheckedAll: noop,
    allChecked: allCheckedQL,
    onAudit: noop,
    init: noop,
    onRetrial: noop,
    onConfirm: noop,
    onCheckReturn: noop,
    verify: noop
  };

  render() {
    const {
      loading,
      total,
      pageSize,
      dataList,
      onCheckedAll,
      allChecked,
      init,
      currentPage
    } = this.props.relaxProps;

    return (
      <div>
        <div className="ant-table-wrapper">
          <div className="ant-table ant-table-large ant-table-scroll-position-left">
            <div className="ant-table-content">
              <div className="ant-table-body">
                <table
                  style={{ borderCollapse: 'separate', borderSpacing: '0 1em' }}
                >
                  <thead className="ant-table-thead">
                    <tr>
                      <th style={{ width: '5%' }}>
                        <Checkbox
                          checked={allChecked}
                          onChange={(e) => {
                            const checked = (e.target as any).checked;
                            onCheckedAll(checked);
                          }}
                        />
                      </th>
                      <th>商品</th>
                      <th style={{ width: '10%' }}>客户名称</th>
                      <th style={{ width: '10%' }}>商家</th>
                      <th style={{ width: '15%' }}>收件人</th>
                      <th style={{ width: '10%' }}>
                        积分
                        <br />
                        数量
                      </th>
                      <th style={{ width: '10%' }}>发货状态</th>
                      <th style={{ width: '10%' }}>订单状态</th>
                      <th style={{ width: '10%' }}>付款状态</th>
                    </tr>
                  </thead>
                  <tbody className="ant-table-tbody">
                    {loading
                      ? this._renderLoading()
                      : this._renderContent(dataList)}
                  </tbody>
                </table>
              </div>
              {!loading && total == 0 ? (
                <div className="ant-table-placeholder">
                  <span>
                    <i className="anticon anticon-frown-o" />
                    暂无数据
                  </span>
                </div>
              ) : null}
            </div>
          </div>
          {total > 0 ? (
            <Pagination
              current={currentPage}
              total={total}
              pageSize={pageSize}
              onChange={(pageNum, pageSize) => {
                init({ pageNum: pageNum - 1, pageSize });
              }}
            />
          ) : null}
        </div>
      </div>
    );
  }

  _renderLoading() {
    return (
      <tr style={styles.loading}>
        <td colSpan={9}>
          <Spin />
        </td>
      </tr>
    );
  }

  _renderContent(dataList) {
    const { onChecked } = this.props.relaxProps;
    return (
      dataList &&
      dataList.map((v, index) => {
        const id = v.get('id');

        //商品+赠品
        const tradeItems = v.get('tradeItems');
        const gifts = v.get('gifts') ? v.get('gifts') : fromJS([]);
        const items = tradeItems.concat(gifts);

        //积分优惠券
        const tradeCouponItem = v.get('tradeCouponItem');

        return (
          <tr className="ant-table-row  ant-table-row-level-0" key={id}>
            <td colSpan={9} style={{ padding: 0 }}>
              <table
                className="ant-table-self"
                style={{ border: '1px solid #ddd' }}
              >
                <thead>
                  <tr>
                    <td colSpan={9} style={{ padding: 0, color: '#999' }}>
                      <div
                        style={{
                          marginTop: 12,
                          borderBottom: '1px solid #f5f5f5',
                          height: 36
                        }}
                      >
                        <span style={{ marginLeft: '1%' }}>
                          <Checkbox
                            checked={v.get('checked')}
                            onChange={(e) => {
                              const checked = (e.target as any).checked;
                              onChecked(index, checked);
                            }}
                          />
                        </span>
                        <span style={{ marginLeft: 20, color: '#000' }}>
                          {id}
                        </span>
                        <span
                          style={{ marginLeft: 60, color: 'rbga(0,0,0,.4)' }}
                        >
                          下单时间：
                          {v.getIn(['tradeState', 'createTime'])
                            ? Moment(v.getIn(['tradeState', 'createTime']))
                                .format(Const.TIME_FORMAT)
                                .toString()
                            : ''}
                        </span>
                        {v.get('pointsOrderType') != 'POINTS_COUPON' && (
                          <AuthWrapper functionName={'f_points_order_list_004'}>
                            <span style={{ marginRight: 0, float: 'right' }}>
                              <Link
                                style={{ marginLeft: 20, marginRight: 20 }}
                                to={`/points-order-detail/${id}`}
                              >
                                查看详情
                              </Link>
                            </span>
                          </AuthWrapper>
                        )}
                      </div>
                    </td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ width: '3%' }} />
                    {v.get('pointsOrderType') &&
                    v.get('pointsOrderType') == 'POINTS_COUPON'
                      ? this._renderPointsCouponOrder(v, tradeCouponItem)
                      : this._renderPointsGoodsOrder(v, items)}
                    {/*发货状态*/}
                    <td style={{ width: '10%' }}>
                      {deliverStatus(v.getIn(['tradeState', 'deliverStatus']))}
                    </td>
                    {/*订单状态*/}
                    <td style={{ width: '10%' }}>
                      {flowState(v.getIn(['tradeState', 'flowState']))}
                    </td>
                    {/*支付状态*/}
                    <td style={{ width: '10%' }}>
                      {payStatus(v.getIn(['tradeState', 'payState']))}
                      &nbsp;&nbsp;&nbsp;
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        );
      })
    );
  }

  _renderPointsCouponOrder = (v, tradeCouponItem) => {
    const couponInfo = tradeCouponItem.get('couponInfoVO');
    return [
      <td
        style={{
          textAlign: 'left',
          display: 'flex',
          alignItems: 'flex-end'
        }}
      >
        {/*优惠券信息*/}￥{couponInfo.get('denomination')}{' '}
        {this._buildFullBuyPrice(couponInfo)}
        <br />
        {COUPON_TYPE[couponInfo.get('couponType')]}
        <br />
        {this._buildStorename(couponInfo)}
        <br />
        券有效期：{this._buildRangDay(couponInfo)}
        <br />限{this._buildScope(couponInfo)}可用
      </td>,
      <td style={{ width: '10%' }}>
        {/*客户名称*/}
        {v.getIn(['buyer', 'name'])}
      </td>,
      <td style={{ width: '10%' }}>{/*商家*/}-</td>,
      <td style={{ width: '15%' }}>
        {/*收件人姓名*/}
        收件人：{v.getIn(['buyer', 'name']) || '-'}
        <br />
        {/*收件人手机号码*/}
        {v.getIn(['buyer', 'phone']) || '-'}
      </td>,
      <td style={{ width: '10%' }}>
        {v.getIn(['tradePrice', 'points']) || 0}
        <br />
        （1件)
      </td>
    ];
  };

  _renderPointsGoodsOrder = (v, items) => {
    return [
      <td
        style={{
          textAlign: 'left',
          display: 'flex',
          alignItems: 'flex-end'
        }}
      >
        {/*商品图片*/}
        {items.map((v, k) =>
          k < 3 ? (
            <img
              src={v.get('pic') ? v.get('pic') : defaultImg}
              style={styles.imgItem}
              key={k}
            />
          ) : null
        )}

        {/*第4张特殊处理*/
        //@ts-ignore
        items.size > 3 ? (
          <div style={styles.imgBg}>
            //@ts-ignore
            <img src={items.get(3).get('pic')} style={styles.imgFourth} />
            //@ts-ignore
            <div style={styles.imgNum}>共{items.size}件</div>
          </div>
        ) : null}
      </td>,
      <td style={{ width: '10%' }}>
        {/*客户名称*/}
        {v.getIn(['buyer', 'name'])}
      </td>,
      <td style={{ width: '10%' }}>
        {/*商家*/}
        {v.getIn(['supplier', 'supplierName']) || '-'}
        <br />
        {v.getIn(['supplier', 'supplierCode']) || '-'}
      </td>,
      <td style={{ width: '15%' }}>
        {/*收件人姓名*/}
        收件人：{v.getIn(['consignee', 'name']) || '-'}
        <br />
        {/*收件人手机号码*/}
        {v.getIn(['consignee', 'phone']) || '-'}
      </td>,
      <td style={{ width: '10%' }}>
        {v.getIn(['tradePrice', 'points']) || 0}
        <br />（
        {items
          .map((v) => v.get('num'))
          .reduce((a, b) => {
            a = a + b;
            return a;
          }, 0) || 0}
        件)
      </td>
    ];
  };

  /***
   * 满减金额
   */
  _buildFullBuyPrice = (coupon) => {
    return coupon.get('fullBuyType') === 0
      ? '无门槛'
      : `满${coupon.get('fullBuyPrice')}可用`;
  };

  /**
   * 优惠券使用店铺名称（暂时只有平台券）
   */
  _buildStorename = (coupon) => {
    let text = '';
    if (coupon.get('platformFlag') === 1) {
      text = '全平台可用';
    }
    return `${text}`;
  };

  /**
   * 优惠券使用范围
   */
  _buildScope = (coupon) => {
    let text = '';
    let scopeType = '';
    if (coupon.get('scopeType') == 0) {
      scopeType = '商品：';
      text = '全部商品';
    } else if (coupon.get('scopeType') == 1) {
      scopeType = '品牌：';
      text = '仅限';
      coupon.get('scopeNames').forEach((value) => {
        let name = value ? '[' + value + ']' : '';
        text = `${text}${name}`;
      });
    } else if (coupon.get('scopeType') == 2) {
      scopeType = '品类：';
      text = '仅限';
      coupon.get('scopeNames').forEach((value) => {
        let name = value ? '[' + value + ']' : '';
        text = `${text}${name}`;
      });
    } else if (coupon.get('scopeType') == 3) {
      scopeType = '分类：';
      text = '仅限';
      coupon.get('scopeNames').forEach((value) => {
        let name = value ? '[' + value + ']' : '';
        text = `${text}${name}`;
      });
    } else {
      scopeType = '商品：';
      text = '部分商品';
    }

    return `${scopeType}${text}`;
  };

  /***
   * 生效时间
   */
  _buildRangDay = (coupon) => {
    return coupon.get('rangeDayType') === 1
      ? `领取后${coupon.get('effectiveDays')}天内有效`
      : `${Moment(coupon.get('startTime')).format(Const.DATE_FORMAT)}至${Moment(
          coupon.get('endTime')
        ).format(Const.DATE_FORMAT)}`;
  };
}

const styles = {
  loading: {
    textAlign: 'center',
    height: 300
  },
  imgItem: {
    width: 60,
    height: 60,
    padding: 5,
    border: '1px solid #ddd',
    float: 'left',
    marginRight: 10,
    background: '#fff',
    borderRadius: 3
  },
  imgFourth: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 60,
    height: 60,
    borderRadius: 3
  },
  imgBg: {
    position: 'relative',
    width: 60,
    height: 60,
    padding: 5,
    border: '1px solid #ddd',
    float: 'left',
    marginRight: 10,
    borderRadius: 3
  },
  imgNum: {
    position: 'absolute',
    top: 0,
    left: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    background: 'rgba(0,0,0,0.6)',
    borderRadius: 3,
    fontSize: 9,
    color: '#fff'
  },
  platform: {
    fontSize: 12,
    color: '#fff',
    padding: '1px 3px',
    background: '#F56C1D',
    display: 'inline-block',
    marginLeft: 5
  }
};
