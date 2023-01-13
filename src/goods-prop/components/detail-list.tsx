import * as React from 'react';
import { Table, Button, Popconfirm } from 'antd';
import UUID from 'uuid-js';
import DetailCell from './detail-cell';
import { IMap, IList } from 'typings/globalType';
import { isNumber } from 'util';
import styled from 'styled-components';

const TableBox = styled.div`
  .ant-form-item {
    margin-bottom: 0;
  }
`;

export default class DetailList extends React.Component<any, any> {
  props: {
    form?: any;
    history?: any;
    oneProp: IMap;
    deleteList: IList;
    initDetailList: Function;
    deleteDetail: Function;
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { oneProp } = this.props;
    const columns = this._columns;
    const goodsPropDetails =
      oneProp.get('goodsPropDetails') === undefined
        ? []
        : oneProp.get('goodsPropDetails').toJS();
    return (
      <TableBox className="ant-table-self">
        <Table
          rowKey="detailId"
          dataSource={goodsPropDetails}
          pagination={false}
          columns={columns}
        />
        <Button
          className="editable-add-btn"
          disabled={goodsPropDetails.length >= 100}
          onClick={this._handleAdd}
        >
          新增
        </Button>
      </TableBox>
    );
  }

  _columns = [
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      width: '30%',
      render: (text, record, index) => {
        return (
          <DetailCell
            id={index}
            detaiId={record.detailId}
            column={'sort'}
            value={text}
            onChange={this._onCellChange(index, 'sort')}
            form={this.props.form}
          />
        );
      }
    },
    {
      title: '属性值',
      dataIndex: 'detailName',
      width: '50%',
      key: 'detailName',
      render: (text, record, index) => {
        return (
          <DetailCell
            id={index}
            detaiId={record.detailId}
            column={'detailName'}
            value={text}
            onChange={this._onCellChange(index, 'detailName')}
            form={this.props.form}
          />
        );
      }
    },
    {
      title: '操作',
      key: 'action',
      dataIndex: 'operation',
      render: (_text, _record, index) => {
        return (
          <Popconfirm title="确定删除?" onConfirm={() => this._onDelete(index)}>
            <a href="javascript:;">删除</a>
          </Popconfirm>
        );
      }
    }
  ];

  _onCellChange = (index, dataIndex) => {
    return (value) => {
      const { initDetailList, oneProp } = this.props;
      const prop = oneProp.toJS();
      const { goodsPropDetails } = prop;
      const target = goodsPropDetails[index];
      if (target) {
        target[dataIndex] = value;
        initDetailList(prop);
      }
    };
  };

  _onDelete = (index) => {
    const { oneProp, initDetailList, deleteList, deleteDetail } = this.props;
    const prop = oneProp.toJS();
    let { goodsPropDetails } = prop;
    if (goodsPropDetails) {
      let detail = goodsPropDetails[index];
      let dlist = deleteList.toJS();
      goodsPropDetails = goodsPropDetails.filter((_item, ind) => ind !== index);
      if (isNumber(Number(detail.detailId))) {
        detail.delFlag = 1;
        dlist.push(detail);
      }
      prop.goodsPropDetails = goodsPropDetails;
      deleteDetail(dlist);
      initDetailList(prop);
    }
  };

  _handleAdd = () => {
    let { oneProp, initDetailList } = this.props;
    const prop = oneProp.toJS();
    const goodsPropDetails = prop.goodsPropDetails ? prop.goodsPropDetails : [];
    let newData = {
      detailId: UUID.create().toString(),
      propId: prop.propId,
      detailName: '',
      delFlag: 0,
      sort: 0
    };
    goodsPropDetails.push(newData);
    prop.goodsPropDetails = goodsPropDetails;
    initDetailList(prop);
  };
}
