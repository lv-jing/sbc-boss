import React from 'react';
import { Relax } from 'plume2';
import { Table } from 'antd';
import { IList, IMap } from 'typings/globalType';
import { Const, noop, Logistics } from 'qmkit';
import Moment from 'moment';

/**
 * 订单发货记录
 */
@Relax
export default class OrderDelivery extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      logistics: []
    };
  }

  props: {
    relaxProps?: {
      detail: IMap;
      deliver: Function;
      confirm: Function;
      changeDeliverNum: Function;
      showDeliveryModal: Function;
      modalVisible: boolean;
      formData: IMap;
      hideDeliveryModal: Function;
      saveDelivery: Function;
      obsoleteDeliver: Function;
    };
  };

  static relaxProps = {
    detail: 'detail',
    deliver: noop,
    confirm: noop,
    changeDeliverNum: noop,
    showDeliveryModal: noop,
    modalVisible: 'modalVisible',
    formData: 'formData',
    hideDeliveryModal: noop,
    saveDelivery: noop,
    obsoleteDeliver: noop
  };

  render() {
    const { detail } = this.props.relaxProps;
    const tradeDelivers = detail.get('tradeDelivers') as IList;
    return (
      <div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Table
            columns={this._deliveryColumns()}
            dataSource={detail.get('tradeItems').toJS()}
            pagination={false}
            bordered
          />
        </div>
        {tradeDelivers.count() > 0
          ? tradeDelivers.map((v, i) => {
              const logistic = v.get('logistics');
              const deliverTime = v.get('deliverTime')
                ? Moment(v.get('deliverTime')).format(Const.DAY_FORMAT)
                : null;
              return (
                <div
                  key={i}
                  style={{ display: 'flex', flexDirection: 'column' }}
                >
                  <div className="detailTitle" style={styles.title}>
                    发货记录
                  </div>
                  <Table
                    columns={this._deliveryRecordColumns()}
                    dataSource={v.get('shippingItems').toJS()}
                    pagination={false}
                    bordered
                  />

                  <div style={styles.expressBox as any}>
                    <div style={styles.stateBox}>
                      {logistic ? (
                        <label style={styles.information}>
                          【物流信息】发货日期：{deliverTime}
                          物流公司：{logistic.get('logisticCompanyName')}{' '}
                          物流单号：{logistic.get('logisticNo')}
                          <Logistics
                            companyInfo={logistic}
                            deliveryTime={deliverTime}
                          />
                        </label>
                      ) : (
                        '无'
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          : null}

        <div style={styles.expressBox as any}>
          <div style={styles.stateBox} />
        </div>
      </div>
    );
  }

  _deliveryColumns = () => {
    return [
      {
        title: '序号',
        render: (_text, _row, index) => index + 1
      },
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
        title: '数量',
        dataIndex: 'num',
        key: 'num'
      },
      {
        title: '已发货数',
        dataIndex: 'deliveredNum',
        key: 'deliveredNum',
        render: (deliveredNum) => (deliveredNum ? deliveredNum : 0)
      }
    ];
  };

  _deliveryRecordColumns = () => {
    return [
      {
        title: '序号',
        render: (_text, _row, index) => index + 1
      },
      {
        title: 'SKU编码',
        dataIndex: 'skuNo',
        key: 'skuNo'
      },
      {
        title: '商品名称',
        dataIndex: 'itemName',
        key: 'itemName'
      },
      {
        title: '规格',
        dataIndex: 'specDetails',
        key: 'specDetails'
      },
      {
        title: '本次发货数',
        dataIndex: 'itemNum',
        key: 'itemNum'
      }
    ];
  };
}

const styles = {
  buttonBox: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: 10
  },
  title: {
    marginTop: 10,
    marginBottom: 10
  },
  expressBox: {
    paddingTop: 10,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },
  expressOp: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  stateBox: {
    display: 'flex',
    flexDirection: 'column'
  },
  information: {
    marginBottom: 10
  } as any
} as any;
