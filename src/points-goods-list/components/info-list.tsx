import React from 'react';
import { Relax } from 'plume2';
import { AuthWrapper, Const, noop } from 'qmkit';
import { Modal, Table } from 'antd';
import { IList } from 'typings/globalType';

const confirm = Modal.confirm;
const styles = {
  edit: {
    paddingRight: 10
  }
} as any;

@Relax
export default class InfoList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      loading: boolean;
      total: number;
      pageSize: number;
      dataList: IList;
      current: number;
      checkedIds: IList;
      onDelete: Function;
      onEdit: Function;
      queryPage: Function;
      modifyStatus: Function;
    };
  };

  static relaxProps = {
    loading: 'loading',
    total: 'total',
    pageSize: 'pageSize',
    dataList: 'dataList',
    current: 'current',
    checkedIds: 'checkedIds',
    onDelete: noop,
    onEdit: noop,
    queryPage: noop,
    modifyStatus: noop
  };

  render() {
    const {
      loading,
      total,
      pageSize,
      dataList,
      current,
      queryPage
    } = this.props.relaxProps;
    return (
      <Table
        rowKey="pointsGoodsId"
        loading={loading}
        dataSource={dataList.toJS()}
        columns={this._columns}
        pagination={{
          total,
          pageSize,
          current: current,
          onChange: (pageNum, pageSize) => {
            queryPage({ pageNum: pageNum - 1, pageSize });
          }
        }}
      />
    );
  }

  /**
   * 列表数据的column信息
   */
  _columns = [
    {
      key: 'goodsInfoName',
      dataIndex: 'goodsInfo.goodsInfoName',
      title: '商品名称',
      width: '16%'
    },
    {
      key: 'goods',
      dataIndex: 'goodsInfo.goodsInfoNo',
      title: 'SKU编码',
      width: '6%'
    },
    {
      key: 'specText',
      dataIndex: 'specText',
      title: '规格',
      width: '9%'
    },
    {
      key: 'marketPrice',
      dataIndex: 'goodsInfo.marketPrice',
      title: '市场价',
      width: '6%',
      render: (data) => '￥' + (data == null ? 0 : data)
    },
    {
      key: 'settlementPrice',
      dataIndex: 'settlementPrice',
      title: '结算价',
      width: '6%',
      render: (data) => '￥' + data
    },
    {
      key: 'pointsGoodsCate',
      dataIndex: 'pointsGoodsCate.cateName',
      title: '分类',
      width: '6%'
    },
    {
      key: 'recommendFlag',
      dataIndex: 'recommendFlag',
      title: '推荐',
      width: '3%',
      render: (data) => (data == 0 ? '否' : '是')
    },
    {
      key: 'stock',
      dataIndex: 'stock',
      title: '剩余库存',
      width: '6%'
    },
    {
      key: 'points',
      dataIndex: 'points',
      title: '兑换积分',
      width: '6%'
    },
    {
      key: 'validity',
      dataIndex: 'validity',
      title: '兑换时间',
      width: '9%'
    },
    {
      key: 'pointsGoodsStatus',
      dataIndex: 'pointsGoodsStatus',
      title: '活动状态',
      width: '5%',
      render: (pointsGoodsStatus) => {
        return Const.activityStatus[pointsGoodsStatus];
      }
    },
    {
      key: 'status',
      title: <p>启用<br/>停用</p>,
      width: '5%',
      render: (rowInfo) => (rowInfo.status == 0 ? '停用' : '启用')
    },
    {
      key: 'option',
      title: '操作',
      width: '7%',
      render: (rowInfo) => this._getOption(rowInfo)
    }
  ];

  /**
   * 获取操作项
   */
  _getOption = (rowInfo) => {
    return (
      <div>
        <AuthWrapper functionName={'f_points_goods_edit'}>
          {rowInfo.pointsGoodsStatus == 3 && (
            <a
              style={styles.edit}
              onClick={() => this._onEdit(rowInfo.pointsGoodsId)}
            >
              编辑
            </a>
          )}
        </AuthWrapper>
        <AuthWrapper functionName={'f_points_goods_status_modify'}>
          {rowInfo.pointsGoodsStatus != 4 && (
            <a
              style={styles.edit}
              onClick={() =>
                this._modifyStatus({
                  id: rowInfo.pointsGoodsId,
                  status: rowInfo.status
                })
              }
            >
              {rowInfo.status == 0 ? '启用' : '停用'}
            </a>
          )}
        </AuthWrapper>
        <AuthWrapper functionName={'f_points_goods_del'}>
          {rowInfo.pointsGoodsStatus == 3 && (
            <a onClick={() => this._onDelete(rowInfo.pointsGoodsId)}>删除</a>
          )}
        </AuthWrapper>
        {rowInfo.pointsGoodsStatus == 4 && '-'}
      </div>
    );
  };

  /**
   * 编辑信息
   */
  _onEdit = (id) => {
    const { onEdit } = this.props.relaxProps;
    onEdit(id);
  };

  /**
   * 单个删除信息
   */
  _onDelete = (id) => {
    const { onDelete } = this.props.relaxProps;
    confirm({
      title: '确认删除',
      content: '是否确认删除？删除后不可恢复。',
      onOk() {
        onDelete(id);
      },
      onCancel() {}
    });
  };

  /**
   * 启用/停用
   */
  _modifyStatus = ({ id, status }) => {
    const { modifyStatus } = this.props.relaxProps;
    // 如果开始状态是账号启用/店铺开启, 点击展示弹框
    if (status == 0) {
      modifyStatus({ pointsGoodsId: id, status: 1 });
    } else if (status == 1) {
      modifyStatus({ pointsGoodsId: id, status: 0 });
    }
  };
}
