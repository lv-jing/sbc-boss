import React from 'react';

import { Popconfirm } from 'antd';
import { Relax } from 'plume2';
import moment from 'moment';
import { Const, DataGrid, history, noop, AuthWrapper } from 'qmkit';
import { IList, IMap } from 'typings/globalType';
import { ShowImageModel } from 'biz';

const defaultImg = require('../image/none.png');
const { Column } = DataGrid;

@Relax
export default class GoodsMatterList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      total: number;
      pageNum: number;
      pageSize: number;
      goodsMatterList: IList;
      showUrl: string;
      sortedInfo: IMap;
      deleteGoodsMatter: Function;
      dataSearch: Function;
      copyCoupon: Function;
      clickImg: Function;
      init: Function;
      companyInfoList: IList;
      goodsInfoSpecDetails: IList;      
    };
  };

  static relaxProps = {
    total: 'total',
    pageNum: 'pageNum',
    pageSize: 'pageSize',
    goodsMatterList: 'goodsMatterList',
    showUrl: 'showUrl',
    sortedInfo: 'sortedInfo',
    deleteGoodsMatter: noop,
    dataSearch: noop,
    clickImg: noop,
    init: noop,
    companyInfoList: 'companyInfoList',
    goodsInfoSpecDetails: 'goodsInfoSpecDetails',    
  };

  render() {
    const {
      total,
      pageNum,
      pageSize,
      goodsMatterList,
      sortedInfo,
      deleteGoodsMatter,
      clickImg,
      showUrl,
      init,
      companyInfoList,      
    } = this.props.relaxProps;

    return (
      <div>
        <DataGrid
          rowKey={(record) => record.id}
          dataSource={goodsMatterList.toJS()}
          pagination={{
            current: pageNum,
            pageSize,
            total,
            onChange: (currentPage, pageSize) => {
              init({ pageNum: currentPage - 1, pageSize: pageSize });
            }
          }}
          onChange={(pagination, filters, sorter) => {
            this._handleOnChange(pagination, filters, sorter);
          }}
        >
          <Column
            title="商品"
            key="goodsInfoId"
            render={(rowInfo) => {
              if(rowInfo.goodsInfo){
                const dataResult = this._dealData(rowInfo.goodsInfo);
                return (
                  <div key={dataResult.goodsInfoId} style={styles.item}>
                    <div>
                      <img
                        src={
                          dataResult.goodsInfoImg
                            ? dataResult.goodsInfoImg
                            : defaultImg
                        }
                        style={styles.imgItem}
                      />
                    </div>
                    <div style={styles.content}>
                      <div className="line-two" style={styles.name}>
                        {dataResult.goodsInfoName}
                      </div>
                      <div className="line-two" style={styles.spec}>
                        {dataResult.currentGoodsSpecDetails}
                      </div>
                      <div style={styles.spec}>{dataResult.goodsInfoNo}</div>
                    </div>
                  </div>
                );
              }else{
                return '-';
              }
            }}
          />
          <Column
            title="商家"
            dataIndex="goodsInfo.companyInfoId"
            key="goodsInfo.companyInfoId"
            className="nameBox"
            width={200}
            render={(rowInfo) => {
              const companyInfo = companyInfoList.find(
                (info) => info.get('companyInfoId') == rowInfo
              );
              return companyInfo ? (
                <div>
                  <p>{companyInfo.get('supplierName')}</p>
                  <p>{companyInfo.get('companyCode')}</p>
                </div>
              ) : (
                '-'
              );
            }}
          />
          <Column
            title={<p>发布者名称<br/>账号</p>}
            width="150px"
            dataIndex="name"
            key="name"
            render={(text, record) => {
              return (
                <div>
                  <p>{text}</p>
                  <p>{(record as any).account}</p>
                </div>
              );
            }}
          />

          <Column
            width="118px"
            title="更新时间"
            dataIndex="updateTime"
            key="updateTime"
            sortOrder={
              sortedInfo.get('columnKey') === 'updateTime' &&
              sortedInfo.get('order')
            }
            render={(text) => {
              return moment(text)
                .format(Const.TIME_FORMAT)
                .toString();
            }}
          />

          <Column
            width="10%"
            title="素材类型"
            dataIndex="matterType"
            key="matterType"
            render={(text) => {
              return text == 0 ? '商品素材' : '营销素材';
            }}
          />

          <Column
            title="素材"
            dataIndex="matter"
            key="matter"
            render={(text, record) => {
              return this._showMatter(text, record, clickImg);
            }}
          />

          <Column
            title="分享次数"
            width="120px"
            dataIndex="recommendNum"
            key="recommendNum"
            sorter={true}
            sortOrder={
              sortedInfo.get('columnKey') === 'recommendNum' &&
              sortedInfo.get('order')
            }
          />

          <Column
            title="操作"
            width="150px"
            key="id"
            render={(rowInfo) => {             
              return (
                <div>
                  {
                    rowInfo.matterType==0?
          <AuthWrapper functionName="f_distribution_goods_matter_new_edit">
          <a
            onClick={() =>     
              history.push({
                pathname: `/distribution-goods-matter/${rowInfo.id}`,
                state: {
                  ...this._dealData(rowInfo.goodsInfo)
                }                                          
              })
            }
          >
            编辑
          </a>
          </AuthWrapper>
          :
            <AuthWrapper functionName="f_distribution_goods_matter_new_edit">
            <a
              onClick={() =>
                history.push({
                  pathname: `/distribution-goods-matter/${rowInfo.id}`,
                  state: {
                    goodsInfoId:-1
                  }
                })
              }
            >
              编辑
            </a>
            </AuthWrapper>
          }    
            &nbsp;&nbsp;&nbsp;
            <AuthWrapper functionName="f_distribution_goods_matter_new_del">
              <Popconfirm
                title="确定删除该素材？"
                onConfirm={() => deleteGoodsMatter([rowInfo.id])}
                okText="确定"
                cancelText="取消"
              >
                <a href="javascript:void(0);">删除</a>
              </Popconfirm>
            </AuthWrapper>
                </div>
              );
            }}
          />
        </DataGrid>
        <ShowImageModel
          url={showUrl}
          visible={showUrl != ''}
          clickImg={() => clickImg('')}
        />
      </div>
    );
  }

  /**
   *  展示素材信息
   * @param text
   * @param record
   */
  private _showMatter(text: string, record: any, clickImg: Function) {
    const { matterType, recommend } = record;
    let showHtml;
    //0: 商品素材   1: 营销素材
    if (matterType == 0) {
      //展示图片
      const matters = text.split(',');
      showHtml = matters.map((item, index) => {
        return (
          <div key={'image:' + index} className="smallitem">
            <img src={item} />
            <p onClick={() => clickImg(item)}>预览</p>
          </div>
        );
      });
    } else {      
      showHtml = JSON.parse(text).map((item, index) => {
        return (
          <div key={'image:' + index} className="smallitem">
            <img src={item.imgSrc} />
            <p onClick={() => clickImg(item.imgSrc)}>预览</p>
          </div>
        );
      });
    }

    return (
      <div>
        <div className="smallPic">{showHtml}</div>
        <div>
          <p style={{ textAlign: 'left' }}>{recommend}</p>
        </div>
      </div>
    );
  }

  //点击排序回调
  _handleOnChange = (pagination, _filters, sorter) => {
    const { dataSearch, sortedInfo, init } = this.props.relaxProps;
    let currentPage = pagination.current;
    if (
      sorter.columnKey != sortedInfo.get('columnKey') ||
      sorter.order != sortedInfo.get('order')
    ) {
      dataSearch(sorter);
    } else {
      init({ pageNum: currentPage - 1, pageSize: 10, headInfo: null });
    }
  };
  /**
   * 拼装商品信息
   * @param rowInfo
   * @returns {{goodsInfoId: any; goodsInfoNo: any; goodsInfoName: any; goodsInfoImg: any; currentGoodsSpecDetails: string}}
   * @private
   */
  _dealData = (rowInfo) => {
    const { goodsInfoSpecDetails } = this.props.relaxProps;
    const {
      goodsInfoId,
      goodsInfoNo,
      goodsInfoName,
      goodsInfoImg,
      specDetailRelIds
    } = rowInfo;
    const currentGoodsSpecDetails =
      goodsInfoSpecDetails &&
      goodsInfoSpecDetails
        .filter((v) => specDetailRelIds.indexOf(v.get('specDetailRelId')) != -1)
        .map((v) => {
          return v.get('detailName');
        })
        .join(' ');
    const dataResult = {
      goodsInfoId: goodsInfoId,
      goodsInfoNo: goodsInfoNo,
      goodsInfoName: goodsInfoName,
      goodsInfoImg: goodsInfoImg,
      currentGoodsSpecDetails: currentGoodsSpecDetails || '-'
    };
    return dataResult;
  };
}

const styles = {
  item: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    margin: '10px 0',
    height: 124
  },
  content: {
    width: 200,
    marginLeft: 5,
    textAlign: 'left'
  },
  name: {
    color: '#333',
    fontSize: 14
  },
  spec: {
    color: '#999',
    fontSize: 12
  },
  label: {
    color: '#999',
    width: 80,
    textAlign: 'right',
    display: 'inline-block'
  },
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
    WebkitBoxOrient: 'vertical'
  }
} as any;
