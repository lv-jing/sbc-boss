import * as React from 'react';
import { Relax } from 'plume2';
import { DataGrid, noop, history, AuthWrapper } from 'qmkit';
import { List } from 'immutable';
import { Modal } from 'antd';
import { Link } from 'react-router-dom';
import { IList } from 'typings/globalType';

const { Column } = DataGrid;
const confirm = Modal.confirm;
const defaultImg = require('../img/none.png');

@Relax
export default class GoodsLibraryList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      standardGoodsPage: IList;
      standardSkuList: IList;
      standardSkuSpecDetails: IList;
      allCateList: IList;
      goodsBrandList: IList;
      onSelectChange: Function;
      spuDelete: Function;
      selectedSpuKeys: IList;
      total: number;
      onSearch: Function;
      onPageSearch: Function;
      onShowSku: Function;
      pageNum: number;
      expandedRowKeys: IList;
      goodsCateList: IList;
    };
  };

  static relaxProps = {
    standardGoodsPage: ['standardGoodsPage', 'content'],
    standardSkuList: 'standardSkuList',
    standardSkuSpecDetails: 'standardSkuSpecDetails',
    allCateList: 'allCateList',
    goodsBrandList: 'goodsBrandList',
    onSelectChange: noop,
    spuDelete: noop,
    selectedSpuKeys: 'selectedSpuKeys',
    total: ['standardGoodsPage', 'totalElements'],
    onSearch: noop,
    onPageSearch: noop,
    onShowSku: noop,
    pageNum: 'pageNum',
    expandedRowKeys: 'expandedRowKeys',
    goodsCateList: 'goodsCateList'
  };

  render() {
    const {
      goodsBrandList,
      standardGoodsPage,
      total,
      pageNum,
      expandedRowKeys,
      goodsCateList
    } = this.props.relaxProps;
    return (
      <DataGrid
        rowKey={(record) => record.goodsId}
        dataSource={standardGoodsPage.toJS()}
        expandedRowRender={this._expandedRowRender}
        expandedRowKeys={expandedRowKeys.toJS()}
        onExpandedRowsChange={(record) => this._showSkuByIcon(record)}
        pagination={{ total, current: pageNum, onChange: this._getData }}
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
          width={200}
        />

        <Column
          title="?????????"
          dataIndex="marketPrice"
          key="marketPrice"
          render={(rowInfo) => {
            return rowInfo == null ? 0.0 : rowInfo.toFixed(2);
          }}
        />

        <Column
          title="????????????"
          dataIndex="cateId"
          key="cateId"
          render={(rowInfo) => {
            return (
              goodsCateList
                .filter((v) => {
                  return v.get('cateId') == rowInfo;
                })
                .getIn([0, 'cateName']) || '-'
            );
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
          title="??????"
          key="goodsId"
          render={(rowInfo) => {
            return (
              <div>
                <AuthWrapper functionName="f_editor_goods_library">
                  <Link
                    to={`/goods-library-detail/${rowInfo.goodsId}`}
                    style={{ marginRight: 10 }}
                  >
                    ??????
                  </Link>
                </AuthWrapper>
                <AuthWrapper functionName="f_del_goods_library">
                  <a
                    href="javascript:;"
                    onClick={() => {
                      this._delete(rowInfo.goodsId);
                    }}
                  >
                    ??????
                  </a>
                </AuthWrapper>
              </div>
            );
          }}
        />
      </DataGrid>
    );
  }

  _expandedRowRender = (record, index) => {
    const { standardSkuList, standardSkuSpecDetails } = this.props.relaxProps;

    const currentGoods = standardSkuList.filter((v) => {
      return record.goodsInfoIds.indexOf(v.get('goodsInfoId')) != -1;
    });

    return currentGoods
      .map((goods, i) => {
        const currentGoodsSpecDetails = standardSkuSpecDetails
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
              <AuthWrapper functionName="f_editor_goods_library_sku">
                <div>
                  <a
                    href="javascript:;"
                    style={{
                      marginTop: 5,
                      marginRight: 5,
                      display: 'inline-block'
                    }}
                    onClick={() =>
                      history.push({
                        pathname: `/goods-library-sku-editor/${goods.get(
                          'goodsInfoId'
                        )}`
                      })
                    }
                  >
                    ??????
                  </a>
                </div>
              </AuthWrapper>
            </div>
            <div style={{ marginLeft: 0 }}>
              <div style={styles.cell}>
                <label style={styles.label}>?????????</label>
                <span className="specification">
                  {currentGoodsSpecDetails ? currentGoodsSpecDetails : '-'}
                </span>
              </div>
              <div style={styles.cell}>
                <label style={styles.label}>????????????</label>
                {goods.get('marketPrice') || goods.get('marketPrice') === 0
                  ? goods.get('marketPrice').toFixed(2)
                  : '-'}
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
    const { onPageSearch } = this.props.relaxProps;
    onPageSearch(pageNum, pageSize);
  };

  /**
   * ??????
   */
  _delete = (goodsId: string) => {
    const { spuDelete } = this.props.relaxProps;
    confirm({
      title: '??????',
      content: '????????????????????????????????????',
      onOk() {
        spuDelete([goodsId]);
      }
    });
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
