import * as React from 'react';
import { Relax } from 'plume2';
import { AuthWrapper, DataGrid, noop, Const, checkAuth } from 'qmkit';
import { List } from 'immutable';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { IList } from 'typings/globalType';

const { Column } = DataGrid;
const defaultImg = require('../img/none.png');

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
      changeForbidGoodsId: Function;
      switchShowModal: Function;
      forbidSaleFunc: Function;
      total: number;
      onFormFieldChange: Function;
      onPageSearch: Function;
      onShowSku: Function;
      pageNum: number;
      expandedRowKeys: IList;
      importStandard: IList;
      addToGoodsLibrary: Function;
    };
  };

  static relaxProps = {
    goodsPageContent: ['goodsPage', 'content'],
    goodsInfoList: 'goodsInfoList',
    goodsInfoSpecDetails: 'goodsInfoSpecDetails',
    goodsCateList: 'goodsCateList',
    goodsBrandList: 'goodsBrandList',
    changeForbidGoodsId: noop, //禁售spuId
    switchShowModal: noop, //切换是否显示禁售原因弹框
    forbidSaleFunc: noop, //禁售
    total: ['goodsPage', 'totalElements'],
    onFormFieldChange: noop,
    onPageSearch: noop,
    onShowSku: noop,
    pageNum: 'pageNum',
    expandedRowKeys: 'expandedRowKeys', //正展开的spuIdList
    importStandard: [],
    addToGoodsLibrary: noop
  };

  render() {
    const {
      goodsCateList,
      goodsBrandList,
      goodsPageContent,
      total,
      pageNum,
      expandedRowKeys,
      changeForbidGoodsId,
      switchShowModal,
      addToGoodsLibrary
    } = this.props.relaxProps;

    return (
      <DataGrid
        rowKey={(record) => record.goodsId}
        dataSource={goodsPageContent.toJS()}
        expandedRowRender={this._expandedRowRender}
        expandedRowKeys={expandedRowKeys.toJS()}
        onExpandedRowsChange={(record) => this._showSkuByIcon(record)}
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
          width={200}
        />
        <Column title="SPU编码" dataIndex="goodsNo" key="goodsNo" />
        <Column
          title="商品类型"
          key="goodsType"
          render={(rowInfo) => {
            const { goodsType } = rowInfo;
            return (
              <div>
                <p style={styles.lineThrough}>
                  {goodsType == 0 ? '实物商品' : '虚拟商品'}
                </p>
              </div>
            );
          }}
        />
        <Column
          title="供货价"
          key="supplyPrice"
          render={(rowInfo) => {
            const { supplyPrice } = rowInfo;
            return (
              <div>
                <p style={styles.lineThrough}>
                  {supplyPrice == null ? 0.0 : supplyPrice.toFixed(2)}
                </p>
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
        <Column title="供应商" dataIndex="supplierName" key="supplierName" />
        <Column
          title="操作"
          key="goodsId"
          render={(rowInfo) => {
            return checkAuth('f_goods_detail_1_provider') ||
              checkAuth('f_goods_2_provider') ? (
              <div>
                <div>
                  <AuthWrapper functionName="f_goods_detail_1_provider">
                    <Link
                      to={`/goods-detail-provider/${rowInfo.goodsId}`}
                      style={{ marginRight: 10 }}
                    >
                      查看
                    </Link>
                  </AuthWrapper>
                  <AuthWrapper functionName="f_goods_2_provider">
                    <a
                      href="javascript:void(0);"
                      onClick={() => {
                        changeForbidGoodsId(rowInfo.goodsId);
                        switchShowModal(true);
                      }}
                    >
                      禁售
                    </a>
                  </AuthWrapper>
                </div>
              </div>
            ) : (
              '-'
            );
          }}
        />
      </DataGrid>
    );
  }

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
              <AuthWrapper functionName="f_goods_sku_detail_1_provider">
                <Link
                  style={{ marginTop: 5, display: 'block' }}
                  to={`/goods-sku-detail-provider/${goods.get('goodsInfoId')}`}
                >
                  查看
                </Link>
              </AuthWrapper>
            </div>
            <div style={{ marginLeft: 0 }}>
              <div style={styles.cell}>
                <label style={styles.label}>规格：</label>
                <span className="specification" style={styles.textCon}>
                  {currentGoodsSpecDetails ? currentGoodsSpecDetails : '-'}
                </span>
              </div>
              <div style={styles.cell}>
                <label style={styles.label}>SKU编码：</label>
                {goods.get('goodsInfoNo')}
              </div>
              {/*<div style={styles.cell}>
                <label style={styles.label}>市场价：</label>
                {goods.get('marketPrice')!=null
                  ? goods.get('marketPrice').toFixed(2)
                  : '-'}
              </div>*/}
              <div style={styles.cell}>
                <label style={styles.label}>供货价：</label>
                {goods.get('supplyPrice') != null
                  ? goods.get('supplyPrice').toFixed(2)
                  : '-'}
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
