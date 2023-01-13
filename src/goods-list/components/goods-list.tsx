import * as React from 'react';
import { Relax } from 'plume2';
import { DataGrid, noop, history, AuthWrapper, Const, cache, checkAuth } from 'qmkit';
import { List, fromJS } from 'immutable';
import { Menu, Dropdown, Icon, Modal, Tooltip, Popconfirm } from 'antd';
import { withRouter } from 'react-router';
import { IList } from 'typings/globalType';
import { Table } from 'antd';

const Column = Table.Column;
const confirm = Modal.confirm;
const defaultImg = require('../img/none.png');
import { FormattedMessage, injectIntl } from 'react-intl';
import './goods-list.css';

@withRouter
@Relax
class CateList extends React.Component<any, any> {
  props: {
    intl?:any;
    relaxProps?: {
      goodsPageContent: IList;
      goodsInfoList: IList;
      goodsInfoSpecDetails: IList;
      allCateList: IList;
      goodsBrandList: IList;
      onSelectChange: Function;
      spuDelete: Function;
      spuOnSale: Function;
      spuOffSale: Function;
      selectedSpuKeys: IList;
      total: number;
      onFormFieldChange: Function;
      onSearch: Function;
      onPageSearch: Function;
      onShowSku: Function;
      pageNum: number;
      expandedRowKeys: IList;
      getGoodsCate: IList;
      sourceGoodCateList: IList;
      loading: any;
    };
  };

  static relaxProps = {
    goodsPageContent: ['goodsPage', 'content'],
    goodsInfoList: 'goodsInfoList',
    goodsInfoSpecDetails: 'goodsInfoSpecDetails',
    allCateList: 'allCateList',
    goodsBrandList: 'goodsBrandList',
    onSelectChange: noop,
    spuDelete: noop,
    spuOnSale: noop,
    spuOffSale: noop,
    selectedSpuKeys: 'selectedSpuKeys',
    total: ['goodsPage', 'totalElements'],
    onFormFieldChange: noop,
    onSearch: noop,
    onPageSearch: noop,
    onShowSku: noop,
    pageNum: 'pageNum',
    expandedRowKeys: 'expandedRowKeys',
    getGoodsCate: 'getGoodsCate',
    sourceGoodCateList: 'sourceGoodCateList',
    loading: 'loading'
  };

  render() {
    const { loading, goodsBrandList, goodsPageContent, selectedSpuKeys, onSelectChange, total, pageNum, expandedRowKeys, onShowSku } = this.props.relaxProps;

    let hasMenu = true;
    // if (checkAuth('f_goods_sku_edit_2') || checkAuth('f_goods_sku_edit_3') || checkAuth('f_goods_up_down') || checkAuth('f_goods_6')) {
    //   hasMenu = true;
    // }
    return (
      <DataGrid
        rowKey={(record) => record.goodsId}
        dataSource={goodsPageContent.toJS()}
        loading={loading}
        // expandedRowRender={this._expandedRowRender}
        // expandedRowKeys={expandedRowKeys.toJS()}
        // onExpand={(expanded, record) => {
        //   let keys = fromJS([]);
        //   if (expanded) {
        //     keys = expandedRowKeys.push(record.goodsId);
        //   } else {
        //     keys = expandedRowKeys.filter((key) => key != record.goodsId);
        //   }
        //   onShowSku(keys);
        // }}
        // rowSelection={{
        //   selectedRowKeys: selectedSpuKeys.toJS(),
        //   onChange: (selectedRowKeys) => {
        //     onSelectChange(selectedRowKeys);
        //   }
        // }}
        pagination={{ total, current: pageNum + 1, onChange: this._getData }}
      >
        {/* Image */}
        <Column title={<FormattedMessage id="Product.image" />} dataIndex="goodsImg" key="goodsImg" render={(img) => (img ? <img src={img} style={styles.imgItem} /> : <img src={defaultImg} style={styles.imgItem} />)} />
        {/* Product name */}
        <Column
          // title="商品名称"
          title={<FormattedMessage id="Product.productName" />}
          dataIndex="goodsName"
          key="goodsName"
          className="nameBox"
          render={(rowInfo) => {
            return (
              <Tooltip
                overlayStyle={{
                  overflowY: 'auto'
                  //height: 100
                }}
                placement="bottomLeft"
                title={<div>{rowInfo}</div>}
              >
                <p style={styles.text}>{rowInfo}</p>
              </Tooltip>
            );
          }}
        />
        {/* SPU */}
        <Column title={<FormattedMessage id="Product.SPU" />} dataIndex="goodsNo" key="goodsNo" />
        {/* <Column
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
        /> */}
        {/* Market price */}
        <Column title={<FormattedMessage id="Store.StoreId" />} dataIndex="storeId" key="storeId" />
        <Column title={<FormattedMessage id="Store.StoreName" />} dataIndex="storeName" key="storeName" />
        <Column
          title={
            <span>
              <FormattedMessage id="Product.marketPrice" />
            </span>
          }
          key="marketPrice"
          render={(rowInfo) => {
            const { marketPrice, priceType } = rowInfo;
            return (
              <div>
                <p style={styles.lineThrough}>
                  {sessionStorage.getItem(cache.SYSTEM_GET_CONFIG)}
                  {/*.toFixed(2)*/}
                  {marketPrice == null ? 0.0 : marketPrice}
                </p>
              </div>
            );
          }}
        />
        {/* Sales category */}
        <Column
          // title="店铺分类"
          title={<FormattedMessage id="Product.SalesCategory" />}
          dataIndex="goodsStoreCateNames"
          key="goodsStoreCateNames" 
          //render={this._renderStoreCateList}
        />
        {/* Product category */}
        <Column
          // title="店铺分类"
          title={<FormattedMessage id="Product.ProductCategory" />}
          dataIndex="productCategoryNames"
          key="productCategoryNames"
          //render={this._renderProductCateList}
        />
        {/* Brand */}
        <Column
          // title="品牌"
          title={<FormattedMessage id="Product.brand" />}
          dataIndex="brandName"
          key="brandName"
          render={(rowInfo) => {
            return rowInfo != null ? rowInfo : '--';
            /*return (
              goodsBrandList
                .filter((v) => {
                  return v.get('brandId') == rowInfo;
                })
                .getIn([0, 'brandName']) || '-'
            );*/
          }}
        />
        {/* On/off shelves */}
        <Column
          title={<FormattedMessage id="Product.onOrOffShelves" />}
          dataIndex="addedFlag"
          key="addedFlag"
          render={(rowInfo) => {
            if (rowInfo == 0) {
              return <FormattedMessage id="Product.offShelves" />;
            }
            if (rowInfo == 2) {
              return <FormattedMessage id="Product.partialOnShelves" />;
            }
            return <FormattedMessage id="Product.onShelves" />;
          }}
        />
        {/* Operation */}
        <Column
          align="center"
          title={<FormattedMessage id="Product.operation" />}
          key="goodsId"
          className="operation-th"
          render={(rowInfo) => {
            return hasMenu ? this._menu(rowInfo) : '-';
          }}
        />
      </DataGrid>
    );
  }

  /**
   * 渲染多个店铺分类
   */
  _renderStoreCateList = (rowInfo) => {
    const { allCateList } = this.props.relaxProps;
    if (rowInfo && rowInfo.length) {
      const strInfo = rowInfo.map((info) => allCateList.filter((v) => v.get('storeCateId') == info).getIn([0, 'cateName'])).join(',');
      if (strInfo.length > 20) {
        return (
          <Tooltip placement="top" title={strInfo}>
            {strInfo.substr(0, 20)}...
          </Tooltip>
        );
      } else {
        return (
          <Tooltip placement="top" title={strInfo}>
            {strInfo}
          </Tooltip>
        );
      }
    }
    return '-';
  };
  _renderProductCateList = (rowInfo) => {
    const { sourceGoodCateList } = this.props.relaxProps;
    if (sourceGoodCateList) {
      let productCategory = sourceGoodCateList.toJS().find((x) => x.cateId === rowInfo);
      return <span>{productCategory ? productCategory.cateName : ''}</span>;
    }
    return '';
  };

  _menu = (rowInfo) => {
    const { spuOnSale, spuOffSale, spuDelete } = this.props.relaxProps;
    return (
      <div className="operation-box">
        {/* <AuthWrapper functionName="f_goods_sku_edit_2"> */}
          <Tooltip placement="top" title={<FormattedMessage id="Product.Details" />}>
            {rowInfo.goodsType != 2 ? (
              <a
                onClick={() =>
                  history.push({
                    pathname: `/goods-regular-edit/${rowInfo.goodsId}`,
                    state: { tab: 'main', goodsType: 'edit', storeId: rowInfo.storeId }
                  })
                }
                style={{ marginRight: 5 }}
              >
                <span className="icon iconfont iconDetails" style={{ fontSize: 20 }}></span>
                {/* <FormattedMessage id="edit" /> */}
              </a>
            ) : (
              <a
                onClick={() =>
                  history.push({
                    pathname: `/goods-bundle-edit/${rowInfo.goodsId}`,
                    state: { tab: 'main', goodsType: 'edit', storeId: rowInfo.storeId }
                  })
                }
                style={{ marginRight: 5 }}
              >
                <span className="icon iconfont iconDetails" style={{ fontSize: 20 }}></span>
                {/* <FormattedMessage id="edit" /> */}
              </a>
            )}
          </Tooltip>
        {/* </AuthWrapper> */}
        {/* <AuthWrapper functionName="f_goods_sku_edit_3">
          <a
            href="#!"
            onClick={() =>
              history.push({
                pathname: `/goods-edit/${rowInfo.goodsId}`,
                state: { tab: 'price' }
              })
            }
          >
            <FormattedMessage id="product.setPrice" />
          </a>
        </AuthWrapper> */}
        {/* {rowInfo.addedFlag == 0 ? (
          <AuthWrapper functionName="f_goods_up_down">
            <Tooltip placement="top" title={<FormattedMessage id="Product.Onshelves" />}>
              <a
                href="#!"
                onClick={() => {
                  spuOnSale([rowInfo.goodsId]);
                }}
                style={{ marginRight: 5 }}
              >
                <span className="icon iconfont iconOnShelves" style={{ fontSize: 20 }}></span>
              </a>
            </Tooltip>
          </AuthWrapper>
        ) : null} */}
        {/* {rowInfo.addedFlag == 1 || rowInfo.addedFlag == 2 ? (
          <AuthWrapper functionName="f_goods_up_down">
            <Popconfirm placement="topLeft" title={<FormattedMessage id="Product.OffshelvesConfirmTip" />} onConfirm={() => spuOffSale([rowInfo.goodsId])} okText={<FormattedMessage id="Product.Confirm" />} cancelText={<FormattedMessage id="Product.Cancel" />}>
              <Tooltip placement="top" title={<FormattedMessage id="Product.Offshelves" />}>
                <a style={{ marginRight: 5 }}>
                  <span className="icon iconfont iconOffShelves" style={{ fontSize: 20 }}></span>
                </a>
              </Tooltip>
            </Popconfirm>
          </AuthWrapper>
        ) : null} */}
        {/* <AuthWrapper functionName="f_goods_6">
          <Popconfirm placement="topLeft" title={<FormattedMessage id="Product.deleteThisProduct" />} onConfirm={() => spuDelete([rowInfo.goodsId])} okText={<FormattedMessage id="Product.Confirm" />} cancelText={<FormattedMessage id="Product.Cancel" />}>
            <Tooltip placement="top" title={<FormattedMessage id="Product.Delete" />}>
              <a>
                <span className="icon iconfont iconDelete" style={{ fontSize: 20 }}></span>
              </a>
            </Tooltip>
          </Popconfirm>
        </AuthWrapper> */}
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
          .filter((v) => goods.get('specDetailRelIds').indexOf(v.get('specDetailRelId')) != -1)
          .map((v) => {
            return v.get('detailName');
          })
          .join(' ');

        return (
          <div key={`${index}_${i}`} style={styles.item}>
            <div style={{ marginLeft: 17 }}>
              <img src={goods.get('goodsInfoImg') ? goods.get('goodsInfoImg') : defaultImg} style={styles.imgItem} />
              <AuthWrapper functionName="f_goods_sku_edit_2">
                <a
                  href="#!"
                  style={{
                    marginTop: 5,
                    marginRight: 5,
                    display: 'inline-block'
                  }}
                  onClick={() =>
                    history.push({
                      pathname: `/goods-sku-edit/${goods.get('goodsInfoId')}`,
                      state: { tab: 'main' }
                    })
                  }
                >
                  <FormattedMessage id="Product.edit" />
                </a>
              </AuthWrapper>
              <AuthWrapper functionName="f_goods_sku_edit_3">
                {record.priceType === 1 && !record.allowPriceSet ? null : (
                  <a
                    href="#!"
                    style={{ marginTop: 5, display: 'inline-block' }}
                    onClick={() =>
                      history.push({
                        pathname: `/goods-sku-edit/${goods.get('goodsInfoId')}`,
                        state: { tab: 'price' }
                      })
                    }
                  >
                    <FormattedMessage id="Product.setPrice" />
                  </a>
                )}
              </AuthWrapper>
            </div>
            <div style={{ marginLeft: 0 }}>
              <div style={styles.cell}>
                <label style={styles.label}>
                  <FormattedMessage id="Product.Specification" />：
                </label>
                <span className="specification" style={styles.textCon}>
                  {currentGoodsSpecDetails ? currentGoodsSpecDetails : '-'}
                </span>
              </div>
              <div style={styles.cell}>
                <label style={styles.label}>
                  <FormattedMessage id="Product.skuCode" />：
                </label>
                {goods.get('goodsInfoNo')}
              </div>
              <div style={styles.cell}>
                <label style={styles.label}>
                  <FormattedMessage id="Product.MarketPrice" />：
                </label>
                {goods.get('marketPrice') || goods.get('marketPrice') === 0 ? goods.get('marketPrice').toFixed(2) : 0}
              </div>
              <div style={styles.cell}>
                <label style={styles.label}>
                  <FormattedMessage id="Product.On/OffShelve" />：
                </label>
                {goods.get('addedFlag') != 0 ? 'Off shelf' : 'On shelf'}
              </div>
            </div>
            <div>
              <div style={styles.cell}>
                <label style={styles.label}>
                  <FormattedMessage id="Product.BarCode" />：
                </label>
                {goods.get('goodsInfoBarcode') ? goods.get('goodsInfoBarcode') : '-'}
              </div>
              <div style={styles.cell}>
                <label style={styles.label}>
                  <FormattedMessage id="Product.InStock" />：
                </label>
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

  /**
   * 删除
   */
  _delete = (goodsId: string) => {
    const { spuDelete } = this.props.relaxProps;
    const title = (window as any).RCi18n({id:'Product.Prompt'});
    const content = (window as any).RCi18n({id:'Product.deleteThisProduct'});
    confirm({
      title: title,
      content: content,
      onOk() {
        spuDelete([goodsId]);
      }
    });
  };
}

export default injectIntl(CateList);

const styles = {
  item: {
    float: 'left',
    width: '50%',
    display: 'flex',
    flexDirection: 'row',
    margin: '10px 0',
    height: 124
  },
  text: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  cell: {
    color: '#999',
    width: 180,
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
    float: 'left',
    marginRight: 10,
    background: '#fff',
    borderRadius: 3
  },
  textCon: {
    width: 100,
    maxHeight: 62,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    webkitBoxOrient: 'vertical'
  } as any
} as any;
