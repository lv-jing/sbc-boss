import React from 'react';

import { Popconfirm } from 'antd';
import { Relax } from 'plume2';
import moment from 'moment';

import { Const, DataGrid, history, noop, AuthWrapper } from 'qmkit';
import { IList, IMap } from 'typings/globalType';
import { ShowImageModel } from 'biz';

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
      head: IMap;
      deleteGoodsMatter: Function;
      dataSearch: Function;
      copyCoupon: Function;
      clickImg: Function;
      init: Function;
    };
  };

  static relaxProps = {
    total: 'total',
    pageNum: 'pageNum',
    pageSize: 'pageSize',
    goodsMatterList: 'goodsMatterList',
    showUrl: 'showUrl',
    sortedInfo: 'sortedInfo',
    head: 'head',
    deleteGoodsMatter: noop,
    dataSearch: noop,
    clickImg: noop,
    init: noop
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
      head
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
            title="发布者名称/账号"
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
            dataIndex="id"
            key="id"
            render={(text) => {
              return (
                <div>
                  <AuthWrapper functionName="f_distribution_goods_matter_edit">
                    <a
                      onClick={() =>
                        history.push({
                          pathname: `/distribution-goods-matter/${text}`,
                          state: {
                            ...head.toJS()
                          }
                        })
                      }
                    >
                      编辑
                    </a>
                  </AuthWrapper>
                  &nbsp;&nbsp;&nbsp;
                  <AuthWrapper functionName="f_distribution_goods_matter_del">
                    <Popconfirm
                      title="确定删除该素材？"
                      onConfirm={() => deleteGoodsMatter([text])}
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
    //0: 商品素材 1：营销素材
    if (matterType == 0) {      
      //展示图片
      const matters = text.split(',');
      showHtml = matters.map((item, index) => {
        return (
          <div key={'image:' + index} className="smallitem" style={{width:'50px'}}>
            <img src={item} />
            <p onClick={() => clickImg(item)}>预览</p>
          </div>
        );
      });
    } else {
      //还是图片
      const matters = JSON.parse(text);
      showHtml = matters.map((item, index) => {
        return (
          <div key={'image:' + index} className="smallitem" style={{width:'50px'}}>
            <img src={item.imgSrc} />
            <p onClick={() => clickImg(item.imgSrc)}>预览</p>
          </div>
        );
      });
      // showHtml = (
      //   <div className="smallitem" style={{ width: 'auto' }}>
      //     <img src={defaultImg} />
      //     <p onClick={() => this._videoDetail(text)}>预览</p>
      //   </div>
      // );
    }

    return (
      <div>
        <div className="smallPic" style={{width:'500px'}}>{showHtml}</div>
        <div>
          <p style={{ textAlign: 'left' }}>{recommend}</p>
        </div>
      </div>
    );
  }

  /**
   * 点击视频信息
   * @param videoUrl
   * @private
   */
  // private _videoDetail = (videoUrl: string) => {
  //   //打开新页面播放视频
  //   let tempWindow = window.open();
  //   tempWindow.location.href = `/video-detail?videoUrl=${videoUrl}`;
  // };

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
}
