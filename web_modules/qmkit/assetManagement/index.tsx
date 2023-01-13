import * as React from 'react';
import { QMUpload, Const } from 'qmkit';
import { Modal, Form, Input, message, Tree, Row, Col, Button, Checkbox, Pagination, Spin, Icon } from 'antd';
import * as webapi from './webapi';


const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;
const FILE_MAX_SIZE = 2 * 1024 * 1024;

export default class PicModal extends React.Component<any, any> {


  props: {
    choosedImgCount : number;
    images: Array<String>;
    selectImgFunction: Function;
    deleteImgFunction: Function;
  };


  constructor(props) {
    super(props);
  }

  state = {
    visible: false,
    cateList: [],
    imgs: null,
    //已选中的 img 数量
    clickImgsCount: 0,
    
    cateId: '',
    searchImageName: '',
    cateIds: [],
    loading: false,

    currentPage: 1,
    total: 0,
    pageSize: 10,

    currentSelectedImgs: [],



    successCount: 0, // 成功上传数量
    uploadCount: 0, // 总上传数量
    errorCount: 0, // 失败上传数量
    fileList: [], // 上传文件列表

    previewVisible: false,
    previewImage: '',
    //能选中的 img 数量
    choosedImgCount: 1,
    images:null,
  };

  static getDerivedStateFromProps(props, state) {

    
    // 当传入的值发生变化的时候，更新state
      return {
        choosedImgCount: props.choosedImgCount,
        images: props.images,
      };
  }


  handleCancel = () => {
    this.setState({
      successCount: 0,
      uploadCount: 0,
      errorCount: 0,
      visible: false
    });
  };

  //获取
  getCateList = () => {
    this.setState({
      loading: true
    })
    webapi.getImgCates().then(data => {
      const { res } = data
      if (res) {
        let storeResourceCateList = res.context.storeResourceCateVOList
        let cateList = this.cates(storeResourceCateList)
        let cateId = cateList[0].cateId.toString()
        let cateIds = []
        cateIds.push(cateId)
        this.setState({
          cateId,
          cateIds,
          cateList
        }, () => {
          this.initImages()
        })
      } else {
        this.setState({
          loading: false
        })
      }
    }).catch(err => {
      this.setState({
        loading: false
      })
      message.error(err.toString() || 'Operation failure')
    })

  }

  getImages = () => {
    const { cateIds, currentPage, pageSize, searchImageName } = this.state
    this.setState({
      loading: true
    })
    let params = {
      cateIds: cateIds,
      pageNum: currentPage - 1,
      pageSize: pageSize,
      resourceName: searchImageName,
      resourceType: 0,
    }
    webapi.fetchImages(params).then(data => {
      const { res } = data
      if (res.code === Const.SUCCESS_CODE) {
        let imgs = res.context.content
        let total = res.context.total
        if (imgs) {
          this.setState({
            imgs,
            total,
            loading: false
          }, () => {
            this.showSelected()
          })
        }

      } else {
        this.setState({
          loading: false
        })
       
      }
    }).catch(err => {
      this.setState({
        loading: false
      })
     
    })
  }

  initImages = () => {
    this.setState({
      currentPage: 1,
      searchImageName: ""
    }, () => {
      this.getImages()
    })

  }

  /**
  * 修改搜索数据
  */
  editSearchData = (e) => {
    this.setState({
      searchImageName: e.target.value
    })
  };
  // 改变数据形态，变为层级结构
  cates(cateList) {
    // 改变数据形态，变为层级结构
    const newDataList = cateList
      .filter((item) => item.cateParentId === 0)
      .map((data) => {
        const children = cateList
          .filter((item) => item.cateParentId == data.cateId)
          .map((childrenData) => {
            const lastChildren = cateList.filter((item) => item.cateParentId === childrenData.cateId);
            if (!lastChildren) {
              childrenData.children = lastChildren;
            }
            return childrenData;
          });

        if (children) {
          data.children = children;
        }
        return data;
      });
    return newDataList;
  }
  /**
   * 选择分类
   * @param value 选中的id
   * @private
   */
  selectCate = (value) => {
    this.setState({
      currentPage: 1,
      cateIds: value
    }, () => {
      this.getImages()
    })

  };



  /**
   * 查询
   */
  search = () => {
    this.setState({
      currentPage: 1
    }, () => {
      this.getImages()
    })
  };

  /**
   * 分页
   * @param pageNum
   * @private
   */
  handlePageChange = (page) => {
    this.setState({
      currentPage: page
    }, () => {
      this.getImages()
    })

  };

  /**
   * 改变图片
   */
  uploadImages = async (info) => {
    const { file } = info;
    const status = file.status;
    let fileList = info.fileList;
    if (status === 'done') {
      if (file.response && file.response.code && file.response.code !== Const.SUCCESS_CODE) {
        this.setState({
          errorCount: this.state.errorCount + 1
        });
      } else {
        this.setState({
          successCount: this.state.successCount + 1
        });
        message.success(`${file.name} upload successfull`);
      }
    } else if (status === 'error') {
      this.setState({
        errorCount: this.state.errorCount + 1
      });
    }
    //仅展示上传中的文件列表
    fileList = fileList.filter((f) => f.status == 'uploading');
    this.setState({ fileList });
    if (this.state.successCount > 0 && this.state.successCount + this.state.errorCount === this.state.uploadCount) {
      this.initImages()

      this.setState({
        successCount: 0,
        errorCount: 0,
        uploadCount: 0
      });
    }
  };

  /**
   * 检查文件格式
   */
  checkUploadFile = (file, fileList) => {
    const { choosedImgCount } = this.state;
    this.setState({
      uploadCount: fileList.length,
      errorCount: 0
    });
    if (fileList.length > choosedImgCount) {
      if (fileList.filter((f) => f.uid).length == fileList.length) {
        message.error(`Upload up to ${choosedImgCount} pictures at a time`);
      }
      return false;
    }
    let fileName = file.name.toLowerCase();
    // 支持的图片格式：jpg、jpeg、png、gif
    if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileName.endsWith('.png') || fileName.endsWith('.gif')) {
      if (file.size <= FILE_MAX_SIZE) {
        return true;
      } else {
        message.error('The file size cannot exceed 2M');
        return false;
      }
    } else {
      message.error('File format error');
      return false;
    }
  };

  /**
   * 点击图片
   * @param e
   * @param v
   * @private
   */
  chooseImg = (e, v) => {
    const { choosedImgCount, clickImgsCount, imgs, currentSelectedImgs } = this.state;
    const checked = (e.target as any).checked;
    if (choosedImgCount > clickImgsCount || !checked) {
      let tempSelectedImgs = currentSelectedImgs.concat()
      const tempImgs = imgs.filter(item => {
        if (item.resourceId === v.resourceId) {
          item.checked = checked
        }
        if (item.checked === true) {
          tempSelectedImgs.push(item)
        }
        if (item.checked === false) {
          tempSelectedImgs = tempSelectedImgs.filter(el => el.resourceId !== v.resourceId)
        }
        return item
      })
      this.setState({
        imgs: tempImgs,
        currentSelectedImgs: tempSelectedImgs,
        clickImgsCount: tempSelectedImgs.length
      })
    }
    else {
      message.error('A maximum of ' + choosedImgCount + ' items can be selected')
    }
  };

  /**
   * 确认选择的图片
   * @private
   */
  handleOk = () => {
    const { currentSelectedImgs } = this.state
    let tempImages = []
    for (let i = 0; i < currentSelectedImgs.length; i++) {
      tempImages.push(currentSelectedImgs[i].artworkUrl)
      
    }
    this.setState({
      images:tempImages,
      visible:false,
      successCount: 0,
      uploadCount: 0,
      errorCount: 0
    });
    this.props.selectImgFunction(tempImages)
  };

  /**
   * 清除选中的图片
   * @private
   */
  handleUploadClick = () => {
    const { cateId } = this.state;
    if (cateId) {
      this.setState({
        currentSelectedImgs: []
      })

    } else {
      message.error('Please select picture category');
    }
  };


  // 选中回显
  showSelected = () => {
    const { currentSelectedImgs } = this.state
    let tempImgs = this.state.imgs
    for (let i = 0; i < currentSelectedImgs.length; i++) {
      for (let j = 0; j < tempImgs.length; j++) {
        if (currentSelectedImgs[i].resourceId === tempImgs[j].resourceId) {
          tempImgs[j].checked = currentSelectedImgs[i].checked
        }
      }
    }
    this.setState({
      imgs: tempImgs,
      clickImgsCount: currentSelectedImgs.length
    })
  }

  openAsset = () => {
    this.setState({
      visible: true,
      currentSelectedImgs: []
    }, () => {
      this.getCateList()
    })
  }
  clickImg = (item) => {
    this.setState({
      previewVisible:true,
      previewImage:item
    })
  }

  removeImg = (item) => {
    this.props.deleteImgFunction(item)
  }


  render() {
    const { visible,
      cateList, choosedImgCount, clickImgsCount, cateId,
      searchImageName, cateIds, imgs, currentPage, total, pageSize,
      loading, previewVisible, previewImage,images } = this.state

    //分类列表生成树形结构
    const loop = (cateList) =>
      cateList.map((item) => {
        if (item.children && item.children.length > 0) {
          return (
            <TreeNode key={item.cateId} value={item.cateId} title={item.cateName}>
              {loop(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.cateId} value={item.cateId} title={item.cateName} />;
      });

    return (
      <div>

        {images && images.map((item, index) => {
          return (
            <div key={index}>
              <div className="ant-upload-list ant-upload-list-picture-card">
                <div className="ant-upload-list-item ant-upload-list-item-done">
                  <div className="ant-upload-list-item-info">
                    <span>
                      <a className="ant-upload-list-item-thumbnail" target="_blank" rel="noopener noreferrer">
                        <img src={item} alt="" />
                      </a>
                    </span>
                  </div>
                  <span className="ant-upload-list-item-actions">
                    <i className="anticon anticon-eye-o" onClick={() => this.clickImg(item)}>
                      <Icon type="eye" />
                    </i>
                    <i
                      title="Remove file"
                      onClick={() =>
                        this.removeImg(item)
                      }
                      className="anticon anticon-delete"
                    >
                      <Icon type="delete" />
                    </i>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        {images && images.length < choosedImgCount ? (
          <div onClick={() => this.openAsset()} style={styles.addImg}>
            <div style={styles.imgBox}>
              <Icon type="plus" style={styles.plus} />
            </div>
          </div>
        ) : null}

        <Modal zIndex={1001} visible={previewVisible} footer={null} onCancel={() =>
          this.setState({
            previewVisible: false
          })

        }>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>

        <Modal
          maskClosable={false}
          zIndex={1001}
          title={
            <div style={styles.title}>
              <h4>Picture library</h4>
              {
                choosedImgCount > 1 ? (<span style={styles.grey}>
                  <strong style={styles.dark}>{clickImgsCount}</strong> has been selected and up to <strong style={styles.dark}>{choosedImgCount}</strong> can be selected
                </span>) : null
              }

            </div>
          }
          visible={visible}
          width={880}
          onCancel={this.handleCancel}
          onOk={() => this.handleOk()}
        >
          <div>
            <Row style={styles.header}>
              <Col span={4}>
                <QMUpload
                  name="uploadFile"
                  onChange={this.uploadImages}
                  showUploadList={{
                    showPreviewIcon: false,
                    showRemoveIcon: false
                  }}
                  action={Const.HOST + `/store/uploadStoreResource?cateId=${cateId}&resourceType=IMAGE`}
                  multiple={true}
                  disabled={cateId ? false : true}
                  accept={'.jpg,.jpeg,.png,.gif'}
                  beforeUpload={this.checkUploadFile}
                  fileList={this.state.fileList}
                >
                  <Button size="large" onClick={() => this.handleUploadClick()}>
                    Local upload
                </Button>
                </QMUpload>
              </Col>
              <Col span={10}>
                <Form layout="inline">
                  <FormItem>
                    <Input placeholder="Please enter the content" value={searchImageName} onChange={(e) => this.editSearchData(e)} />
                  </FormItem>
                  <FormItem>
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        this.search();
                      }}
                      type="primary"
                      icon="search"
                      shape="round"
                      htmlType="submit"
                    >
                      Search
                  </Button>
                  </FormItem>
                </Form>
              </Col>
            </Row>
            <Spin spinning={loading}>
              <Row>
                <Col span={6}>
                  <div style={{ height: 560, overflowY: 'auto', borderRight: '1px solid #f6f6f6' }}>
                    <Tree className="draggable-tree"
                      defaultExpandedKeys={cateIds}
                      defaultSelectedKeys={cateIds}
                      selectedKeys={cateIds}
                      onSelect={this.selectCate}>
                      {loop(cateList)}
                    </Tree>
                  </div>
                </Col>
                <Col span={1} />
                <Col span={17}>
                  <div style={styles.box}>
                    {imgs && imgs.map((v, k) => {
                      return (
                        <div style={styles.navItem} key={k}>
                          <div style={styles.boxItem}>
                            <Checkbox className="big-check" checked={v.checked} onChange={(e) => this.chooseImg(e, v)} />
                            <img src={v.artworkUrl} alt="" width="100" height="100" />
                          </div>
                          <p style={styles.name}>{v.resourceName}</p>
                        </div>
                      );
                    })}
                  </div>
                  {imgs && imgs.length > 0 ? null : (
                    <div
                      style={{
                        textAlign: 'center',
                        fontSize: '12px',
                        color: 'rgba(0, 0, 0, 0.43)'
                      }}
                    >
                      <span>
                        <i className="anticon anticon-frown-o" />
                    No data
                  </span>
                    </div>
                  )}
                </Col>
              </Row>
              {imgs && imgs.length > 0 ? <Pagination onChange={this.handlePageChange} current={currentPage} total={total} pageSize={pageSize} /> : null}
            </Spin>

          </div>
        </Modal>

      </div>
    );
  }


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
  },

  plus: {
    color: '#999',
    fontSize: '28px'
  },
  addImg: {
    border: '1px dashed #d9d9d9',
    width: 96,
    height: 96,
    borderRadius: 4,
    textAlign: 'center',
    display: 'inline-block',
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#fbfbfb',
    cursor: 'pointer'
  },
  imgBox: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItem: 'center',
    justifyContent: 'center',
    padding: '32px 0'
  },
} as any;
