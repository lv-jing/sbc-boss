import React from 'react';
import { IMap, Relax } from 'plume2';
import { Button, Modal, message } from 'antd';
import { noop, AuthWrapper } from 'qmkit';

@Relax
export default class ButtonGroup extends React.Component<any, any> {
  props: {
    form?: any;
    relaxProps?: {
      onAdd: Function;
      batchConfirm: Function;
      searchForm: IMap;
      selected: any;
    };
  };

  static relaxProps = {
    onAdd: noop,
    batchConfirm: noop,
    searchForm: 'searchForm',
    selected: 'selected'
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { onAdd, searchForm } = this.props.relaxProps;
    const checkState = searchForm.get('checkState');

    return (
      <div className="handle-bar">
        <AuthWrapper functionName="editInvoice">
          <Button type="primary" onClick={() => onAdd()}>
            新增资质
          </Button>
        </AuthWrapper>
        {checkState === '0' && (
          <AuthWrapper functionName="changeInvoice">
            <Button onClick={() => this._showBatchAudit()}>批量审核</Button>
          </AuthWrapper>
        )}
      </div>
    );
  }

  _showBatchAudit = () => {
    const { batchConfirm, selected } = this.props.relaxProps;
    if (selected.isEmpty()) {
      message.error('请选择要操作的行');
      return;
    }

    const confirm = Modal.confirm;
    confirm({
      title: '通过增票资质',
      content: '是否确认通过已选增票资质？',
      onOk() {
        batchConfirm();
      }
    });
  };
}
