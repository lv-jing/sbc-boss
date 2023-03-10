import * as React from 'react';
import { Relax } from 'plume2';

import { fromJS, List } from 'immutable';
import { Const, noop, QMUpload } from 'qmkit';
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  message,
  Modal,
  Pagination,
  Row,
  Tree
} from 'antd';
import { clickVideosCountQL } from '../ql';

const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;
const FILE_MAX_SIZE = 50 * 1024 * 1024;

@Relax
export default class VideoModal extends React.Component<any, any> {
  static relaxProps = {
    videoCateId: 'videoCateId',
    expandedKeys: 'expandedKeys',
    videoCateIds: 'videoCateIds',
    resCateList: 'resCateList',
    videoName: 'videoName',
    tvisible: 'tvisible',
    videoList: 'videoList',
    videoCurrentPage: 'videoCurrentPage',
    videoTotal: 'videoTotal',
    pageSize: 'pageSize',
    videoSearchName: 'videoSearchName',
    images: 'images',
    clickVideosCount: clickVideosCountQL,
    imgType: 'imgType',

    initVideo: noop,
    editVideoCateId: noop,
    editVideoDefaultCateId: noop,
    modalVisible: noop,
    videoSearch: noop,
    saveVideoSearchName: noop,
    editImages: noop,
    chooseImg: noop,
    beSureVideos: noop,
    cleanChooseVideo: noop,
    onCheckedVideo: noop,
    removeVideo: noop
  };
  props: {
    relaxProps?: {
      videoCateId: any;
      expandedKeys: any;
      videoCateIds: List<any>;
      resCateList: List<any>;
      videoName: string;
      tvisible: boolean;
      videoList: List<any>;
      videoCurrentPage: number;
      videoTotal: number;
      pageSize: number;
      videoSearchName: string;
      images: List<any>;
      clickVideosCount: number;
      clickEnabled: boolean;
      imgType: number;

      initVideo: Function;
      editVideoCateId: Function;
      editVideoDefaultCateId: Function;
      modalVisible: Function;
      videoSearch: Function;
      saveVideoSearchName: Function;
      editImages: Function;
      chooseImg: Function;
      beSureVideos: Function;
      cleanChooseVideo: Function;
      onCheckedVideo: Function; //??????
      removeVideo: Function;
    };
  };
  state = {
    tvisible: true,
    successCount: 0, // ??????????????????
    uploadCount: 0, // ???????????????
    errorCount: 0, // ??????????????????
    fileList: [] // ??????????????????
  };
  handleCancel = () => {
    const { modalVisible, imgType } = this.props.relaxProps;
    modalVisible(0, imgType, '');
    this.setState({
      successCount: 0,
      uploadCount: 0,
      errorCount: 0
    });
  };
  /**
   * ????????????
   * @param value ?????????id
   * @private
   */
  _select = (value) => {
    const {
      editVideoCateId,
      editVideoDefaultCateId,
      videoSearch,
      saveVideoSearchName,
      initVideo,
      cleanChooseVideo
    } = this.props.relaxProps;
    const cateId = value[0];
    // ?????????????????????????????????????????????????????????????????????
    if (cateId || cateId == 0) {
      //???????????????????????????????????????????????????
      editVideoCateId(cateId);
      editVideoDefaultCateId(cateId);
      videoSearch('');
      saveVideoSearchName('');
      initVideo({ pageNum: 0, cateId: cateId, successCount: 0 });
      cleanChooseVideo();
    }
  };
  /**
   * ??????????????????
   */
  _editSearchData = (e) => {
    const { videoSearch } = this.props.relaxProps;
    videoSearch(e.target.value);
  };
  /**
   * ??????
   */
  _search = () => {
    const {
      videoName,
      saveVideoSearchName,
      initVideo,
      videoCateId
    } = this.props.relaxProps;
    saveVideoSearchName(videoName);
    //resourceType 1?????????
    initVideo({ pageNum: 0, cateId: videoCateId, successCount: 0 });
  };
  /**
   * ??????
   * @param index
   * @param e
   * @private
   */
  _onchangeChecked = (e, v) => {
    const { onCheckedVideo } = this.props.relaxProps;
    const checked = (e.target as any).checked;
    onCheckedVideo({ video: v, checked: checked });
  };
  /**
   * ??????
   * @param pageNum
   * @private
   */
  _toCurrentPage = (pageNum: number) => {
    const { initVideo, videoCateId } = this.props.relaxProps;
    //??????????????????????????????????????????????????????
    initVideo({
      pageNum: pageNum - 1,
      cateId: videoCateId,
      successCount: 0
    });
  };
  /**
   * ????????????
   */
  _editImages = async (info) => {
    const { file } = info;
    const { initVideo, videoCateId } = this.props.relaxProps;
    const status = file.status;
    let fileList = info.fileList;

    if (status === 'done') {
      if (
        file.response &&
        file.response.code &&
        file.response.code !== Const.SUCCESS_CODE
      ) {
        this.setState({
          errorCount: this.state.errorCount + 1
        });
      } else {
        this.setState({
          successCount: this.state.successCount + 1
        });
        message.success(`${file.name} ???????????????`);
      }
    } else if (status === 'error') {
      this.setState({
        errorCount: this.state.errorCount + 1
      });
    }

    //?????????????????????????????????
    fileList = fileList.filter((f) => f.status == 'uploading');
    this.setState({ fileList });

    if (
      this.state.successCount > 0 &&
      this.state.successCount + this.state.errorCount === this.state.uploadCount
    ) {
      await initVideo({
        pageNum: 0,
        cateId: videoCateId,
        successCount: this.state.successCount
      });
      this.setState({
        successCount: 0,
        errorCount: 0,
        uploadCount: 0
      });
    }
  };
  /**
   * ??????????????????
   */
  _checkUploadFile = (file, fileList) => {
    this.setState({
      uploadCount: fileList.length,
      errorCount: 0
    });
    if (fileList.length > 1) {
      if (fileList.filter((f) => f.uid).length == fileList.length) {
        message.error('?????????????????????????????????');
      }
      return false;
    }
    let fileName = file.name.toLowerCase();
    // ????????????????????????jpg???jpeg???png???gif
    if (fileName.endsWith('.mp4')) {
      if (file.size <= FILE_MAX_SIZE) {
        return true;
      } else {
        message.error('????????????????????????50M');
        return false;
      }
    } else {
      message.error('??????????????????');
      return false;
    }
  };
  /**
   * ?????????????????????
   * @private
   */
  _handleOk = () => {
    const { beSureVideos, modalVisible, imgType } = this.props.relaxProps;
    beSureVideos();
    modalVisible(1, imgType);
    this.setState({
      successCount: 0,
      uploadCount: 0,
      errorCount: 0
    });
  };
  /**
   * ?????????????????????
   * @private
   */
  _handleUploadClick = () => {
    const { videoCateId, cleanChooseVideo } = this.props.relaxProps;
    if (videoCateId) {
      cleanChooseVideo();
    } else {
      message.error('?????????????????????');
    }
  };
  _videoDetail = (videoUrl: string) => {
    //???????????????????????????
    let tempWindow = window.open();
    tempWindow.location.href = `/video-detail?videoUrl=${videoUrl}`;
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {
      expandedKeys,
      videoCateIds,
      resCateList,
      videoName,
      tvisible,
      videoList,
      videoCurrentPage,
      videoTotal,
      pageSize,
      clickVideosCount,
      videoCateId
    } = this.props.relaxProps;

    //??????????????????????????????
    const loop = (cateList) =>
      cateList.map((item) => {
        if (item.get('children') && item.get('children').count()) {
          return (
            <TreeNode
              key={item.get('cateId')}
              value={item.get('cateId')}
              title={item.get('cateName')}
            >
              {loop(item.get('children'))}
            </TreeNode>
          );
        }
        return (
          <TreeNode
            key={item.get('cateId')}
            value={item.get('cateId')}
            title={item.get('cateName')}
          />
        );
      });
    return (
       <Modal  maskClosable={false}
        title={
          <div style={styles.title}>
            <h4>?????????</h4>
            <span style={styles.grey}>
              ??????<strong style={styles.dark}>{clickVideosCount}</strong>???
              ????????????<strong style={styles.dark}>1</strong>???
            </span>
          </div>
        }
        visible={tvisible}
        width={880}
        onCancel={this.handleCancel}
        onOk={() => this._handleOk()}
      >
        <div>
          <Row style={styles.header}>
            <Col span={3}>
              <QMUpload
                name="uploadFile"
                onChange={this._editImages}
                showUploadList={{
                  showPreviewIcon: false,
                  showRemoveIcon: false
                }}
                action={
                  Const.HOST +
                  `/store/uploadStoreResource?cateId=${videoCateId}&resourceType=VIDEO`
                }
                multiple={true}
                disabled={videoCateId ? false : true}
                accept={'.mp4'}
                beforeUpload={this._checkUploadFile}
                fileList={this.state.fileList}
              >
                <Button size="large" onClick={() => this._handleUploadClick()}>
                  ????????????
                </Button>
              </QMUpload>
            </Col>
            <Col span={10}>
              <Form layout="inline">
                <FormItem>
                  <Input
                    placeholder="???????????????"
                    value={videoName}
                    onChange={(e) => this._editSearchData(e)}
                  />
                </FormItem>
                <FormItem>
                  <Button onClick={() => this._search()} type="primary" htmlType="submit">
                    ??????
                  </Button>
                </FormItem>
              </Form>
            </Col>
          </Row>
          <Row>
            <Col span={4}>
              <div style={{ height: 560, overflowY: 'scroll' }}>
                <Tree
                  className="draggable-tree"
                  defaultExpandedKeys={expandedKeys.toJS()}
                  defaultSelectedKeys={videoCateIds.toJS()}
                  selectedKeys={videoCateIds.toJS()}
                  onSelect={this._select}
                >
                  {loop(resCateList)}
                </Tree>
              </div>
            </Col>
            <Col span={1} />
            <Col span={19}>
              <div>
                <div style={styles.greyHeader}>
                  <span style={styles.videoItemSmall} />
                  <span style={styles.videoItemMid}>????????????</span>
                  <span style={styles.videoItemLarge}>????????????</span>
                </div>
                <div>
                  {(videoList || fromJS([])).map((item) => {
                    return (
                      <div style={styles.boxItem} key={item.get('resourceId')}>
                        <div style={styles.videoItemSmall}>
                          <Checkbox
                            checked={item.get('checked')}
                            onChange={(e) => this._onchangeChecked(e, item)}
                            style={{ width: '10%', display: 'inline-block' }}
                          />
                        </div>
                        <div style={styles.videoItemMid}>
                          <p style={styles.videoItemText}>
                            {item.get('resourceName')}
                          </p>
                        </div>
                        <div style={styles.videoItemLarge}>
                          <a
                            onClick={this._videoDetail.bind(
                              this,
                              item.get('artworkUrl')
                            )}
                            style={styles.videoItem}
                          >
                            {item.get('artworkUrl')}
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              {(videoList || fromJS([])).size > 0 ? null : (
                <div
                  style={{
                    textAlign: 'center',
                    fontSize: '12px',
                    color: 'rgba(0, 0, 0, 0.43)',
                    marginTop: '20px'
                  }}
                >
                  <span>
                    <i className="anticon anticon-frown-o" />????????????
                  </span>
                </div>
              )}
            </Col>
          </Row>
          {(videoList || fromJS([])).size > 0 ? (
            <Pagination
              onChange={(pageNum) => this._toCurrentPage(pageNum)}
              current={videoCurrentPage}
              total={videoTotal}
              pageSize={pageSize}
            />
          ) : null}
        </div>
      </Modal>
    );
  }
}

const styles = {
  header: {
    paddingBottom: 15,
    borderBottom: '1px solid #ddd'
  },
  greyHeader: {
    backgroundColor: '#f7f7f7',
    height: '40px',
    paddingLeft: '10px',
    paddingRight: '10px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  } as any,
  box: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: '20px'
  } as any,
  navItem: {
    width: 120,
    marginBottom: 15,
    marginRight: 14
  },
  boxItem: {
    paddingLeft: '10px',
    paddingRight: '10px',
    display: 'flex',
    height: '80px',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  detail: {
    height: '20px',
    lineHeight: '20px',
    overflow: 'hidden'
  },
  videoItemSmall: {
    display: 'inline-block',
    width: '20%',
    textAlign: 'center'
  },
  videoItemMid: {
    display: 'inline-block',
    width: '30%',
    textAlign: 'center'
  },
  videoItemLarge: {
    display: 'inline-block',
    width: '50%',
    textAlign: 'center'
  },
  videoItemText: {
    width: '95%',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden'
  },
  page: {
    float: 'right',
    marginTop: '20px',
    marginBottom: '20px'
  },
  title: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  grey: {
    fontSize: 12,
    color: '#999999',
    marginLeft: 10
  },
  dark: {
    color: '#333333'
  },
  name: {
    height: 20,
    overflow: 'hidden',
    width: '100%',
    marginTop: 5,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }
} as any;
