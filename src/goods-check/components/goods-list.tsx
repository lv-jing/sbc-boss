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
            title="图片"
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
            title="商品名称"
            dataIndex="goodsName"
            key="goodsName"
            className="nameBox"
            width={window.innerWidth <= 1366 ? 100 : 200}
          />
          <Column title="SPU编码" dataIndex="goodsNo" key="goodsNo" />
          <Column
            title="销售类型"
            key="saleType"
            render={(rowInfo) => {
              const { saleType } = rowInfo;
              return (
                <div>
                  <p style={styles.lineThrough}>
                    {saleType == 0 ? '批发' : '零售'}
                  </p>
                </div>
              );
            }}
          />
          <Column
            title={
              <p>
                市场价
                <br />
                设价方式
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
            title="商品类目"
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
            title="品牌"
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
            title="上下架"
            dataIndex="addedFlag"
            key="addedFlag"
            render={(rowInfo) => {
              if (rowInfo == 0) {
                return '下架';
              }
              if (rowInfo == 2) {
                return '部分上架';
              }
              return '上架';
            }}
          />
          <Column
            title="所属商家"
            dataIndex="supplierName"
            key="supplierName"
          />
          <Column
            title="审核状态"
            dataIndex="auditStatus"
            key="auditStatus"
            render={this._getAuditInfo}
          />
          <Column
            title="操作"
            key="goodsId"
            render={(rowInfo) => {
              if (rowInfo.auditStatus == 0) {
                return (
                  <AuthWrapper functionName="f_goods_audit">
                    <Link to={`/goods-check-detail/${rowInfo.goodsId}`}>
                      审核
                    </Link>
                  </AuthWrapper>
                );
              } else {
                return (
                  <AuthWrapper functionName="f_goods_detail_2">
                    <Link to={`/goods-check-detail/${rowInfo.goodsId}`}>
                      查看
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
   * 获取审核区域展示信息
   */
  _getAuditInfo = (auditStatus, record) => {
    let auditStatusStr = '';
    if (auditStatus == 0) {
      auditStatusStr = '待审核';
    } else if (auditStatus == 1) {
      auditStatusStr = '审核通过';
    } else if (auditStatus == 2) {
      auditStatusStr = '审核未通过';
    } else if (auditStatus == 3) {
      auditStatusStr = '禁售中';
    }
    return (
      <div>
        <p>{auditStatusStr}</p>
        {(auditStatus == 2 || auditStatus == 3) && (
          <Tooltip placement="top" title={record.auditReason}>
            <a href="javascript:;">原因</a>
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
                  查看
                </Link>
              </AuthWrapper>
            </div>
            <div style={{ marginLeft: 0 }}>
              <div style={styles.cell}>
                <label style={styles.label}>规格：</label>
                <span style={styles.textCon}>
                  {currentGoodsSpecDetails ? currentGoodsSpecDetails : '-'}
                </span>
              </div>
              <div style={styles.cell}>
                <label style={styles.label}>SKU编码：</label>
                {goods.get('goodsInfoNo')}
              </div>
              <div style={styles.cell}>
                <label style={styles.label}>市场价：</label>
                {goods.get('marketPrice')
                  ? goods.get('marketPrice').toFixed(2)
                  : '0.0'}
              </div>
              <div style={styles.cell}>
                <label style={styles.label}>上下架：</label>
                {goods.get('addedFlag') == 0 ? '下架' : '上架'}
              </div>
            </div>
            <div>
              <div style={styles.cell}>
                <label style={styles.label}>条形码：</label>
                {goods.get('goodsInfoBarcode')
                  ? goods.get('goodsInfoBarcode')
                  : '-'}
              </div>
              <div style={styles.cell}>
                <label style={styles.label}>库存：</label>
                {goods.get('stock')}
              </div>
            </div>
          </div>
        );
      })
      .toJS();
  };

  //通过图标点击显示SKU
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
