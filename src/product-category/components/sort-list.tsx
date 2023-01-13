import React, { Component } from 'react';
import { Table, Tooltip, Popconfirm } from 'antd';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import { FormattedMessage } from 'react-intl';

type AlignType = 'left' | 'center' | 'right';

class SortList extends Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  components = {
    body: {
      row: _BodyRow
    }
  };

  _columns = [
    {
      title: <FormattedMessage id="Product.DescriptionName" />,
      dataIndex: 'descriptionName',
      key: 'descName'
    },
    {
      title: <FormattedMessage id="Product.DisplayName" />,
      key: 'dipName',
      render: (text, record) => (
        <div>
          {record.translateList && record.translateList.length
            ? record.translateList
                .filter((r) => r.translateName.trim() !== '')
                .map((r) => r.translateName)
                .join(';')
            : ''}
        </div>
      )
    },
    {
      title: <FormattedMessage id="Product.Operation" />,
      align: 'center' as AlignType,
      key: 'action',
      render: (_text, _record, _index) => (
        <Popconfirm placement="topLeft" title={<FormattedMessage id="Product.deleteThisItem" />} onConfirm={() => this.deleteRow(_index)} okText={<FormattedMessage id="Product.Confirm" />} cancelText={<FormattedMessage id="Product.Cancel" />}>
          <Tooltip placement="top" title="Delete">
            <a className="iconfont iconDelete"></a>
          </Tooltip>
        </Popconfirm>
      )
    }
  ];

  deleteRow = (index: number) => {
    const { onDeleteRow } = this.props;
    onDeleteRow(index);
  };

  moveRow = (dragIndex, hoverIndex) => {
    const { dataList, onSortEnd } = this.props;
    const dragRow = dataList[dragIndex];
    let sortList = update(dataList, {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, dragRow]
      ]
    });
    onSortEnd(sortList);
  };

  render() {
    const { dataList } = this.props;
    return (
      <Table
        rowKey="id"
        columns={this._columns}
        dataSource={dataList}
        onRow={(_record, index) => ({
          index,
          moveRow: this.moveRow
        })}
        components={this.components}
        pagination={false}
        size="middle"
      />
    );
  }
}

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

let _BodyRow = (props) => {
  const { isOver, connectDragSource, connectDropTarget, moveRow, dragRow, clientOffset, sourceClientOffset, initialClientOffset, ...restProps } = props;
  const style = { ...restProps.style, cursor: 'move' };
  let className = restProps.className;
  if (isOver && initialClientOffset) {
    const direction = _dragDirection(dragRow.index, restProps.index, initialClientOffset, clientOffset, sourceClientOffset);
    if (direction === 'downward') {
      className += ' drop-over-downward';
    }
    if (direction === 'upward') {
      className += ' drop-over-upward';
    }
  }
  return connectDragSource(connectDropTarget(<tr {...restProps} className={className} style={style} />));
};

const _rowSource = {
  beginDrag(props) {
    return {
      index: props.index
    };
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

let _dragDirection = (dragIndex, hoverIndex, initialClientOffset, clientOffset, sourceClientOffset) => {
  const hoverMiddleY = (initialClientOffset.y - sourceClientOffset.y) / 2;
  const hoverClientY = clientOffset.y - sourceClientOffset.y;
  if (dragIndex < hoverIndex && hoverClientY > hoverMiddleY) {
    return 'downward';
  }
  if (dragIndex > hoverIndex && hoverClientY < hoverMiddleY) {
    return 'upward';
  }
};

export default DragDropContext(HTML5Backend)(SortList);
