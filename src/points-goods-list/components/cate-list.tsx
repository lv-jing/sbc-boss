import * as React from 'react';
import {Relax} from 'plume2';
import {fromJS, List} from 'immutable';
import {Modal, Table} from 'antd';
import {DragDropContext, DragSource, DropTarget} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import {AuthWrapper, noop} from 'qmkit';

declare type IList = List<any>;
const confirm = Modal.confirm;

const styles = {
  edit: {
    paddingRight: 10
  }
};


@Relax
class CateList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      cateList: IList;
      cateSort: Function;
      showEditModal: Function;
      deleteCate: Function;
      editFlag: Function;
    };
  };

  static relaxProps = {
    // 积分商品分类
    cateList: 'cateList',
    //拖拽排序
    cateSort: noop,
    // 展示修改框
    showEditModal: noop,
    // 删除
    deleteCate: noop,
    //更改是否平台可用
    editFlag: noop
  };

  render() {
    const { cateList } = this.props.relaxProps;
    return (
      <Table
        rowKey="cateId"
        columns={this._columns}
        dataSource={cateList.toJS()}
        components={this.components}
        pagination={false}
        onRow={(_record, index) => ({
          index,
          moveRow: this._moveRow
        })}
      />
    );
  }

  components = {
    body: {
      row: _BodyRow
    }
  };

  _columns = [
    {
      title: '分类名称',
      dataIndex: 'cateName',
      key: 'cateName',
    },
    {
      title: '操作',
      key: 'option',
      render: (rowInfo) => this._getOption(rowInfo)
    }
  ];

  /**
   * 获取操作项
   */
  _getOption = (rowInfo) => {
    console.log('rowInfo===',rowInfo)
    // rowInfo = fromJS(rowInfo);
    return (

        <div>
          <AuthWrapper functionName={'f_points_goods_cate_edit'}>
            <a
              style={styles.edit}
              onClick={this._showEditModal.bind(this,rowInfo)}
            >
              编辑
            </a>
          </AuthWrapper>

          <AuthWrapper functionName={'f_points_goods_cate_del'}>
            <a onClick={this._delete.bind(this, rowInfo.cateId)}>
              删除
            </a>
          </AuthWrapper>
        </div>
    );
  };

  /**
   * 显示修改弹窗
   */
  _showEditModal = (rowInfo:object) => {
    const { showEditModal } = this.props.relaxProps;
    showEditModal(fromJS(rowInfo), false);
  };

  /**
   * 删除
   */
  _delete = async (couponCateId) => {
    const { deleteCate } = this.props.relaxProps;
    confirm({
      title: '提示',
      content: '确定删除该分类？',
      okText: '确定',
      cancelText: '取消',
      iconType: 'exclamation-circle',
      onOk() {
        deleteCate(couponCateId);
      }
    });
  };

  /**
   * 拖拽排序
   * @param dragIndex  拖拽排序源
   * @param hoverIndex 拖拽排序目标位置
   * @private
   */
  _moveRow = (dragIndex, hoverIndex) => {
    const { cateSort } = this.props.relaxProps;
    cateSort(dragIndex, hoverIndex);
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

export default DragDropContext(HTML5Backend)(CateList);
