import * as React from 'react';
import { Table, Switch, Popconfirm, Button, message } from 'antd';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import { Relax } from 'plume2';
import { IList } from 'typings/globalType';
import { noop, history } from 'qmkit';
import PropModal from './prop-modal';

const MODAL_TITILE_ADD = '新增属性';
const MODAL_TITILE_EDIT = '编辑属性';

@Relax
class PropSortingTable extends React.Component {
  props: {
    history?: any;
    relaxProps?: {
      propList: IList;
      propSort: Function;
      editIndex: Function;
      deleteProp: Function;
      editVisible: Function;
      eidtTitle: Function;
      initDetailList: Function;
      onFormFieldChange: Function;
    };
  };

  static relaxProps = {
    history: 'history',
    propList: 'propList',
    propSort: noop,
    editIndex: noop,
    deleteProp: noop,
    editVisible: noop,
    eidtTitle: noop,
    initDetailList: noop,
    onFormFieldChange: noop
  };

  render() {
    const { propList } = this.props.relaxProps;
    return (
      <div>
        {propList.size == 0 && (
          <Button
            type="primary"
            style={{ marginBottom: 20 }}
            onClick={() => this._addProp()}
          >
            新增属性
          </Button>
        )}
        <Table
          rowKey="propId"
          columns={this._columns}
          dataSource={propList.toJS()}
          components={this.components}
          pagination={false}
          size="middle"
          onRow={(_record, index) => ({
            index,
            moveRow: this._moveRow
          })}
        />
        <PropModal />
      </div>
    );
  }

  components = {
    body: {
      row: _BodyRow
    }
  };

  _columns = [
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort'
    },
    {
      title: '属性名称',
      dataIndex: 'propName',
      key: 'propName'
    },
    {
      title: '属性值',
      dataIndex: 'propDetailStr',
      key: 'propDetailStr'
    },
    {
      title: '开启索引',
      key: 'indexFlag',
      render: (_text, record) => (
        <div>
          <Switch
            checkedChildren="开"
            unCheckedChildren="关"
            onChange={(checked) => {
              const { editIndex } = this.props.relaxProps;
              editIndex(record, checked);
            }}
            defaultChecked={record.indexFlag === 1}
          />
        </div>
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_text, record) => (
        <span>
          <a
            href="javascript:;"
            style={{ marginRight: 10 }}
            onClick={() => this._lastAdd(record)}
          >
            下方新增
          </a>
          <a
            href="javascript:;"
            style={{ marginRight: 10 }}
            onClick={() => this._editProp(record)}
          >
            编辑
          </a>
          <Popconfirm
            title="确认删除?"
            onConfirm={() => {
              const { deleteProp } = this.props.relaxProps;
              deleteProp(record);
            }}
          >
            <a href="javascript:;">删除</a>
          </Popconfirm>
        </span>
      )
    }
  ];
  _addProp = () => {
    const {
      editVisible,
      eidtTitle,
      initDetailList,
      onFormFieldChange
    } = this.props.relaxProps;
    let { pathname } = history.location;
    let paths = pathname.split('/');
    let cateId = paths[paths.length - 1];
    initDetailList({ cateId: cateId, lastPropId: null, indexFlag: 1 });
    onFormFieldChange({ key: 'propName', value: '' });
    eidtTitle(MODAL_TITILE_ADD);
    editVisible(true);
  };
  _lastAdd = (record) => {
    const {
      editVisible,
      eidtTitle,
      initDetailList,
      onFormFieldChange,
      propList
    } = this.props.relaxProps;
    if (propList.size >= 20) {
      message.error('商品类目最多可关联20个属性');
      return;
    }
    initDetailList({
      cateId: record.cateId,
      lastPropId: record.propId,
      goodsProps: propList.toJS(),
      indexFlag: 1
    });
    onFormFieldChange({ key: 'propName', value: '' });
    eidtTitle(MODAL_TITILE_ADD);
    editVisible(true);
  };

  _editProp = (record) => {
    const {
      editVisible,
      eidtTitle,
      initDetailList,
      onFormFieldChange
    } = this.props.relaxProps;
    let goodsProp = JSON.stringify(record);
    let propName = record.propName + '';
    onFormFieldChange({ key: 'propName', value: propName });
    initDetailList(JSON.parse(goodsProp));
    eidtTitle(MODAL_TITILE_EDIT);
    editVisible(true);
  };

  _moveRow = (dragIndex, hoverIndex) => {
    const { propList, propSort } = this.props.relaxProps;
    const dragRow = propList.toJS()[dragIndex];
    let sortList = update(propList.toJS(), {
      $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]]
    });
    propSort(sortList);
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
    if (dragIndex === hoverIndex) {
      return;
    }
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

export default DragDropContext(HTML5Backend)(PropSortingTable);
