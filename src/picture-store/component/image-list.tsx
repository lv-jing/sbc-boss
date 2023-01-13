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
class ImageList extends React.Component<any, any> {
  props: {
    intl?:any;
    relaxProps?: {
      imageList: IList; //图片列表
      queryImagePage: Function; //初始化
      onCheckedAll: Function; //全选
      onChecked: Function; //单选
      doDelete: Function; //删除
      showMoveImageModal: Function; //移动图片弹窗
      editImage: Function; //编辑图片名称
      currentPage: number; //分页
      total: number; //分页
      pageSize: number; //分页
      allChecked: boolean;
    };
  };

  static relaxProps = {
    imageList: 'imageList',
    queryImagePage: noop,
    onCheckedAll: noop,
    onChecked: noop,
    doDelete: noop,
    showMoveImageModal: noop,
    editImage: noop,
    currentPage: 'currentPage',
    total: 'total',
    pageSize: 'pageSize',
    allChecked: allCheckedQL
  };

  render() {
    const { imageList, currentPage, total, pageSize, allChecked } = this.props.relaxProps;
    return (
      <div>
        <div style={styles.greyHeader}>
          <Checkbox checked={allChecked} onChange={this._onchangeCheckedAll.bind(this)}>
            <FormattedMessage id="Setting.selectAll" />
          </Checkbox>
          <AuthWrapper functionName="f_image_del">
            <Tooltip placement="top" title={<FormattedMessage id="Setting.Delete" />}>
              <a onClick={this._delete} style={styles.link} className="iconfont iconDelete">
                {/*<FormattedMessage id="delete" />*/}
              </a>
            </Tooltip>
          </AuthWrapper>
          <AuthWrapper functionName="f_picturePort_1">
            <Tooltip placement="top" title={<FormattedMessage id="Setting.Move" />}>
              <a style={styles.link} onClick={this._showModal} className="iconfont iconbtn-move">
                {/*<FormattedMessage id="move" />*/}
              </a>
            </Tooltip>
          </AuthWrapper>
        </div>
        <div style={styles.box}>
          {(imageList || fromJS([])).map((item, index) => {
            return (
              <div style={styles.boxItem} key={item.get('resourceId')}>
                <Checkbox checked={item.get('checked')} onChange={this._onchangeChecked.bind(this, index)} />
                <img src={item.get('artworkUrl')} alt="" width="120" height="120" />
                <Input style={{width:'100%',marginTop:8,overflow:"Hidden",textOverflow: "ellipsis"}}
                       defaultValue={item.get('resourceName')}
                       onBlur={(e) => {
                         this._updateImage(e, item.get('resourceName'), item.get('resourceId'));
                       }}
                />
              </div>
            );
          })}
        </div>
        {(imageList || fromJS([])).size == 0 ? (
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

  /**
   * 删除图片
   */
  _delete = () => {
    const { imageList, doDelete } = this.props.relaxProps;
    const err = (window as any).RCi18n({id:'Setting.deleteFirst'});
    const title = (window as any).RCi18n({id:'Setting.Prompt'});
    const content = (window as any).RCi18n({id:'Setting.deleteTheSelectedPicture'});
    if (imageList.filter((item) => item.get('checked') == true).size < 1) {
      message.error(err);
      return;
    }
    confirm({
      title: title,
      content: content,
      onOk() {
        doDelete();
      }
    });
  };

  /**
   * 显示分类列表
   * @private
   */
  _showModal = () => {
    const { imageList, showMoveImageModal } = this.props.relaxProps;
    const err = (window as any).RCi18n({id:'Setting.moveFirst'});
    if (imageList.filter((item) => item.get('checked') == true).size < 1) {
      message.error(err);
      return;
    }
    showMoveImageModal(true);
  };

  /**
   * 修改图片名称
   * @param imageId
   * @private
   */
  _updateImage = (e, oldVal, imageId: string) => {
    //修改了图片名称才真正的请求接口进行修改
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

      const { editImage } = this.props.relaxProps;
      editImage(imageId, e.target.value);
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
    const { queryImagePage } = this.props.relaxProps;
    //如果选中分类，则分页要在该分类下进行
    queryImagePage({ pageNum: pageNum - 1, pageSize: pageSize });
  };
}

export default injectIntl(ImageList);

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
  link: {
    marginLeft: '10px'
  },
  box: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: '20px'
  } as any,
  boxItem: {
    width: '140px',
    padding: '10px',
    marginRight: '15px',
    marginBottom: '15px',
    position: 'relative',
    border: '1px solid #ddd',
    borderRadius: '4px'
  },
  detail: {
    height: '20px',
    lineHeight: '20px',
    overflow: 'hidden'
  },
  checkitem: {
    position: 'absolute',
    left: '10px',
    right: '10px'
  },
  page: {
    float: 'right',
    marginTop: '20px',
    marginBottom: '20px'
  }
} as any;
