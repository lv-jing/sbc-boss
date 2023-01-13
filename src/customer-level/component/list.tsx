import React from 'react';
import { Relax } from 'plume2';
import { DataGrid, noop } from 'qmkit';
const { Column } = DataGrid;
import { List } from 'immutable';
import { Menu, Popconfirm } from 'antd';

type TList = List<any>;

@Relax
export default class ListView extends React.Component<any, any> {
  props: {
    relaxProps?: {
      data: TList;
      pageSize: number;
      total: number;
      currentPage: number;
      loading: boolean;
      init: Function;
      onEdit: Function;
      onDelete: Function;
    };
  };

  static relaxProps = {
    loading: 'loading',
    pageSize: 'pageSize',
    total: 'total',
    currentPage: 'currentPage',
    data: ['dataList'],
    init: noop,
    onEdit: noop,
    onDelete: noop
  };

  render() {
    const {
      data,
      loading,
      init,
      pageSize,
      total,
      currentPage,
      onEdit,
      onDelete
    } = this.props.relaxProps;

    return (
      <DataGrid
        loading={loading}
        rowKey="customerLevelId"
        pagination={{
          pageSize,
          total,
          current: currentPage,
          onChange: (pageNum, pageSize) => {
            init({ pageNum: pageNum - 1, pageSize });
          }
        }}
        dataSource={data.toJS()}
      >
        <Column
          title="等级名称"
          key="customerLevelName"
          dataIndex="customerLevelName"
        />

        <Column
          title="操作"
          render={(rowInfo) => {
            const { customerLevelId, isDefalt } = rowInfo;
            return isDefalt == 0 ? (
              <div>
                <a
                  href="javascript:void(0);"
                  onClick={() => onEdit(customerLevelId)}
                  style={{ marginRight: 5 }}
                >
                  编辑
                </a>
                <Popconfirm
                  title={
                    <div>
                      <h2 style={styles.title}>确定要删除当前等级吗？</h2>
                      <p style={styles.grey}>
                        删除后商家的客户等级策略将会失效
                      </p>
                    </div>
                  }
                  onConfirm={() => {
                    onDelete(customerLevelId);
                  }}
                  okText="确定"
                  cancelText="取消"
                >
                  <a href="javascript:void(0);">删除</a>
                </Popconfirm>
              </div>
            ) : (
              <a
                href="javascript:void(0);"
                onClick={() => onEdit(customerLevelId)}
              >
                编辑
              </a>
            );
          }}
        />
      </DataGrid>
    );
  }

  _renderMenu = (id: string) => {
    const { onEdit, onDelete } = this.props.relaxProps;

    return (
      <Menu>
        <Menu.Item key="0">
          <a href="javascript:void(0);" onClick={() => onEdit(id)}>
            编辑
          </a>
        </Menu.Item>

        <Menu.Item key="1">
          <Popconfirm
            title={
              <div>
                <h2 style={styles.title}>确定要删除当前等级吗？</h2>
                <p style={styles.grey}>删除后商家的客户等级策略将会失效</p>
              </div>
            }
            onConfirm={() => {
              onDelete(id);
            }}
            okText="确定"
            cancelText="取消"
          >
            <a href="javascript:void(0);">删除</a>
          </Popconfirm>
        </Menu.Item>
        <Menu.Divider />
      </Menu>
    );
  };
}

const styles = {
  title: {
    fontSize: 14
  },
  grey: {
    color: '#666',
    fontSize: 12
  }
};
