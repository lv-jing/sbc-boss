import * as React from 'react';
import { Relax } from 'plume2';
import { List } from 'immutable';
import { withRouter } from 'react-router';
import { DataGrid, noop, AuthWrapper, Const } from 'qmkit';
import { Table } from 'antd';

const defaultImg = require('../img/none.png');
import Moment from 'moment';
import { FormattedMessage } from 'react-intl';

declare type IList = List<any>;
const Column = Table.Column;

const isShowFunction = (status) => {
  if (status == '0') {
    return 'No';
  } else if (status == '1') {
    return 'Yes';
  } else {
    return '-';
  }
};

@withRouter
@Relax
export default class CustomerList extends React.Component<any, any> {
  props: {
    history?: any;
    relaxProps?: {
      loading: boolean;
      dataList: IList;
      total: number;
      pageSize: number;
      currentPage: number;
      init: Function;
      modal: Function;
      goodsEvaluateDetail: Function;
    };
  };

  static relaxProps = {
    loading: 'loading',
    total: 'total',
    pageSize: 'pageSize',
    currentPage: 'currentPage',
    dataList: 'dataList',
    init: noop,
    modal: noop,
    goodsEvaluateDetail: noop
  };

  render() {
    const {
      loading,
      dataList,
      pageSize,
      total,
      currentPage,
      init,
      goodsEvaluateDetail
    } = this.props.relaxProps;
    return (
      <DataGrid
        loading={loading}
        rowKey="evaluateId"
        pagination={{
          current: currentPage,
          pageSize,
          total,
          onChange: (pageNum, pageSize) => {
            init({ pageNum: pageNum - 1, pageSize });
          }
        }}
        dataSource={dataList.toJS()}
      >
        <Column
          title={<FormattedMessage id="Product.goodsInfoName" />}
          key="goodsInfoName"
          dataIndex="goodsInfoName"
          render={(goodsInfoName, rowData: any) => {
            return (
              <div style={styles.goodsName}>
                {/*/!*商品图片*!/*/}
                {rowData.goodsImg ? (
                  <img
                    src={rowData.goodsImg ? rowData.goodsImg : defaultImg}
                    style={styles.imgItem}
                    alt=""
                  />
                ) : (
                  <img src={defaultImg} style={styles.imgItem} alt=""/>
                )}
                <div>{goodsInfoName ? goodsInfoName : '-'}</div>
              </div>
            );
          }}
        />
        <Column
          title={<FormattedMessage id="Product.orderNo" />}
          key="orderNo"
          dataIndex="orderNo"
          render={(orderNo) => (orderNo ? orderNo : '-')}
        />
        <Column
          title={<FormattedMessage id="Product.customerName" />}
          key="customerName,"
          dataIndex="customerName"
          render={(customerName, rowData) => {
            return (
              <div>
                {customerName}
                <br />
                {rowData['customerAccount']}
              </div>
            );
          }}
        />
        <Column
          title={<FormattedMessage id="Product.evaluateScore" />}
          key="evaluateScore"
          dataIndex="evaluateScore"
          render={(evaluateScore) =>
            evaluateScore ? evaluateScore + '星' : '-'
          }
        />
        <Column
          title={<FormattedMessage id="Product.evaluateContent" />}
          key="evaluateContent"
          dataIndex="evaluateContent"
          render={(evaluateContent) => {
            if (evaluateContent) {
              if (evaluateContent.length > 20) {
                return evaluateContent.substring(0, 20) + '...';
              }
              return evaluateContent;
            }
            return '-';
          }}
        />
        <Column
          title={<FormattedMessage id="Product.dryingSheet" />}
          key="evaluateImageList"
          dataIndex="evaluateImageList"
          render={(evaluateImageList) => {
            let countFlag = false;
            return (
              <div style={styles.goodsImg}>
                {/*/!*商品图片*!/*/}
                {evaluateImageList
                  ? evaluateImageList.map(
                    (v, k) =>
                      k < 3 ? (
                        <img
                          alt=""
                          src={v.artworkUrl ? v.artworkUrl : defaultImg}
                          key={k}
                          style={styles.imgItem}
                        />
                      ) : (
                        (countFlag = true)
                      )
                  )
                  : '-'}

                <div>{countFlag && '...'}</div>
              </div>
            );
          }}
        />
        <Column
          title={<FormattedMessage id="Product.isShow" />}
          key="isShow"
          dataIndex="isShow"
          render={(isShow) => (isShow ? isShowFunction(isShow) : '否')}
        />
        <Column
          title={<FormattedMessage id="Product.storeName" />}
          key="storeName"
          dataIndex="storeName"
          render={(storeName) => (storeName ? storeName : '-')}
        />
        <Column
          title={<FormattedMessage id="Product.publicationTime" />}
          key="evaluateTime"
          dataIndex="evaluateTime"
          render={(evaluateTime) =>
            evaluateTime
              ? Moment(evaluateTime)
                .format(Const.TIME_FORMAT)
                .toString()
              : ''
          }
        />

        {/* <DataGrid
          title={<FormattedMessage id="Product.Operation" />}
          key="evaluateId"
          dataIndex="evaluateId"
          render={(evaluateId) => {
            return (
              <div>
                <AuthWrapper functionName={'f_coupon_detail'}>
                  <span
                    style={styles.see}
                    onClick={() => goodsEvaluateDetail(evaluateId, true)}
                  >
                    {<FormattedMessage id="Product.check" />}
                  </span>
                </AuthWrapper>
              </div>
            );
          }}
        /> */}
      </DataGrid>
    );
  }

  /**
   * 查看
   */
  _showCateModal = () => {
    const { modal } = this.props.relaxProps;
    modal(true);
  };
}

const styles = {
  imgItem: {
    width: 60,
    height: 60,
    padding: 5,
    border: '1px solid #ddd',
    float: 'left',
    marginRight: 10,
    background: '#fff'
  },
  goodsName: {
    display: 'flex',
    justifyContent: 'left',
    alignItems: 'center'
  },
  goodsImg: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  see: {
    color: '#F56C1D',
    cursor: 'pointer'
  }
} as any;
