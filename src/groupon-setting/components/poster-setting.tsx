import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';
import { AuthWrapper, noop, checkAuth } from 'qmkit';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { Form, Button, message, Alert } from 'antd';
import Store from '../store';
import { Relax } from 'plume2';
import { fromJS } from 'immutable';

const FormItem = Form.Item;

@Relax
class PosterSetting extends React.Component<any, any> {
  _store: Store;

  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  static relaxProps = {
    chooseImgs: 'chooseImgs',
    addLink: noop,
    savePoster: noop,
    deleteItem: noop,
    imgSort: noop,
    toggleOperate: noop
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
  }

  render() {
    const store = this._store as any;
    const { chooseImgs } = this.props.relaxProps;
    return (
      <Form
        className="login-form"
        style={{ paddingBottom: 50 }}
        onSubmit={this._handleSubmit}
      >
        <div>
          <Alert
            message=""
            description={
              <div>
                <p>
                  1、设置拼团活动首页广告，最多添加5张轮播广告图片，以轮播形式展示;
                </p>
                <p>2、通过图片拖拽实现顺序排列，靠上方图片展示中靠前;</p>
                <p>3、点击图片可编辑页面跳转和进行页面删除;</p>
              </div>
            }
            type="info"
          />
          <p style={{ marginBottom: 16 }}>
            移动端广告，共{chooseImgs.count()}张图片
          </p>
          <Button
            type="primary"
            icon="plus"
            onClick={() => store.toggleModal()}
          >
            添加图片
          </Button>

          <div
            style={{ display: 'flex', flexDirection: 'column', marginTop: 16 }}
          >
            <Table
              rowKey="index"
              columns={this._columns}
              dataSource={chooseImgs.toJS()}
              components={this.components}
              pagination={false}
              onRow={(_record, index) => ({
                index,
                moveRow: this._moveRow
              })}
            />
          </div>

          <div className="bar-button">
            <AuthWrapper functionName="f_edit_groupon_poster">
              <FormItem style={{ paddingTop: 5 }}>
                <Button type="primary" onClick={this._handleSubmit}>
                  保存
                </Button>
              </FormItem>
            </AuthWrapper>
          </div>
        </div>
      </Form>
    );
  }

  components = {
    body: {
      row: _BodyRow
    }
  };

  _columns = [
    {
      title: '图片',
      dataIndex: 'artworkUrl',
      key: 'artworkUrl',
      render: (text, data) => {
        return (
          <div
            className="groupon-setting-poster-img"
            onMouseEnter={() => this._toggleOperate(data, true)}
            onMouseLeave={() => this._toggleOperate(data, false)}
          >
            <img style={{ maxWidth: 500, maxHeight: 200 }} src={text} />
            {data.hover && (
              <div className="groupon-setting-poster-img-hover">
                <span
                  className="groupon-setting-poster-img-hover-text"
                  style={{ marginRight: 20 }}
                  onClick={() => this._addLink(fromJS(data))}
                >
                  链接
                </span>
                <span
                  className="groupon-setting-poster-img-hover-text"
                  onClick={() => this._deleteItem(fromJS(data))}
                >
                  删除
                </span>
              </div>
            )}
          </div>
        );
      }
    }
  ];

  /**
   * 检查文件格式
   */
  _beforeUpload(file, size) {
    const isSupportImage =
      file.type === 'image/jpeg' ||
      file.type === 'image/gif' ||
      file.type == 'image/png';
    if (!isSupportImage) {
      message.error('只能上传jpg, png, gif类型的图片');
    }
    const isLt = file.size / 1024 < size;
    if (!isLt) {
      message.error(`图片大小不能超过${size}KB!`);
    }
    return isSupportImage && isLt;
  }

  /**
   * 改变图片
   */
  onImgChange = (key, { file, fileList }) => {
    switch (file.status) {
      case 'error':
        message.error('上传失败');
        break;
      case 'removed':
        this._store.fieldsValue(['reward', key], []);
        this.props.form.setFieldsValue({ [key]: null });
        break;
      default:
        let response = fileList[0].response;
        this.props.form.setFieldsValue({
          [key]: response ? response[0] : ''
        });
        this._store.fieldsValue(['reward', key], fileList);
    }
  };

  /**
   * 提交
   */
  _handleSubmit = () => {
    const { savePoster } = this.props.relaxProps;
    if (!checkAuth('f_edit_groupon_poster')) {
      return;
    }
    savePoster();
  };

  /**
   * 添加链接
   */
  _addLink = (img) => {
    const { addLink } = this.props.relaxProps;
    addLink(img);
  };

  /**
   * 删除图片
   */
  _deleteItem = (img) => {
    const { deleteItem } = this.props.relaxProps;
    deleteItem(img);
  };

  /**
   * 拖拽排序
   * @param dragIndex  拖拽排序源
   * @param hoverIndex 拖拽排序目标位置
   * @private
   */
  _moveRow = (dragIndex, hoverIndex) => {
    const { imgSort } = this.props.relaxProps;
    imgSort(dragIndex, hoverIndex);
  };

  //展示操作按钮
  _toggleOperate = (data, hover) => {
    const { toggleOperate } = this.props.relaxProps;
    toggleOperate(data, hover);
  };
}

let _dragDirection = (
  dragIndex,
  hoverIndex,
  initialClientOffset,
  clientOffset,
  sourceClientOffset
) => {
  const hoverMiddleY = (initialClientOffset.y - sourceClientOffset.y) / 2;
  const hoverClientY = clientOffset.y - sourceClientOffset.y;
  if (dragIndex < hoverIndex && hoverClientY > hoverMiddleY) {
    return 'downward';
  }
  if (dragIndex > hoverIndex && hoverClientY < hoverMiddleY) {
    return 'upward';
  }
};

let _BodyRow = (props) => {
  const {
    isOver,
    connectDragSource,
    connectDropTarget,
    moveRow,
    dragRow,
    clientOffset,
    sourceClientOffset,
    initialClientOffset,
    ...restProps
  } = props;
  const style = { ...restProps.style, cursor: 'move' };
  let className = restProps.className;
  if (isOver && initialClientOffset) {
    const direction = _dragDirection(
      dragRow.index,
      restProps.index,
      initialClientOffset,
      clientOffset,
      sourceClientOffset
    );
    if (direction === 'downward') {
      className += ' drop-over-downward';
    }
    if (direction === 'upward') {
      className += ' drop-over-upward';
    }
  }
  return connectDragSource(
    connectDropTarget(<tr {...restProps} className={className} style={style} />)
  );
};

const _rowSource = {
  beginDrag(props) {
    return {
      index: props.index
    };
  }
};

const _rowTarget = {
  drop(props, monitor) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;
    //自己不能和自己换位置
    if (dragIndex === hoverIndex) {
      return;
    }
    //拖拽排序方法
    props.moveRow(dragIndex, hoverIndex);
    monitor.getItem().index = hoverIndex;
  }
};

_BodyRow = DropTarget('row', _rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  sourceClientOffset: monitor.getSourceClientOffset()
}))(
  DragSource('row', _rowSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    dragRow: monitor.getItem(),
    clientOffset: monitor.getClientOffset(),
    initialClientOffset: monitor.getInitialClientOffset()
  }))(_BodyRow)
);

export default DragDropContext(HTML5Backend)(PosterSetting);
