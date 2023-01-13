import * as React from 'react';
import { Relax } from 'plume2';
import { List, Map, fromJS } from 'immutable';
import { Modal, Table } from 'antd';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { noop, AuthWrapper } from 'qmkit';

declare type IList = List<any>;
const confirm = Modal.confirm;

@Relax
class CateList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      grouponCateList: IList;
      cateSort: Function;
      showEditModal: Function;
      doDelete: Function;
    };
  };

  static relaxProps = {
    // 拼团分类
    grouponCateList: 'grouponCateList',
    // 拖拽排序
    cateSort: noop,
    // 展示修改框
    showEditModal: noop,
    // 删除
    doDelete: noop
  };

  render() {
    const { grouponCateList } = this.props.relaxProps;
    return (
      <Table
        rowKey="grouponCateId"
        columns={this._columns}
        dataSource={grouponCateList.toJS()}
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
      dataIndex: 'grouponCateName',
      key: 'grouponCateName',
      width: '30%',
      className: 'namerow'
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
    rowInfo = fromJS(rowInfo);
    return (
      <div className="operation-box">
        <AuthWrapper functionName={'f_groupon_cate_editor'}>
          <a
            onClick={this._showEditModal.bind(
              this,
              rowInfo.get('grouponCateId'),
              rowInfo.get('grouponCateName')
            )}
          >
            编辑
          </a>
        </AuthWrapper>
        {rowInfo.get('defaultCate') == 0 && (
          <AuthWrapper functionName={'f_groupon_cate_delete'}>
            <a onClick={this._delete.bind(this, rowInfo.get('grouponCateId'))}>
              删除
            </a>
          </AuthWrapper>
        )}
      </div>
    );
  };

  /**
   * 显示修改弹窗
   */
  _showEditModal = (grouponCateId: string, grouponCateName: string) => {
    const { showEditModal } = this.props.relaxProps;

    let cateInfo = Map({
      grouponCateId,
      grouponCateName
    });
    showEditModal(cateInfo, false);
  };

  /**
   * 删除
   */
  _delete = async (grouponCateId: string) => {
    const { doDelete } = this.props.relaxProps;
    confirm({
      title: '提示',
      content: '确定删除该分类？',
      okText: '确定',
      cancelText: '取消',
      iconType: 'exclamation-circle',
      onOk() {
        doDelete(grouponCateId);
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
      index: props.index,
      cateInfo: props.children[0].props.record
    };
  }
};

const _rowTarget = {
  drop(props, monitor) {
    //源对象
    const sourceCate = monitor.getItem().cateInfo;
    //目标对象
    const targetCate = props.children[0].props.record;
    // 如果源对象或目标对象是默认分类，则不允许排序
    if (sourceCate.defaultCate == 1 || targetCate.defaultCate == 1) {
      return;
    }

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
