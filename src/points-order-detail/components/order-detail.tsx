import React from 'react';
import { Relax, IMap } from 'plume2';
import { Table, Row, Col } from 'antd';
import { noop, Const, ImageModal } from 'qmkit';
import { fromJS, Map, List } from 'immutable';
import moment from 'moment';

const columns = [
  {
    title: 'SKU编码',
    dataIndex: 'skuNo',
    key: 'skuNo',
    render: (text) => text
  },
  {
    title: '商品名称',
    dataIndex: 'skuName',
    key: 'skuName'
  },
  {
    title: '规格',
    dataIndex: 'specDetails',
    key: 'specDetails'
  },
  {
    title: '单价',
    dataIndex: 'points',
    key: 'points',
    render: (points) => <span>{points}</span>
  },
  {
    title: '数量',
    dataIndex: 'num',
    key: 'num'
  },
  {
    title: '金额小计',
    render: (row) => <span>{row.num * row.points}</span>
  }
];

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

/**
 * 订单详情
 */
@Relax
export default class OrderDetailTab extends React.Component<any, any> {
  props: {
    relaxProps?: {
      detail: IMap;
      onAudit: Function;
      confirm: Function;
      retrial: Function;
      sellerRemarkVisible: boolean;
      setSellerRemarkVisible: Function;
      remedySellerRemark: Function;
      setSellerRemark: Function;
      verify: Function;
      onDelivery: Function;
    };
  };

  static relaxProps = {
    detail: 'detail',
    onAudit: noop,
    confirm: noop,
    retrial: noop,
    sellerRemarkVisible: 'sellerRemarkVisible',
    setSellerRemarkVisible: noop,
    remedySellerRemark: noop,
    setSellerRemark: noop,
    verify: noop,
    onDelivery: noop
  };
  render() {
    const { detail } = this.props.relaxProps;
    //当前的订单号
    const tradeItems = detail.get('tradeItems').toJS();
    const tradePrice = detail.get('tradePrice').toJS() as {
      special: boolean; //是否特价
      originPrice: number; //原始总额
      couponPrice: number; // 优惠券
      pointsPrice: number;
      deliveryPrice: number; //配送费用
      goodsPrice: number; //商品总金额
      totalPrice: number; //订单应付金额（不含手续费）
      totalPayCash: number; //订单实际支付金额
      privilegePrice: number; //特价金额
      discountsPriceDetails: List<any>; //订单优惠金额明细
      points: number; //订单积分
    };

    //收货人信息
    const consignee = detail.get('consignee').toJS() as {
      detailAddress: string;
      name: string;
      phone: string;
    };

    //附件信息
    const encloses = detail.get('encloses')
      ? detail.get('encloses').split(',')
      : [];
    const enclo = fromJS(
      encloses.map((url, index) =>
        Map({ uid: index, name: index, size: 1, status: 'done', url: url })
      )
    );

    const isSelf = detail.getIn(['supplier', 'isSelf']);

    return (
      <div>
        <div style={styles.headBox as any}>
          <h4 style={styles.greenText}>
            {flowState(detail.getIn(['tradeState', 'flowState']))}
          </h4>
          <Row>
            <Col span={8}>
              <p style={styles.darkText}>订单号：{detail.get('id')} </p>
              <p style={styles.darkText}>
                下单时间：
                {moment(detail.getIn(['tradeState', 'createTime'])).format(
                  Const.TIME_FORMAT
                )}
              </p>
            </Col>
            <Col span={8}>
              <p style={styles.darkText}>
                商家：{detail.getIn(['supplier', 'supplierName'])}
              </p>
              <p style={styles.darkText}>
                商家编号：{detail.getIn(['supplier', 'supplierCode'])}
              </p>
            </Col>
            <Col span={8}>
              <p style={styles.darkText}>
                客户：{detail.getIn(['buyer', 'name']) + '  '}
              </p>
              <p style={styles.darkText}>
                客户账号：{this._parsePhone(detail.getIn(['buyer', 'account']))}
              </p>
              {detail.getIn(['buyer', 'customerFlag']) && (
                <p style={styles.darkText}>
                  {(isSelf ? '平台等级：  ' : '客户等级：  ') +
                    detail.getIn(['buyer', 'levelName'])}
                </p>
              )}
            </Col>
          </Row>
        </div>
        <div
          style={{ display: 'flex', marginTop: 20, flexDirection: 'column' }}
        >
          <Table
            columns={columns}
            dataSource={tradeItems}
            pagination={false}
            bordered
          />
          <div style={styles.detailBox as any}>
            <div style={styles.inputBox as any} />
            <div style={styles.priceBox}>
              <label style={styles.priceItem as any}>
                <span style={styles.name}>订单积分:</span>
                <strong>{tradePrice.points || 0}</strong>
              </label>
            </div>
          </div>
        </div>
        <div
          style={{ display: 'flex', flexDirection: 'column', marginBottom: 10 }}
        >
          <label style={styles.inforItem}>
            卖家备注: {detail.get('sellerRemark') || '无'}
          </label>
          <label style={styles.inforItem}>
            买家备注: {detail.get('buyerRemark') || '无'}
          </label>
          <label style={styles.inforItem}>
            订单附件: {this._renderEncloses(enclo)}
          </label>
          <label style={styles.inforItem}>
            支付方式: {detail.getIn(['payInfo', 'desc']) || '暂无信息'}
          </label>
          <label style={styles.inforItem}>配送方式: 快递配送</label>
          <label style={styles.inforItem}>
            收货信息：{consignee.name} {consignee.phone}{' '}
            {consignee.detailAddress}
          </label>
        </div>
      </div>
    );
  }

  //附件
  _renderEncloses(encloses) {
    if (encloses.size == 0 || encloses[0] === '') {
      return <span>无</span>;
    }
    return (
      <ImageModal
        imgList={encloses.map((v) => v.get('url')).toJS()}
        imgStyle={styles.attachment}
      />
    );
  }

  /**
   * 解析phone
   * @param phone
   */
  _parsePhone(phone: string) {
    if (phone && phone.length == 11) {
      return `${phone.substring(0, 4)}****` + `${phone.substring(7, 11)}`;
    } else {
      return phone;
    }
  }
}

const styles = {
  headBox: {
    padding: 15,
    backgroundColor: '#f5f5f5'
  },
  greenText: {
    color: '#339966',
    display: 'block',
    marginBottom: 5
  },
  greyText: {
    marginLeft: 20
  },
  pr20: {
    paddingRight: 20
  },
  detailBox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    border: '1px solid #e9e9e9',
    borderTop: 0,
    marginTop: -4,
    borderRadius: 4
  },
  priceBox: {
    display: 'flex',
    flexDirection: 'column'
  },
  name: {
    width: 120,
    textAlign: 'right',
    display: 'inline-block'
  },
  priceItem: {
    width: 200,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10
  },
  inputBox: {
    display: 'flex',
    flexDirection: 'column',
    height: 70,
    justifyContent: 'space-between'
  },
  inforItem: {
    paddingTop: 10,
    marginLeft: 20
  } as any,

  imgItem: {
    width: 40,
    height: 40,
    border: '1px solid #ddd',
    display: 'inline-block',
    marginRight: 10,
    background: '#fff'
  },
  attachment: {
    maxWidth: 40,
    maxHeight: 40,
    marginRight: 5
  },
  attachmentView: {
    maxWidth: 400,
    maxHeight: 400
  },
  darkText: {
    color: '#333333',
    lineHeight: '24px'
  },
  platform: {
    fontSize: 12,
    color: '#fff',
    padding: '1px 3px',
    background: '#F56C1D',
    display: 'inline-block',
    marginLeft: 5
  }
} as any;
