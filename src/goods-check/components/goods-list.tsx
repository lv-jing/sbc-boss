import * as React from 'react';
import { Relax } from 'plume2';
import { AuthWrapper, DataGrid, noop, Const } from 'qmkit';
import { List } from 'immutable';
import { Tooltip } from 'antd';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { IList } from 'typings/globalType';
const { Column } = DataGrid;

const defaultImg = require('../img/none.png');

import styled from 'styled-components';

const TableReset = styled.div`
  @media screen and (max-width: 1500px) {
    .ant-table-thead > tr > th,
    .ant-table-tbody > tr > td {
      padding: 16px 8px;
    }
  }
`;
@withRouter
@Relax
export default class CateList extends React.Component<any, any> {
  props: {
    history?: any;
    relaxProps?: {
      goodsPageContent: IList;
      goodsInfoList: IList;
      goodsInfoSpecDetails: IList;
      goodsCateList: IList;
      goodsBrandList: IList;
      onSelectChange: Function;
      selectedSpuKeys: IList;
      total: number;
      onFormFieldChange: Function;
      onPageSearch: Function;
      onShowSku: Function;
      pageNum: number;
      expandedRowKeys: IList;
    };
  };

  static relaxProps = {
    goodsPageContent: ['goodsPage', 'content'],
    goodsInfoList: 'goodsInfoList',
    goodsInfoSpecDetails: 'goodsInfoSpecDetails',
    goodsCateList: 'goodsCateList',
    goodsBrandList: 'goodsBrandList',
    onSelectChange: noop,
    selectedSpuKeys: 'selectedSpuKeys',
    total: ['goodsPage', 'totalElements'],
    onFormFieldChange: noop,
    onPageSearch: noop,
    onShowSku: noop,
    pageNum: 'pageNum',
    expandedRowKeys: 'expandedRowKeys'
  };

  render() {
    const {
      goodsCateList,
      goodsBrandList,
      goodsPageContent,
      selectedSpuKeys,
      onSelectChange,
      total,
      pageNum,
      expandedRowKeys
    } = this.props.relaxProps;
    return (
      <TableReset>
        <DataGrid
          rowKey={(record) => record.goodsId}
          dataSource={goodsPageContent.toJS()}
          expandedRowRender={this._expandedRowRender}
          expandedRowKeys={expandedRowKeys.toJS()}
          onExpandedRowsChange={(record) => this._showSkuByIcon(record)}
          rowSelection={{
            selectedRowKeys: selectedSpuKeys.toJS(),
            onChange: (selectedRowKeys) => {
              onSelectChange(selectedRowKeys);
            },
            getCheckboxProps: (record) => ({
              disabled: record.auditStatus != 0
            })
          }}
          pagination={{ total, current: pageNum + 1, onChange: this._getData }}
        >
          <Column
            title="??????"
            dataIndex="goodsImg"
            key="goodsImg"
            render={(img) =>
              img ? (
                <img src={img} style={styles.imgItem} />
              ) : (
                <img src={defaultImg} style={styles.imgItem} />
              )
            }
          />
          <Column
            title="????????????"
            dataIndex="goodsName"
            key="goodsName"
            className="nameBox"
            width={window.innerWidth <= 1366 ? 100 : 200}
          />
          <Column title="SPU??????" dataIndex="goodsNo" key="goodsNo" />
          <Column
            title="????????????"
            key="saleType"
            render={(rowInfo) => {
              const { saleType } = rowInfo;
              return (
                <div>
                  <p style={styles.lineThrough}>
                    {saleType == 0 ? '??????' : '??????'}
                  </p>
                </div>
              );
            }}
          />
          <Column
            title={
              <p>
                ?????????
                <br />
                ????????????
              </p>
            }
            key="marketPrice"
            render={(rowInfo) => {
              const { marketPrice, priceType } = rowInfo;
              return (
                <div>
                  <p style={styles.lineThrough}>
                    {marketPrice == null ? 0.0 : marketPrice.toFixed(2)}
                  </p>
                  <p style={{ color: '#999' }}>{Const.priceType[priceType]}</p>
                </div>
              );
            }}
          />
          <Column
            title="????????????"
            dataIndex="cateId"
            key="cateId"
            render={(rowInfo) => {
              return goodsCateList
                .filter((v) => {
                  return v.get('cateId') == rowInfo;
                })
                .getIn([0, 'cateName']);
            }}
          />
          <Column
            title="??????"
            dataIndex="brandId"
            key="brandId"
            render={(rowInfo) => {
              return (
                goodsBrandList
                  .filter((v) => {
                    return v.get('brandId') == rowInfo;
                  })
                  .getIn([0, 'brandName']) || '-'
              );
            }}
          />
          <Column
            title="?????????"
            dataIndex="addedFlag"
            key="addedFlag"
            render={(rowInfo) => {
              if (rowInfo == 0) {
                return '??????';
              }
              if (rowInfo == 2) {
                return '????????????';
              }
              return '??????';
            }}
          />
          <Column
            title="????????????"
            dataIndex="supplierName"
            key="supplierName"
          />
          <Column
            title="????????????"
            dataIndex="auditStatus"
            key="auditStatus"
            render={this._getAuditInfo}
          />
          <Column
            title="??????"
            key="goodsId"
            render={(rowInfo) => {
              if (rowInfo.auditStatus == 0) {
                return (
                  <AuthWrapper functionName="f_goods_audit">
                    <Link to={`/goods-check-detail/${rowInfo.goodsId}`}>
                      ??????
                    </Link>
                  </AuthWrapper>
                );
              } else {
                return (
                  <AuthWrapper functionName="f_goods_detail_2">
                    <Link to={`/goods-check-detail/${rowInfo.goodsId}`}>
                      ??????
                    </Link>
                  </AuthWrapper>
                );
              }
            }}
          />
        </DataGrid>
      </TableReset>
    );
  }

  /**
   * ??????????????????????????????
   */
  _getAuditInfo = (auditStatus, record) => {
    let auditStatusStr = '';
    if (auditStatus == 0) {
      auditStatusStr = '?????????';
    } else if (auditStatus == 1) {
      auditStatusStr = '????????????';
    } else if (auditStatus == 2) {
      auditStatusStr = '???????????????';
    } else if (auditStatus == 3) {
      auditStatusStr = '?????????';
    }
    return (
      <div>
        <p>{auditStatusStr}</p>
        {(auditStatus == 2 || auditStatus == 3) && (
          <Tooltip placement="top" title={record.auditReason}>
            <a href="javascript:;">??????</a>
          </Tooltip>
        )}
      </div>
    );
  };

  _expandedRowRender = (record, index) => {
    const { goodsInfoList, goodsInfoSpecDetails } = this.props.relaxProps;

    const currentGoods = goodsInfoList.filter((v) => {
      return record.goodsInfoIds.indexOf(v.get('goodsInfoId')) != -1;
    });

    return currentGoods
      .map((goods, i) => {
        const currentGoodsSpecDetails = goodsInfoSpecDetails
          .filter(
            (v) =>
              goods.get('specDetailRelIds').indexOf(v.get('specDetailRelId')) !=
              -1
          )
          .map((v) => {
            return v.get('detailName');
          })
          .join(' ');

        return (
          <div key={`${index}_${i}`} style={styles.item}>
            <div style={{ marginLeft: 17 }}>
              <img
                src={
                  goods.get('goodsInfoImg')
                    ? goods.get('goodsInfoImg')
                    : defaultImg
                }
                style={styles.imgItem}
              />
              <AuthWrapper functionName="f_goods_sku_detail_2">
                <Link
                  style={{ marginTop: 5, display: 'block' }}
                  to={`/goods-sku-check-detail/${goods.get('goodsInfoId')}`}
                >
                  ??????
                </Link>
              </AuthWrapper>
            </div>
            <div style={{ marginLeft: 0 }}>
              <div style={styles.cell}>
                <label style={styles.label}>?????????</label>
                <span style={styles.textCon}>
                  {currentGoodsSpecDetails ? currentGoodsSpecDetails : '-'}
                </span>
              </div>
              <div style={styles.cell}>
                <label style={styles.label}>SKU?????????</label>
                {goods.get('goodsInfoNo')}
              </div>
              <div style={styles.cell}>
                <label style={styles.label}>????????????</label>
                {goods.get('marketPrice')
                  ? goods.get('marketPrice').toFixed(2)
                  : '0.0'}
              </div>
              <div style={styles.cell}>
                <label style={styles.label}>????????????</label>
                {goods.get('addedFlag') == 0 ? '??????' : '??????'}
              </div>
            </div>
            <div>
              <div style={styles.cell}>
                <label style={styles.label}>????????????</label>
                {goods.get('goodsInfoBarcode')
                  ? goods.get('goodsInfoBarcode')
                  : '-'}
              </div>
              <div style={styles.cell}>
                <label style={styles.label}>?????????</label>
                {goods.get('stock')}
              </div>
            </div>
          </div>
        );
      })
      .toJS();
  };

  //????????????????????????SKU
  _showSkuByIcon = (index) => {
    const { onShowSku } = this.props.relaxProps;
    let goodsIds = List();
    if (index != null && index.length > 0) {
      index.forEach((value, key) => {
        goodsIds = goodsIds.set(key, value);
      });
    }
    onShowSku(goodsIds);
  };

  _getData = (pageNum, pageSize) => {
    const { onFormFieldChange, onPageSearch } = this.props.relaxProps;
    onFormFieldChange({ key: 'pageNum', value: --pageNum });
    onFormFieldChange({ key: 'pageSize', value: pageSize });
    onPageSearch();
  };
}

const styles = {
  item: {
    float: 'left',
    width: '50%',
    display: 'flex',
    flexDirection: 'row',
    margin: '10px 0'
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
    width: 120
  }
} as any;
