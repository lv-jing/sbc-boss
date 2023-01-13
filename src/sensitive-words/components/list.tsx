import React from 'react';
import { Relax } from 'plume2';
import { AuthWrapper, DataGrid, noop,Const } from 'qmkit';
import { List ,fromJS} from 'immutable';
import {Modal} from 'antd';
import Moment from 'moment';

type TList = List<any>;

const { Column } = DataGrid;
const confirm = Modal.confirm;

const styles = {
	edit: {
		paddingRight: 10
	}
} as any;

@Relax
export default class SensitiveWordsList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      loading: boolean;
      selected: TList;
      total: number;
      pageSize: number;
      dataList: TList;
      onSelect: Function;
      onDelete: Function;
      onEdit: Function;
      init: Function;
      roles: any[];
      onEnable: Function;
      switchModal: Function;
      current: number;
    };
  };

  static relaxProps = {
    loading: 'loading',
    total: 'total',
    selected: 'selected',
    pageSize: 'pageSize',
    dataList: 'dataList',
    onDelete: noop,
    onEdit: noop,
    onSelect: noop,
    init: noop,
    current: 'current'
  };

  render() {
    const {
      loading,
      total,
      pageSize,
      dataList,
      onSelect,
      init,
      current,
	    selected
    } = this.props.relaxProps;
    return (
      <DataGrid
        loading={loading}
        rowSelection={{
          type: 'checkbox',
	        selectedRowKeys: selected.toJS(),
          onChange: (selectedRowKeys) => {
            onSelect(selectedRowKeys);
          }
        }}
        rowKey="sensitiveId"
        pagination={{
          pageSize,
          total,
          current: current,
          onChange: (pageNum, pageSize) => {
            init({ pageNum: pageNum - 1, pageSize });
          }
        }}
        dataSource={dataList.toJS()}
      >
        <Column title="敏感词内容" key="sensitiveWords" dataIndex="sensitiveWords" />
        <Column title="添加时间" key="createTime" dataIndex="createTime" 
        render={
          (createTime) => Moment(createTime).format(Const.TIME_FORMAT).toString()
        }
        />
        <Column
          title="操作"
          key="option"
          width={180}
          render={(rowInfo) => {
			      rowInfo = fromJS(rowInfo);
			      return (
              <div>
                <AuthWrapper functionName={'f_add_words'}>
                  <a style={styles.edit}
                    onClick={() => this._onEditWords(rowInfo.get('sensitiveId'))}
                  >
                    编辑
                  </a>
                </AuthWrapper>
                <AuthWrapper functionName={'f_delete_words'}>
                  <a onClick={() => this._onDeleteWords(rowInfo.get('sensitiveId'))}>
                    删除
                  </a>
                </AuthWrapper>
              </div>
			      );
		      }}
        />

      </DataGrid>
    );
  }
	_onEditWords = (sensitiveId) => {
		const { onEdit } = this.props.relaxProps;
		onEdit(sensitiveId);
	};

	_onDeleteWords = (sensitiveId) => {
		const { onDelete } = this.props.relaxProps;
		confirm({
			title: '确认删除',
			content: '是否确认删除敏感词？删除后不可恢复。',
			onOk() {
				onDelete(sensitiveId);
			},
			onCancel() {}
		});

	};
}
