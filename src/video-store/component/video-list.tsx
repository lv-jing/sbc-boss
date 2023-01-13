import * as React from 'react';
import { Relax } from 'plume2';
import { noop, AuthWrapper } from 'qmkit';
import { List, fromJS } from 'immutable';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import { Modal, Pagination, message, Tooltip } from 'antd';
import { allCheckedQL } from '../ql';
import Input from 'antd/lib/input/Input';
import { FormattedMessage, injectIntl } from 'react-intl';

declare type IList = List<any>;

const confirm = Modal.confirm;

@Relax
class VideoList extends React.Component<any, any> {
  props: {
    intl?:any;
    relaxProps?: {
      videoList: IList; //视频列表
      queryVideoPage: Function; //初始化
      onCheckedAll: Function; //全选
      onChecked: Function; //单选
      doDelete: Function; //删除
      showMoveVideoModal: Function; //移动视频弹窗
      editVideo: Function; //编辑视频名称
      currentPage: number; //分页
      total: number; //分页
      pageSize: number; //分页
      allChecked: boolean;
    };
  };

  static relaxProps = {
    videoList: 'videoList',
    queryVideoPage: noop,
    onCheckedAll: noop,
    onChecked: noop,
    doDelete: noop,
    showMoveVideoModal: noop,
    editVideo: noop,
    currentPage: 'currentPage',
    total: 'total',
    pageSize: 'pageSize',
    allChecked: allCheckedQL
  };

  render() {
    const { videoList, currentPage, total, pageSize, allChecked } = this.props.relaxProps;
    return (
      <div>
        <div style={styles.greyHeader}>
          <Checkbox checked={allChecked} onChange={this._onchangeCheckedAll.bind(this)} style={{ width: '10%', display: 'inline-block' }}>
            {/* <FormattedMessage id="selectAll" /> */}
          </Checkbox>
          <span style={styles.videoItem}>
            <FormattedMessage id="Setting.videoName" />
          </span>
          <span style={styles.videoItem}>
            <FormattedMessage id="Setting.videoUrl" />
          </span>
          <span style={styles.videoItem}>
            <FormattedMessage id="Setting.operation" />
          </span>
        </div>
        <div>
          {(videoList || fromJS([])).map((item, index) => {
            return (
              <div style={styles.boxItem} key={item.get('resourceId')}>
                <Checkbox checked={item.get('checked')} onChange={this._onchangeChecked.bind(this, index)} style={{ width: '10%', display: 'inline-block' }} />
                <span style={styles.videoItem}>
                  <Input
                    defaultValue={item.get('resourceName')}
                    onBlur={(e) => {
                      this._updateVideo(e, item.get('resourceName'), item.get('resourceId'));
                    }}
                  />
                </span>
                <a onClick={this._videoDetail.bind(this, item.get('artworkUrl'))} style={styles.videoItem}>
                  {item.get('artworkUrl')}
                </a>
                <AuthWrapper functionName="f_videoStore_2">
                  <Tooltip placement="top" title={<FormattedMessage id="Setting.Delete" />}>
                    <a onClick={this._delete.bind(this, item.get('resourceId'))} style={styles.videoItem} className="iconfont iconDelete">
                      {/*<FormattedMessage id="delete" />*/}
                    </a>
                  </Tooltip>
                </AuthWrapper>
              </div>
            );
          })}
        </div>
        {(videoList || fromJS([])).size == 0 ? (
          <div className="ant-table-placeholder">
            <span>
              <i className="anticon anticon-frown-o" />
              <FormattedMessage id="Setting.NoData" />
            </span>
          </div>
        ) : (
          <div style={styles.page}>
            <Pagination onChange={(pageNum, pageSize) => this._toCurrentPage(pageNum, pageSize)} current={currentPage} total={total} pageSize={pageSize} />
          </div>
        )}
      </div>
    );
  }

  _videoDetail = (videoUrl: string) => {
    //打开新页面播放视频
    let tempWindow = window.open();
    tempWindow.location.href = `/video-detail?videoUrl=${videoUrl}`;
  };

  /**
   * 删除视频
   */
  _delete = (videoId: string) => {
    const { doDelete } = this.props.relaxProps;
    const title = (window as any).RCi18n({id:'Setting.Prompt'});
    const content = (window as any).RCi18n({id:'Setting.theSelectedVideo'});
    confirm({
      title: title,
      content: content,
      onOk() {
        doDelete(videoId);
      }
    });
  };

  /**
   * 显示分类列表
   * @private
   */
  _showModal = () => {
    const { videoList, showMoveVideoModal } = this.props.relaxProps;
    const err = (window as any).RCi18n({id:'Setting.theVideoToMoveFirst'});
    if (videoList.filter((item) => item.get('checked') == true).size < 1) {
      message.error(err);
      return;
    }
    showMoveVideoModal(true);
  };

  /**
   * 修改视频名称
   * @param videoId
   * @private
   */
  _updateVideo = (e, oldVal, videoId: string) => {
    //修改了视频名称才真正的请求接口进行修改
    if (e.target.value != oldVal) {
      if (!e.target.value.trim()) {
        const err = (window as any).RCi18n({id:'Setting.PleaseInputAFileName'});
        message.error(err);
        return false;
      }

      if (/(\ud83c[\udf00-\udfff])|(\ud83d[\udc00-\ude4f])|(\ud83d[\ude80-\udeff])/.test(e.target.value)) {
        const err = (window as any).RCi18n({id:'Setting.theCorrectFormat'});
        message.error(err);
        return false;
      }

      if (e.target.value.length > 40) {
        const err = (window as any).RCi18n({id:'Setting.FileNameIsTooLong'});
        message.error(err);
        return false;
      }

      const { editVideo } = this.props.relaxProps;
      editVideo(videoId, e.target.value);
    }
  };

  /**
   * 全选
   * @param e
   * @private
   */
  _onchangeCheckedAll = (e) => {
    const { onCheckedAll } = this.props.relaxProps;
    const checked = (e.target as any).checked;
    onCheckedAll(checked);
  };

  /**
   * 单选
   * @param index
   * @param e
   * @private
   */
  _onchangeChecked = (index, e) => {
    const { onChecked } = this.props.relaxProps;
    const checked = (e.target as any).checked;
    onChecked(index, checked);
  };

  /**
   * 分页
   * @param pageNum
   * @param pageSize
   * @private
   */
  _toCurrentPage = (pageNum: number, pageSize: number) => {
    const { queryVideoPage } = this.props.relaxProps;
    //如果选中分类，则分页要在该分类下进行
    queryVideoPage({ pageNum: pageNum - 1, pageSize: pageSize });
  };
}

export default injectIntl(VideoList);

const styles = {
  greyHeader: {
    backgroundColor: '#f7f7f7',
    height: '40px',
    paddingLeft: '10px',
    paddingRight: '10px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  } as any,
  boxItem: {
    paddingLeft: '10px',
    paddingRight: '10px',
    display: 'flex',
    height: '80px',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  videoItem: {
    display: 'inline-block',
    width: '30%',
    textAlign: 'center',
    wordBreak: 'break-all',
    paddingLeft: '10px',
    paddingRight: '10px'
  },
  page: {
    float: 'right',
    marginTop: '20px',
    marginBottom: '20px'
  }
} as any;
