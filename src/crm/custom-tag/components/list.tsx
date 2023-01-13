
import React from 'react';
import { Relax } from 'plume2';
import { AuthWrapper, DataGrid, noop } from 'qmkit';
import { IList } from 'typings/globalType';
import { Popconfirm } from 'antd';

@Relax
export default class List extends React.Component<any, any> {
  props: {
    relaxProps?: {
      total: number;
      pageNum: number;
      pageSize: number;
      tagList: IList;
      init: Function;
      setEdit: Function;
      setVisible: Function;
      setTagObj: Function;
      deleteTag: Function;
    };
  };

  static relaxProps = {
    total: 'total',
    pageNum: 'pageNum',
    pageSize: 'pageSize',
    tagList: 'tagList',
    setEdit: noop,
    init: noop,
    setVisible: noop,
    setTagObj: noop,
    deleteTag: noop
  };

  render() {
    const {
      total,
      pageNum,
      pageSize,
      tagList,
      setEdit,
      init,
      setVisible,
      setTagObj,
      deleteTag
    } = this.props.relaxProps;
    return (
      <DataGrid
        rowKey={(record) => record.couponId}
        dataSource={tagList.toJS()}
        pagination={{
          current: pageNum,
          pageSize,
          total,
          onChange: (pageNum, pageSize) => {
            init({ pageNum: pageNum - 1, pageSize });
          }
        }}
      >
        <DataGrid.Column
          title="标签名称"
          dataIndex="name"
          key="name"
        />
        <DataGrid.Column
          title="操作"
          key="operate"
          dataIndex="isFree"
          render={(_text, record) => {
            return (
              <div>
                <AuthWrapper functionName={'f_tag_edit'}>
                  <a href="javascript:;" style={{ marginRight: 10 }} onClick={() => {
                    setEdit(true);
                    setVisible(true);
                    setTagObj(record)
                  }}>
                    编辑
                    </a>
                </AuthWrapper>
                <AuthWrapper functionName={'f_tag_del'}>
                  <Popconfirm
                    title="确定删除该标签？"
                    onConfirm={() => deleteTag((record as any).id)}
                    okText="确定"
                    cancelText="取消"
                  >
                    <a href="javascript:void(0);">删除</a>
                  </Popconfirm>
                </AuthWrapper>
              </div>
            );
          }}
        />
      </DataGrid>
    );
  }
}
