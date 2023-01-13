import React from 'react';
import { Relax } from 'plume2';
import { Button, Modal, message } from 'antd';
import { AuthWrapper, noop } from 'qmkit';
import { List } from 'immutable';

const confirm = Modal.confirm;

@Relax
export default class ButtonGroup extends React.Component<any, any> {
  props: {
    relaxProps?: {
	    onBatchDelete: Function;
      selected: List<number>;
      onAdd: Function;
    };
  };

  static relaxProps = {
    onBatchDelete: noop,
    selected: 'selected',
    onAdd: noop
  };

  render() {
    const { onAdd } = this.props.relaxProps;

    return (
      <div className="handle-bar">
        <AuthWrapper functionName={'f_add_words'}>
          <Button type="primary" onClick={() => onAdd()}>
            新增
          </Button>
        </AuthWrapper>
        <AuthWrapper functionName={'f_delete_words'}>
          <Button type="primary" onClick={() => this._batchDelete()}>
            批量删除
          </Button>
        </AuthWrapper>
      </div>
    );
  }

  _batchDelete = () => {
    const { onBatchDelete, selected } = this.props.relaxProps;
    if (selected.isEmpty()) {
      message.error('请选择要操作的行');
      return;
    }
	  confirm({
		  title: '批量删除',
		  content: '是否确认删除已选敏感词？删除后不可恢复。',
		  onOk() {
			  onBatchDelete();
		  },
		  onCancel() {}
	  });
  };

}
