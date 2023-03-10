import * as React from 'react';
import { Relax } from 'plume2';

import { fromJS } from 'immutable';
import { noop, QMUpload, Const } from 'qmkit';
import {
  Modal,
  Form,
  Input,
  message,
  Tree,
  Row,
  Col,
  Button,
  Checkbox,
  Pagination
} from 'antd';
import { List } from 'immutable';

import { choosedImgCountQL, clickImgsCountQL, clickEnabledQL } from '../ql';

const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;
const FILE_MAX_SIZE = 2 * 1024 * 1024;

@Relax
export default class PicModal extends React.Component<any, any> {
  props: {
    relaxProps?: {
      cateId: any;
      expandedKeys: any;
      cateIds: List<any>;
      resCateList: List<any>;
      imageName: string;
      visible: boolean;
      imgs: List<any>;
      currentPage: number;
      total: number;
      pageSize: number;
      searchName: string;
      images: List<any>;
      choosedImgCount: number;
      clickImgsCount: number;
      clickEnabled: boolean;
      imgType: number;

      initResource: Function;
      editCateId: Function;
      editDefaultCateId: Function;
      modalVisible: Function;
      search: Function;
      saveSearchName: Function;
      editImages: Function;
      chooseImg: Function;
      beSureImages: Function;
      cleanChooseImgs: Function;
      queryResourcePage: Function;
    };
  };

  static relaxProps = {
    cateId: 'cateId',
    expandedKeys: 'expandedKeys',
    cateIds: 'cateIds',
    resCateList: 'resCateList',
    imageName: 'imageName',
    visible: 'visible',
    imgs: 'imgs',
    currentPage: 'currentPage',
    total: 'total',
    pageSize: 'pageSize',
    searchName: 'searchName',
    images: 'images',
    choosedImgCount: choosedImgCountQL,
    clickImgsCount: clickImgsCountQL,
    clickEnabled: clickEnabledQL,
    imgType: 'imgType',

    initResource: noop,
    editCateId: noop,
    editDefaultCateId: noop,
    modalVisible: noop,
    search: noop,
    saveSearchName: noop,
    editImages: noop,
    chooseImg: noop,
    beSureImages: noop,
    cleanChooseImgs: noop,
    queryResourcePage: noop
  };

  constructor(props) {
    super(props);
  }

  state = {
    visible: true,
    successCount: 0, // ??????????????????
    uploadCount: 0, // ???????????????
    errorCount: 0 // ??????????????????
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

  render() {
    const {
      expandedKeys,
      cateIds,
      resCateList,
      imageName,
      visible,
      imgs,
      currentPage,
      total,
      pageSize,
      clickImgsCount,
      choosedImgCount,
      cateId
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
              ??????<strong style={styles.dark}>{clickImgsCount}</strong>???
              ????????????<strong style={styles.dark}>{choosedImgCount}</strong>???
            </span>
          </div>
        }
        visible={visible}
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
                showUploadList={false}
                action={
                  Const.HOST +
                  `/uploadResource?cateId=${cateId}&resourceType=IMAGE`
                }
                multiple={true}
                disabled={cateId ? false : true}
                accept={'.jpg,.jpeg,.png,.gif'}
                beforeUpload={this._checkUploadFile}
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
                    value={imageName}
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
                  defaultSelectedKeys={cateIds.toJS()}
                  selectedKeys={cateIds.toJS()}
                  onSelect={this._select}
                >
                  {loop(resCateList)}
                </Tree>
              </div>
            </Col>
            <Col span={1} />
            <Col span={19}>
              <div style={styles.box}>
                {(imgs || fromJS([])).map((v, k) => {
                  return (
                    <div style={styles.navItem} key={k}>
                      <div style={styles.boxItem}>
                        <Checkbox
                          className="big-check"
                          checked={v.get('checked')}
                          onChange={(e) => this._chooseImg(e, v)}
                        />
                        <img
                          src={v.get('artworkUrl')}
                          alt=""
                          width="100"
                          height="100"
                        />
                      </div>
                      <p style={styles.name}>{v.get('resourceName')}</p>
                    </div>
                  );
                })}
              </div>
              {(imgs || fromJS([])).size > 0 ? null : (
                <div
                  style={{
                    textAlign: 'center',
                    fontSize: '12px',
                    color: 'rgba(0, 0, 0, 0.43)'
                  }}
                >
                  <span>
                    <i className="anticon anticon-frown-o" />????????????
                  </span>
                </div>
              )}
            </Col>
          </Row>
          {(imgs || fromJS([])).size > 0 ? (
            <Pagination
              onChange={(pageNum) => this._toCurrentPage(pageNum, pageSize)}
              current={currentPage}
              total={total}
              pageSize={pageSize}
            />
          ) : null}
        </div>
      </Modal>
    );
  }

  /**
   * ????????????
   * @param value ?????????id
   * @private
   */
  _select = (value) => {
    const {
      editCateId,
      editDefaultCateId,
      search,
      saveSearchName,
      cleanChooseImgs,
      queryResourcePage
    } = this.props.relaxProps;
    const cateId = value[0];
    // ?????????????????????????????????????????????????????????????????????
    if (cateId || cateId == 0) {
      //???????????????????????????????????????????????????
      editCateId(cateId);
      editDefaultCateId(cateId);
      search('');
      saveSearchName('');
      queryResourcePage({
        pageNum: 0,
        pageSize: 10,
        resourceType: 0,
        successCount: 0
      });
      cleanChooseImgs();
    }
  };

  /**
   * ??????????????????
   */
  _editSearchData = (e) => {
    const { search } = this.props.relaxProps;
    search(e.target.value);
  };

  /**
   * ??????
   */
  _search = () => {
    const {
      queryResourcePage,
      imageName,
      saveSearchName
    } = this.props.relaxProps;
    saveSearchName(imageName);
    queryResourcePage({
      pageNum: 0,
      pageSize: 10,
      resourceType: 0,
      successCount: 0
    });
  };

  /**
   * ??????
   * @param pageNum
   * @private
   */
  _toCurrentPage = (pageNum: number, pageSize: number) => {
    const { queryResourcePage } = this.props.relaxProps;
    //??????????????????????????????????????????????????????
    queryResourcePage({
      pageNum: pageNum - 1,
      pageSize: pageSize,
      resourceType: 0,
      successCount: 0
    });
  };

  /**
   * ????????????
   */
  _editImages = async (info) => {
    const { file } = info;
    const { queryResourcePage } = this.props.relaxProps;
    const status = file.status;
    if (status === 'done') {
      this.setState({
        successCount: this.state.successCount + 1
      });
      message.success(`${file.name} ???????????????`);
    } else if (status === 'error') {
      this.setState({
        errorCount: this.state.errorCount + 1
      });
      message.error(`${file.name} ???????????????`);
    }
    if (
      this.state.successCount > 0 &&
      this.state.successCount + this.state.errorCount === this.state.uploadCount
    ) {
      await queryResourcePage({
        pageNum: 0,
        pageSize: 10,
        resourceType: 0,
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
    const { choosedImgCount } = this.props.relaxProps;
    this.setState({
      uploadCount: fileList.length
    });
    if (fileList.length > choosedImgCount) {
      if (fileList.filter((f) => f.uid).length == fileList.length) {
        message.error(`?????????????????????${choosedImgCount}?????????`);
      }
      return false;
    }
    let fileName = file.name.toLowerCase();
    // ????????????????????????jpg???jpeg???png???gif
    if (
      fileName.endsWith('.jpg') ||
      fileName.endsWith('.jpeg') ||
      fileName.endsWith('.png') ||
      fileName.endsWith('.gif')
    ) {
      if (file.size <= FILE_MAX_SIZE) {
        return true;
      } else {
        message.error('????????????????????????2M');
        return false;
      }
    } else {
      message.error('??????????????????');
      return false;
    }
  };

  /**
   * ????????????
   * @param e
   * @param v
   * @private
   */
  _chooseImg = (e, v) => {
    const { chooseImg, clickEnabled, choosedImgCount } = this.props.relaxProps;
    const checked = (e.target as any).checked;
    if (clickEnabled || choosedImgCount == 1 || !checked) {
      chooseImg({ check: checked, img: v, chooseCount: choosedImgCount });
    }
  };

  /**
   * ?????????????????????
   * @private
   */
  _handleOk = () => {
    const { beSureImages, modalVisible, imgType } = this.props.relaxProps;
    beSureImages();
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
    const { cateId, cleanChooseImgs } = this.props.relaxProps;
    if (cateId) {
      cleanChooseImgs();
    } else {
      message.error('?????????????????????');
    }
  };
}

const styles = {
  header: {
    paddingBottom: 15,
    borderBottom: '1px solid #ddd'
  },
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
    width: '120px',
    height: '120px',
    padding: '10px',
    position: 'relative',
    border: '1px solid #ddd',
    borderRadius: '4px'
  },
  detail: {
    height: '20px',
    lineHeight: '20px',
    overflow: 'hidden'
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
