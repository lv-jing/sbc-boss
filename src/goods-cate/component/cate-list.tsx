import * as React from 'react';
import { Relax } from 'plume2';
import { List, Map, fromJS } from 'immutable';
import { Modal, message, Table } from 'antd';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { noop, QMFloat, history, AuthWrapper } from 'qmkit';

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
      cates: IList;
      allCates: IList;
      goodsFlag: boolean;
      childFlag: boolean;

      cateSort: Function;
      showEditModal: Function;
      setParentRate: Function;
      validGoods: Function;
      validChild: Function;
      doDelete: Function;
    };
  };

  static relaxProps = {
    // 父子结构的分类
    cates: 'cates',
    // 平台全部分类集合
    allCates: 'allCates',
    // 下面是否有商品
    goodsFlag: 'goodsFlag',
    // 子分类
    childFlag: 'childFlag',

    //拖拽排序
    cateSort: noop,
    // 展示修改框
    showEditModal: noop,
    // 设置父类目扣率
    setParentRate: noop,
    // 检查类目下面有没有商品
    validGoods: noop,
    // 是否有子分类
    validChild: noop,
    // 删除
    doDelete: noop
  };

  render() {
    const { cates } = this.props.relaxProps;
    return (
      <Table
        rowKey="cateId"
        columns={this._columns}
        dataSource={cates.toJS()}
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
      title: '类目名称',
      dataIndex: 'cateName',
      key: 'cateName',
      width: '30%',
      className: 'namerow'
    },
    {
      title: '类目图片',
      dataIndex: 'cateImg',
      key: 'cateImg',
      render: (img) =>
        img ? (
          <img
            src={img}
            style={{ width: 40, height: 40, display: 'inline-block' }}
          />
        ) : (
          '-'
        )
    },
    {
      title: '类目扣率',
      dataIndex: 'cateRate',
      key: 'cateRate',
      render: (rate) => QMFloat.addZero(rate ? rate : '0.00') + '%'
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
      <div>
        {rowInfo.get('cateGrade') != 3 && rowInfo.get('isDefault') != 1 ? (
          <AuthWrapper functionName={'f_goods_cate_1'}>
            <a
              style={styles.edit}
              onClick={this._addChildrenCate.bind(
                this,
                rowInfo.get('cateId'),
                rowInfo.get('cateName'),
                rowInfo.get('cateRate'),
                rowInfo.get('cateGrade')
              )}
            >
              添加子类目
            </a>
          </AuthWrapper>
        ) : null}
        {rowInfo.get('isDefault') != 1 ? (
          <AuthWrapper functionName={'f_goods_cate_1'}>
            <a
              style={styles.edit}
              onClick={this._showEditModal.bind(
                this,
                rowInfo.get('cateId'),
                rowInfo.get('cateName'),
                rowInfo.get('cateParentId'),
                rowInfo.get('cateImg'),
                rowInfo.get('cateRate'),
                rowInfo.get('isParentCateRate')
              )}
            >
              编辑
            </a>
          </AuthWrapper>
        ) : null}
        {rowInfo.get('isDefault') != 1 ? (
          <AuthWrapper functionName={'f_goods_cate_2'}>
            <a onClick={this._delete.bind(this, rowInfo.get('cateId'))}>删除</a>
          </AuthWrapper>
        ) : null}
        {rowInfo.get('cateGrade') === 3 ? (
          <a
            onClick={() =>
              history.push({
                pathname: `/goods-prop/${rowInfo.get('cateId')}`,
                state: { cateName: rowInfo.get('cateName') }
              })
            }
            style={{ marginLeft: 10 }}
          >
            属性
          </a>
        ) : null}
      </div>
    );
  };

  /**
   * 显示修改弹窗
   */
  _showEditModal = (
    cateId: string,
    cateName: string,
    cateParentId: number,
    cateImg: string,
    cateRate: boolean,
    isParentCateRate: number
  ) => {
    const { showEditModal, allCates, setParentRate } = this.props.relaxProps;
    let cateParentName = '';
    let cateParentRate = 0;
    let cateGrade = 0;
    if (cateParentId > 0) {
      const parent = allCates
        .filter((item) => item.get('cateId') === cateParentId)
        .get(0);
      cateParentName = parent.get('cateName');
      cateParentRate = parent.get('cateRate');
      cateGrade = parent.get('cateGrade');
    }
    let cateInfo = Map({
      cateId,
      cateName,
      cateParentName,
      cateParentId,
      cateImg,
      cateRate,
      cateGrade,
      isParentCateRate
    });
    setParentRate(cateParentRate);
    showEditModal(cateInfo, false);
  };

  /**
   * 删除
   */
  _delete = async (cateId: string) => {
    const { validGoods, validChild } = this.props.relaxProps;
    await validGoods(cateId);
    await validChild(cateId);
    this._confirm(cateId);
  };

  /**
   * 删除
   */
  _confirm = (cateId: string) => {
    const { doDelete, childFlag, goodsFlag } = this.props.relaxProps;
    if (goodsFlag) {
      //该分类下有商品
      Modal.warning({
        title: '提示',
        content: '当前类目已关联了商品，暂时不可删除。',
        okText: '关闭'
      });
    } else if (childFlag) {
      //有子分类
      confirm({
        title: '提示',
        content:
          '删除当前类目，该类目下的所有类目也会删除，您确认删除这个类目吗？',
        okText: '确定',
        cancelText: '取消',
        iconType: 'exclamation-circle',
        onOk() {
          doDelete(cateId);
        }
      });
    } else {
      confirm({
        title: '提示',
        content: '确定删除该类目？',
        okText: '确定',
        cancelText: '取消',
        iconType: 'exclamation-circle',
        onOk() {
          doDelete(cateId);
        }
      });
    }
  };

  /**
   * 添加子类目
   */
  _addChildrenCate = (
    cateParentId: string,
    cateParentName: string,
    cateRate: number,
    cateGrade: number
  ) => {
    const { showEditModal, setParentRate, allCates } = this.props.relaxProps;
    if (allCates.count((f) => f.get('cateParentId') == cateParentId) >= 20) {
      message.error('该父类下最多支持20个类目');
      return;
    }
    showEditModal(Map({ cateParentId, cateParentName, cateGrade }), true);
    setParentRate(cateRate);
  };

  /**
   * 拖拽排序
   * @param dragIndex  拖拽排序源
   * @param hoverIndex 拖拽排序目标位置
   * @private
   */
  _moveRow = (catePath, dragIndex, hoverIndex) => {
    const { cateSort } = this.props.relaxProps;
    cateSort(catePath, dragIndex, hoverIndex);
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
    //判断两个拖拽目标是不是同一级
    if (sourceCate.cateParentId != targetCate.cateParentId) {
      return;
    }
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;
    //自己不能和自己换位置
    if (dragIndex === hoverIndex) {
      return;
    }
    //拖拽排序方法
    props.moveRow(sourceCate.catePath, dragIndex, hoverIndex);
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
