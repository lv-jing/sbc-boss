import * as React from 'react';
import { Relax } from 'plume2';
import { noop, checkAuth } from 'qmkit';
import { List, Map, fromJS } from 'immutable';
import { Table, Popconfirm, Switch, message, Tooltip } from 'antd';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import { FormattedMessage } from 'react-intl';

declare type IList = List<any>;

const styles = {
  edit: {
    paddingRight: 10
  }
};

@Relax
class RelatedProduct extends React.Component<any, any> {
  props: {
    relaxProps?: {
      relatedList: IList;
      getConsentDelete: Function;
      propSort: Function;
      showEditModal: Function;
      onSwitch: Function;
      pageChange: Function;
      linkStatus: any;
      onRelatedList: Function;
      enterpriseFlag: any;
    };
  };

  static relaxProps = {
    relatedList: 'relatedList',
    getConsentDelete: noop,
    showEditModal: noop,
    propSort: noop,
    onSwitch: noop,
    pageChange: noop,
    linkStatus: 'linkStatus',
    onRelatedList: noop,
    enterpriseFlag: 'enterpriseFlag'
  };

  componentDidMount() {
    //const { onRelatedList } = this.props.relaxProps;
    //onRelatedList();
  }

  render() {
    const { relatedList, enterpriseFlag } = this.props.relaxProps;

    return (
      <Table
        id="consent"
        rowKey="tabId"
        columns={this._columns}
        dataSource={relatedList && relatedList.toJS()}
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

  components = {
    body: {
      row: _BodyRow
    }
  };
  _columns = [
    {
      title: <FormattedMessage id="Product.Image" />,
      dataIndex: 'goodsImg',
      key: 'goodsImg',
      /*render: (text, record, index) => `${index + 1}` + <img src={text.goodsImg} alt=""/>*/
      render: (text, record, index) => {
        return <img src={record.goodsImg} width="24" />;
      }
    },
    {
      title: <FormattedMessage id="Product.SPU" />,
      dataIndex: 'goodsNo',
      key: 'goodsNo'
      /*render: (text) => {
        let html = { __html: text };
        return <div dangerouslySetInnerHTML={html}></div>;
      }*/
    },
    {
      title: <FormattedMessage id="Product.ProductName" />,
      dataIndex: 'goodsName',
      key: 'goodsName'
    },
    {
      title: <FormattedMessage id="Product.SalesCategory" />,
      dataIndex: 'storeCateName',
      key: 'storeCateName'
    },
    {
      title: <FormattedMessage id="Product.ProductCategory" />,
      dataIndex: 'goodsCateName',
      key: 'goodsCateName'
    },
    {
      title: <FormattedMessage id="Product.brand" />,
      dataIndex: 'brandName',
      key: 'brandName'
    },

    // {
    //   title: <FormattedMessage id="Product.Operation" />,
    //   dataIndex: 'operation',
    //   key: 'operation',
    //   render: (_text, _record) => this._getOption(_record)
    // }
  ];
  onChange = (checked, id) => {
    const { onSwitch } = this.props.relaxProps;
    //let linkStatus = checked === true ? 0 : 1;

    onSwitch({ id, openFlag: checked == true ? 1 : 0 });
  };
  confirm = (check, id) => {
    this.onChange(!check, id);
    // this.setState({ showSwich: true });
    // message.success('Click on Yes');
  };
  cancel = () => {
    message.info(<FormattedMessage id="Product.canceled" />);
  };
  /**
   * 获取操作项
   */
  _getOption = (rowInfo) => {
    const { onSwitch, pageChange, linkStatus } = this.props.relaxProps;
    rowInfo = fromJS(rowInfo);
    const check = +rowInfo.get('openFlag') === 0 ? false : true;
    // const check = +linkStatus === 0 ? true : false;
    return (
      <div className="operation flex-end">
        {/* <Popconfirm
          className="deleted"
          title={<FormattedMessage id="Product.ConfirmDeletion" />}
          onConfirm={() => {
            const { getConsentDelete } = this.props.relaxProps;
            getConsentDelete(rowInfo.get('id'));
          }}
        >
          <Tooltip placement="top" title={<FormattedMessage id="Product.Delete" />}>
            <a href="javascript:void(0)" className="iconfont iconDelete"></a>
          </Tooltip>
        </Popconfirm> */}
      </div>
    );
  };

  /**
   * 显示修改弹窗
   */
  _showEditModal = (tabId: string, tabName: string) => {
    const { showEditModal } = this.props.relaxProps;
    let tabInfo = Map({
      tabId,
      tabName
    });
    showEditModal(tabInfo);
  };

  moveRow = (dragIndex, hoverIndex) => {
    /*if (hoverIndex == 0 || dragIndex == 0) {
      return;
    }*/
    const { relatedList, propSort } = this.props.relaxProps;
    const dragRow = relatedList.toJS()[dragIndex];
    let sortList = update(relatedList.toJS(), {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, dragRow]
      ]
    });
    let sort = [];
    let obj = { exchangeSortList: [] };
    sortList.map((item, index) => {
      sort.push({
        id: item.id,
        sort: index
      });
    });
    obj.exchangeSortList = sort;

    propSort(obj);
  };
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
export default DragDropContext(HTML5Backend)(RelatedProduct);
